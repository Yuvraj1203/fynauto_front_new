// cookie-utils.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * SET COOKIE
 */
export const setMiddlewareCookie = (
  res: NextResponse,
  name: string,
  value: string,
  options: any = {}
) => {
  res.cookies.set({
    name,
    value,
    path: options.path ?? "/",
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? true,
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * GET COOKIE
 */
export const getMiddlewareCookie = (req: NextRequest, name: string) => {
  return req.cookies.get(name)?.value;
};

/**
 * GET ALL COOKIES
 */
export const getAllMiddlewareCookies = (req: NextRequest) => {
  return req.cookies.getAll(); // returns { name, value }[]
};

/**
 * DELETE COOKIE
 */
export const deleteMiddlewareCookie = (
  res: NextResponse,
  name: string,
  options: any = {}
) => {
  res.cookies.set({
    name,
    value: "",
    maxAge: 0,
    path: options.path ?? "/",
  });
};

/**
 * CLEAR ALL COOKIES
 * NOTE: only works in middleware (because we have access to response.cookies)
 */
export const clearAllMiddlewareCookies = (
  req: NextRequest,
  res: NextResponse
) => {
  const allCookies = req.cookies.getAll();
  allCookies.forEach((cookie) => {
    res.cookies.set({
      name: cookie.name,
      value: "",
      maxAge: 0,
      path: "/",
    });
  });
};
