import { CookiesType, LocaleEnum } from "@/services/types";
import { getCookie } from "@/utils/cookiesUtils/cookiesUtils";
import { NextIntlClientProvider } from "next-intl";
import * as React from "react";

const ServerProvider = async ({ children }: { children: React.ReactNode }) => {
  const locale = (await getCookie(CookiesType.locale)) || LocaleEnum.en; // for getting the language

  const messages = (await import(`@/translations/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default ServerProvider;
