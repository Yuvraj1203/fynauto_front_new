"use client";

import { CustomSpinner } from "@/components/custom";
import { Routes } from "@/navigation/routes";
import { CookiesType, LayoutTypes } from "@/services/types";
import { getBrowserCookie } from "@/utils/cookiesUtils/clientCookiesUtils";
import { useAuth0 } from "@auth0/auth0-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ProtectedRoute = ({ children }: LayoutTypes) => {
  const router = useRouter();
  const pathname = usePathname();

  // always call hooks unconditionally
  const auth0 = useAuth0();

  // avoid branching on cookie during SSR/first paint //skip hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLocalAuth = useMemo(() => {
    if (!mounted) return null; // unknown until client mounted
    return getBrowserCookie(CookiesType.isAuthenticated) === "true";
  }, [mounted]);

  // Decide final auth state
  const isLoading = !mounted ? true : isLocalAuth ? false : auth0.isLoading;
  const isAuthenticated = !mounted
    ? false
    : isLocalAuth
    ? true
    : auth0.isAuthenticated;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `${Routes.public.login}?redirect=${encodeURIComponent(pathname)}`
      );
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CustomSpinner />
      </div>
    );
  }

  if (isAuthenticated) return <>{children}</>;

  return null;
};

export default ProtectedRoute;
