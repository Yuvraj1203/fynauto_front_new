"use client";

import { CookiesType } from "@/services/types";
import { Auth0Provider } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import { ClientProviderProps } from "./clientProvider";

const AuthProvider = ({ children, authInfo }: ClientProviderProps) => {
  if (!authInfo.isData) {
    Cookies.set(CookiesType.isAuthEnable, "false");
    if (!Cookies.get(CookiesType.isAuthenticated)) {
      Cookies.set(CookiesType.isAuthenticated, "false");
    }
  } else {
    Cookies.set(CookiesType.isAuthEnable, "true");
  }

  /**
   * During SSR + first client render → NO wrapping
   */
  if (!authInfo.isData) {
    return <>{children}</>;
  }

  /**
   * Wrap ONLY after hydration AND only if auth is enabled
   */
  return (
    <Auth0Provider
      useRefreshTokens
      cacheLocation="localstorage"
      domain={authInfo.domain!}
      clientId={authInfo.clientId!}
      authorizationParams={{
        redirect_uri: authInfo.redirect_uri,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
