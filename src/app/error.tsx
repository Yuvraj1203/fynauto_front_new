"use client";

import { Text, TextVariant } from "@/components/common";
import { CustomButton } from "@/components/custom";
import { useTranslations } from "next-intl";

const GlobalError = ({ error, reset }: any) => {
  const t = useTranslations();
  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="text-center flex flex-col gap-4">
        <Text as="h2" variant={TextVariant.h2}>
          {t("SomethingWentWrong")}
        </Text>

        <CustomButton className="self-center" onClick={() => reset()}>
          {t("TryAgain")}
        </CustomButton>
      </div>
    </div>
  );
};
export default GlobalError;
