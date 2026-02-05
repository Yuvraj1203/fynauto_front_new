"use client";
import {
  LocalLogoutButton,
  LogoutButton,
  Text,
  TextVariant,
} from "@/components/common";
import {
  CustomAutoComplete,
  CustomDrawer,
  CustomSwitch,
} from "@/components/custom";
import { DrawerPlacement } from "@/components/custom/customDrawer/customDrawer";
import { ReactIcons } from "@/public";
import { CookiesType, LocaleEnum, themeEnum } from "@/services/types";
import { getBrowserCookie } from "@/utils/cookiesUtils/clientCookiesUtils";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Setting = () => {
  const t = useTranslations();
  const router = useRouter();
  const cookieTheme = Cookies.get(CookiesType.theme);
  const langCookie = Cookies.get(CookiesType.locale);
  const { setTheme, systemTheme } = useTheme();
  const isAuthEnable = getBrowserCookie(CookiesType.isAuthEnable);

  const [isDark, setIsDark] = useState(cookieTheme == themeEnum.dark);

  const languages = [
    { key: LocaleEnum.en, label: "En" },
    { key: LocaleEnum.hi, label: "Hi" },
  ];

  const [selectedLang, setSelectedLang] = useState(langCookie);

  const onLanguageChange = (value: string | number) => {
    if (value) {
      Cookies.set(CookiesType.locale, `${value}`);
      setSelectedLang(`${value}`);
      router.refresh();
    } else {
      setSelectedLang(`${value}`);
    }
  };

  useEffect(() => {
    if (langCookie) {
      setSelectedLang(langCookie);
    } else {
      Cookies.set(CookiesType.locale, LocaleEnum.en);
      setSelectedLang(LocaleEnum.en);
    }
  }, []);

  useEffect(() => {
    //check so that it wont change the theme by system theme on refresh
    if (!cookieTheme) {
      setTheme(
        systemTheme == themeEnum.dark ? themeEnum.dark : themeEnum.light
      );
      setIsDark(systemTheme == themeEnum.dark);
      Cookies.set(
        CookiesType.theme,
        systemTheme == themeEnum.dark ? themeEnum.dark : themeEnum.light
      );
    }
  }, [systemTheme]);

  useEffect(() => {
    setTheme(isDark ? themeEnum.dark : themeEnum.light);
    Cookies.set(CookiesType.theme, isDark ? themeEnum.dark : themeEnum.light);
  }, [isDark]);

  return (
    <CustomDrawer
      className="lg:w-80 p-0 rounded-none"
      headerStyle="py-2 px-4 text-base sm:text-lg lg:text-xl font-semibold"
      bodyStyle="py-2 px-4"
      title={t("ThemeConfig")}
      hideCloseFloating={false}
      placement={DrawerPlacement.right}
      renderContent={(onClose) => (
        <>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <Text variant={TextVariant.body}>{t("DarkMode")}</Text>
              <Text
                variant={TextVariant.caption}
                className="text-secondary-text"
              >
                {t("SwitchToDark")}
              </Text>
            </div>
            <CustomSwitch isSelected={isDark} setIsSelected={setIsDark} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <Text variant={TextVariant.body}>{t("Language")}</Text>
              <Text
                variant={TextVariant.caption}
                className="text-secondary-text"
              >
                {t("SelectLanguage")}
              </Text>
            </div>

            <CustomAutoComplete
              items={languages}
              defaultSelectedItem={selectedLang}
              onSelection={onLanguageChange}
              isRequired={true}
              label={t("Select")}
              className="w-28"
              clearIcon={false}
            />
          </div>
          <div className="grow flex items-end py-3">
            {isAuthEnable == "false" ? (
              <LocalLogoutButton className={"w-full"} />
            ) : (
              <LogoutButton className={"w-full"} />
            )}
          </div>
        </>
      )}
      trigger={
        <span className="hover:bg-background p-2 rounded-full duration-250 ">
          <ReactIcons.Setting
            size={24}
            className="text-outline cursor-pointer"
          />
        </span>
      }
    />
  );
};

export default Setting;
