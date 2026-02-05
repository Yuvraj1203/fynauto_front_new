import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { NEXT_PUBLIC_API_BASE_URL } from "./config/environment";
import { Routes } from "./navigation/routes";
import { CookiesType } from "./services/types";
import {
  getMiddlewareCookie,
  setMiddlewareCookie,
} from "./utils/cookiesUtils/middlewareCookiesUtil";

const proxy = (request: NextRequest) => {
  const hostname = request.headers.get("host") || "";
  const subDomain = hostname.split(".")[0];

  const redirectUrl = new URL(request.url); // preserves path + query
  const path = redirectUrl.pathname;

  // Always create ONE response object
  let response = NextResponse.next();

  // Skip auth for these paths / file types
  const staticExtensions =
    /\.(js|css|map|ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot|gif|webp|mp4|pdf)$/i;

  if (
    path.startsWith("/_next") || // Next.js internals
    path.startsWith("/favicon.ico") || // favicon
    path.startsWith("/.well-known") || // system files
    path.startsWith("/robots.txt") || // optional
    staticExtensions.test(path) // static assets
  ) {
    return response;
  }

  // Set tenant cookie to use further to get details fro api
  if (subDomain !== "www" || subDomain !== NEXT_PUBLIC_API_BASE_URL) {
    setMiddlewareCookie(response, "tenant", subDomain);
  }

  // ignore these routes
  if (path.startsWith("/api")) {
    return response;
  }

  // Don't redirect auth routes as auth will be checked here
  const publicPaths = [
    Routes.public.login(),
    Routes.public.callback,
    Routes.public.error,
  ];
  if (publicPaths.some((p) => path.startsWith(p))) {
    return response;
  }

  //after redirection from auth and before continueing to protected route pass these checks

  const isAuthenticatedAuth0 = getMiddlewareCookie(
    request,
    CookiesType.isAuthEnable
  );

  //check if the user is normal authenticated
  const isAuthenticated = getMiddlewareCookie(
    request,
    CookiesType.isAuthenticated
  );

  // check if the user is not logged in from any of the two autherisation
  const isNotLoggedIn =
    !isAuthenticatedAuth0 && (isAuthenticated === "false" || !isAuthenticated);

  if (isNotLoggedIn) {
    // Not authenticated → redirect to login
    return NextResponse.redirect(new URL(Routes.public.login(), request.url), {
      headers: response.headers,
    });
  }

  //if authentication is done, allow redirects
  return response;
};

export default proxy;
