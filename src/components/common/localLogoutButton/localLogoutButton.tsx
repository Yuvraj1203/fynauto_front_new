"use client";

import { CustomButton } from "@/components/custom";
import { Routes } from "@/navigation/routes";
import { CookiesType, LayoutTypes } from "@/services/types";
import { setBrowserCookie } from "@/utils/cookiesUtils/clientCookiesUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const LocalLogoutButton = ({ className }: LayoutTypes) => {
  const t = useTranslations();
  const router = useRouter();
  //   const router;
  const handleLogout = () => {
    setBrowserCookie(CookiesType.isAuthenticated, "false");
    router.replace(Routes.public.login);
  };
  return (
    <CustomButton className={className} onClick={handleLogout}>
      {t("Logout")}
    </CustomButton>
  );
};

export default LocalLogoutButton;
