import { NEXT_PUBLIC_API_SERVER_URL } from "@/config/environment";

// lib/serverApi.ts
export enum HttpMethodApi {
  Get = "get",
  Post = "post",
  Put = "put",
  Patch = "patch",
  Delete = "delete",
}

export interface ApiRequestOptions<TBody = any> {
  endpoint: string; // Full API URL
  url?: string;
  method?: HttpMethodApi; // GET, POST, etc.
  body?: TBody; // For POST/PUT
  query?: Record<string, any>; // Optional query params
  headers?: Record<string, string>;
  throwError?: boolean; // Auto-throw errors
  cache?: boolean;
}

export const serverApiRequest = async <TResponse = any, TBody = any>(
  options: ApiRequestOptions<TBody>,
): Promise<TResponse | null> => {
  const {
    endpoint,
    method = HttpMethodApi.Get,
    body,
    query,
    url,
    cache = false,
    headers = {},
    throwError = false,
  } = options;

  // Build query string
  const baseURL = NEXT_PUBLIC_API_SERVER_URL;
  let finalUrl = url ? url : `${baseURL}${endpoint}`;

  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query as any).toString();
    finalUrl += `?${params}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(cache ? { next: { revalidate: 3600 } } : { cache: "no-store" }),
  };

  if (body && method !== HttpMethodApi.Get) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(finalUrl, fetchOptions);

    if (!res.ok) {
      const error = await res.text();
      if (throwError) throw new Error(error);
      console.error("API Error:", error);
      return null;
    }

    const json = await res.json();
    return json as TResponse;
  } catch (err) {
    console.error("❌ serverApi error:", err);
    if (throwError) throw err;
    return null;
  }
};

/* EXAMPLE */

//get

// const companies = await serverApi<CompaniesModel>({
//   url: process.env.API_URL + "/companies",
//   query: {
//     page: 1,
//     size: 10,
//   },
// });

//post

// await serverApi({
//   url: process.env.API_URL + "/auth/login",
//   method: "POST",
//   body: {
//     username: "admin",
//     password: "123",
//   },
//   throwError: true,
// });

//put
// await serverApi({
//   url: process.env.API_URL + "/users/123",
//   method: "PUT",
//   body: { name: "New Name" },
// });

//delete
// await serverApi({
//   url: process.env.API_URL + "/users/123",
//   method: "PUT",
//   body: { name: "New Name" },
// });
