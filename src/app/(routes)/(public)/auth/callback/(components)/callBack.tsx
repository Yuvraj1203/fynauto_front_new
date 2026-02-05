"use client";

import { Text, TextVariant } from "@/components/common";
import { CustomSpinner, SpinnerVariant } from "@/components/custom";
import { Routes } from "@/navigation/routes";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CallBack = () => {
  const { isAuthenticated, error, isLoading, loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace(Routes.protected.dashboard);
      } else if (error) {
        router.replace(Routes.public.error);
      } else {
        loginWithRedirect();
      }
    }
  }, [isLoading, isAuthenticated, error]);

  return (
    <>
      <Text variant={TextVariant.bodyLg}>
        {error ? "proceeding" : "Autherizing you"}
      </Text>
      <CustomSpinner variant={SpinnerVariant.gradient} />
    </>
  );
};

export default CallBack;
