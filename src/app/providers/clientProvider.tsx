"use client";

import { TenantInfoType } from "@/services/types";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import * as React from "react";
import AuthProvider from "./authProvider";

export type ClientProviderProps = {
  children: React.ReactNode;
  authInfo: TenantInfoType;
};

const ClientProvider = ({ children, authInfo }: ClientProviderProps) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider authInfo={authInfo}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <HeroUIProvider className="flex h-dvh w-full overflow-hidden">
            <ToastProvider maxVisibleToasts={2} />
            {children}
          </HeroUIProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ClientProvider;
