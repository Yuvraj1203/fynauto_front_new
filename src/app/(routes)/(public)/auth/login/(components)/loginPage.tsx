"use client";
import { Text, TextVariant } from "@/components/common";
import { CustomButton, CustomSpinner } from "@/components/custom";
import { Routes } from "@/navigation/routes";
import { CookiesType } from "@/services/types";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const t = useTranslations();

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = Cookies.get(CookiesType.isAuthEnable);

    if (auth === "true") {
      router.replace(Routes.public.callback);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    //extra check if auth is already there and it gets to login screen
    if (Cookies.get(CookiesType.isAuthEnable) === "true") {
      router.replace(Routes.protected.dashboard);
      setIsLoading(false);
      return;
    }
    Cookies.set(CookiesType.isAuthenticated, "true");
    router.replace(Routes.protected.dashboard);
    setIsLoading(false);
  };

  if (!isReady) return <CustomSpinner />;

  return (
    <div className="flex flex-col gap-2 lg:gap-4 bg-background w-full max-w-[380px] lg:max-w-[450px] px-4 sm:px-6 py-4 sm:py-6 md:px-8 rounded-medium">
      <Text variant={TextVariant.h3}>{t("WelcomeBack")}</Text>
      <Text>{t("PleaseEnterCred")}</Text>
      <CustomButton loading={isLoading} onClick={handleLogin}>
        {t("Login")}
      </CustomButton>
    </div>
  );
};

export default LoginPage;
