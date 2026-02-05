"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import * as React from "react";

export type ClientProviderProps = {
  children: React.ReactNode;
};

const ClientProvider = ({ children }: ClientProviderProps) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default ClientProvider;
