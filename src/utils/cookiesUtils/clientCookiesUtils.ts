// src/utils/cookiesUtils/browserCookiesUtil.ts
import { CookiesType } from "@/services/types";
import Cookies from "js-cookie";

export const setBrowserCookie = (
  name: CookiesType,
  value: string,
  options: Cookies.CookieAttributes = {}
) => {
  Cookies.set(name, value, {
    path: "/", // Ensure available across the app
    sameSite: "Lax",
    ...options,
  });
};

export const getBrowserCookie = (name: CookiesType): string | undefined => {
  return Cookies.get(name);
};

export const getAllBrowserCookies = (): Record<string, string> => {
  return Cookies.get(); // returns all cookies as an object
};

export const deleteBrowserCookie = (
  name: string,
  options: Cookies.CookieAttributes = {}
) => {
  Cookies.remove(name, {
    path: "/",
    ...options,
  });
};

export const clearAllBrowserCookies = () => {
  const all = Cookies.get();
  Object.keys(all).forEach((cookieName) => {
    Cookies.remove(cookieName, { path: "/" });
  });
};
