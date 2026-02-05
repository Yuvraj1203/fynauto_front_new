import { NEXT_PUBLIC_API_BASE_URL } from "@/config/environment";
import axios from "axios";
import Cookies from "js-cookie";
import { BaseModel } from "./models";

export enum HttpMethodApi {
  Get = "get",
  Post = "post",
  Put = "put",
  Patch = "patch",
  Delete = "delete",
}

export type RequestOptions = {
  endpoint: string;
  method: HttpMethodApi;
  params?: Record<string, any>;
  data?: Record<string, any> | FormData;
  headers?: Record<string, string>;
  withoutBaseModel?: boolean;
};

const axiosClient = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  timeout: 5 * 60 * 1000,
});

/* =================================== REFRESH TOKEN LOGIC ====================================== */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshTokenFyn");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(
      `${NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      { refreshToken },
    );

    const newToken = response.data.accessToken;

    Cookies.set("accessTokenFyn", newToken);
    return newToken;
  } catch (error) {
    throw error;
  }
};
/* ============================================================ */

/* ======================================= REQUEST INTERCEPTOR ================== */
axiosClient.interceptors.request.use(
  async (config) => {
    const res = await fetch("/api/auth/token");
    const { accessToken } = await res.json();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
/* ============================================================ */

/* ================================= RESPONSE INTERCEPTOR + AUTO RETRY ====================== */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue failed requests while refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
/* ============================================================ */

// --- Overload declarations ---
export async function makeRequest<T>(
  options: RequestOptions & { withoutBaseModel?: false },
): Promise<BaseModel<T>>;
export async function makeRequest<T>(
  options: RequestOptions & { withoutBaseModel: true },
): Promise<T>;

// --- Implementation ---
export async function makeRequest<T>({
  endpoint,
  method,
  data,
  params,
  headers = {},
  withoutBaseModel = false,
}: RequestOptions): Promise<BaseModel<T> | T> {
  try {
    const isForm = data instanceof FormData;

    // const token = Cookies.get("accessTokenFyn");

    // if (token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    const response = await axiosClient.request({
      url: endpoint,
      method,
      headers: {
        ...headers,
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        Accept: "application/json",
      },

      ...(method === HttpMethodApi.Get || method === HttpMethodApi.Delete
        ? { params: data || {} } //if get and delete only data will work
        : params //but if there are both type of data in req (query and json body)
          ? { params, data }
          : { data }),
    });

    if (withoutBaseModel) {
      return response.data;
    }

    const result = response.data as BaseModel<T>;

    // if (!result.success) {
    //   throw new Error(result.error?.message || "Something went wrong");
    // }

    if (!result.success) {
      throw new Error("Something went wrong");
    }

    return result;
  } catch (error: any) {
    // if (error.status == 401) {
    //   router.push("/authentication");
    // }

    throw new Error(error?.response?.data?.message || error.message);
  }
}

export async function makeFileRequest({
  endpoint,
  method,
  data,
  params,
  headers = {},
}: RequestOptions): Promise<Blob> {
  const token = Cookies.get("accessTokenFyn");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axiosClient.request<Blob>({
    url: endpoint,
    method,
    responseType: "blob", // 👈 IMPORTANT
    headers: {
      ...headers,
      Accept: headers["Accept"] || "application/octet-stream",
    },
    ...(method === HttpMethodApi.Get || method === HttpMethodApi.Delete
      ? { params: data }
      : params
        ? { params, data }
        : { data }),
  });

  return response.data;
}
