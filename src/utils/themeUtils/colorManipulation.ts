import { TenantColorsType, themeEnum } from "@/services/types";

export const colorManipulation = (tenant: TenantColorsType) => {
  const tenantColor = (theme: themeEnum) => {
    const isLight = theme == themeEnum.light;

    const finalColors = {
      /* PRIMARY */
      "--primary-50": tenant[theme].primary50,
      "--primary-100": tenant[theme].primary100,
      "--primary-200": tenant[theme].primary200,
      "--primary-300": tenant[theme].primary300,
      "--primary-400": tenant[theme].primary400,
      "--primary-500": tenant[theme].primary500,
      "--primary-600": tenant[theme].primary600,
      "--primary-700": tenant[theme].primary700,
      "--primary-800": tenant[theme].primary800,
      "--primary-900": tenant[theme].primary900,
      "--primary": tenant[theme].primary,
      "--onPrimary": tenant[theme].onPrimary,

      /* SECONDARY */
      "--secondary-50": tenant[theme].secondary50,
      "--secondary-100": tenant[theme].secondary100,
      "--secondary-200": tenant[theme].secondary200,
      "--secondary-300": tenant[theme].secondary300,
      "--secondary-400": tenant[theme].secondary400,
      "--secondary-500": tenant[theme].secondary500,
      "--secondary-600": tenant[theme].secondary600,
      "--secondary-700": tenant[theme].secondary700,
      "--secondary-800": tenant[theme].secondary800,
      "--secondary-900": tenant[theme].secondary900,
      "--secondary": tenant[theme].secondary,
      "--onSecondary": tenant[theme].onSecondary,

      /* DEFAULT */
      "--default-50": isLight ? "#fafafa" : "#0d0d0e",
      "--default-100": isLight ? "#f2f2f3" : "#19191c",
      "--default-200": isLight ? "#ebebec" : "#26262a",
      "--default-300": isLight ? "#e3e3e6" : "#323238",
      "--default-400": isLight ? "#dcdcdf" : "#3f3f46",
      "--default-500": isLight ? "#d4d4d8" : "#65656b",
      "--default-600": isLight ? "#afafb2" : "#8c8c90",
      "--default-700": isLight ? "#8a8a8c" : "#b2b2b5",
      "--default-800": isLight ? "#656567" : "#d9d9da",
      "--default-900": isLight ? "#404041" : "#ffffff",

      "--default": isLight ? "#d4d4d8" : "#3f3f46",
      "--onDefault": isLight ? "#000" : "#fff",

      /* SUCCESS */
      "--success-50": isLight ? "#e2f8ec" : "#073c1e",
      "--success-100": isLight ? "#b9efd1" : "#0b5f30",
      "--success-200": isLight ? "#91e5b5" : "#0f8341",
      "--success-300": isLight ? "#68dc9a" : "#13a653",
      "--success-400": isLight ? "#40d27f" : "#17c964",
      "--success-500": isLight ? "#17c964" : "#40d27f",
      "--success-600": isLight ? "#13a653" : "#68dc9a",
      "--success-700": isLight ? "#0f8341" : "#91e5b5",
      "--success-800": isLight ? "#0b5f30" : "#b9efd1",
      "--success-900": isLight ? "#073c1e" : "#e2f8ec",
      "--success": isLight ? "#40d27f" : "#40d27f",
      "--onSuccess": isLight ? "#000" : "#000",

      /* WARNING */
      "--warning-50": isLight ? "#fef4e4" : "#4a320b",
      "--warning-100": isLight ? "#fce4bd" : "#744e11",
      "--warning-200": isLight ? "#fad497" : "#9f6b17",
      "--warning-300": isLight ? "#f9c571" : "#ca881e",
      "--warning-400": isLight ? "#f7b54a" : "#f5a524",
      "--warning-500": isLight ? "#f5a524" : "#f7b54a",
      "--warning-600": isLight ? "#ca881e" : "#f9c571",
      "--warning-700": isLight ? "#9f6b17" : "#fad497",
      "--warning-800": isLight ? "#744e11" : "#fce4bd",
      "--warning-900": isLight ? "#4a320b" : "#fef4e4",
      "--warning": isLight ? "#f7b54a" : "#f7b54a",
      "--onWarning": isLight ? "#000" : "#000",

      /* DANGER */
      "--danger-50": isLight ? "#fee1eb" : "#49051d",
      "--danger-100": isLight ? "#fbb8cf" : "#73092e",
      "--danger-200": isLight ? "#f98eb3" : "#9e0c3e",
      "--danger-300": isLight ? "#f76598" : "#c80f4f",
      "--danger-400": isLight ? "#f53b7c" : "#f31260",
      "--danger-500": isLight ? "#f31260" : "#f53b7c",
      "--danger-600": isLight ? "#c80f4f" : "#f76598",
      "--danger-700": isLight ? "#9e0c3e" : "#f98eb3",
      "--danger-800": isLight ? "#73092e" : "#fbb8cf",
      "--danger-900": isLight ? "#49051d" : "#fee1eb",
      "--danger": isLight ? "#f31260" : "#f31260",
      "--onDanger": isLight ? "#000" : "#000",

      /* GLOBAL */
      "--background-0": isLight ? "#ffffff" : "#000000",
      "--foreground": isLight ? "#000000" : "#ffffff",

      "--content1": isLight ? "#ffffff" : "#18181b",
      "--onContent1": isLight ? "#000" : "#fff",

      "--content2": isLight ? "#f4f4f5" : "#27272a",
      "--onContent2": isLight ? "#000" : "#fff",

      "--content3": isLight ? "#e4e4e7" : "#3f3f46",
      "--onContent3": isLight ? "#000" : "#fff",

      "--content4": isLight ? "#d4d4d8" : "#52525b",
      "--onContent4": isLight ? "#000" : "#fff",

      "--overlay": isLight ? "#000000" : "#ffffff",
      "--focus": isLight ? "#006fee" : "#006fee",

      "--disabledOpacity": "0.5",

      /* paper theme */
      "--background": isLight ? "#f6f7f8" : "#121212",
      "--onBackground": isLight ? "#1A1A1A" : "#E6E6E6",
      "--surface": isLight ? "#fefeff" : "#262626",
      "--onSurface": isLight ? "#525252" : "#a3a3a3",
      "--primary-text": isLight ? "#171717" : "#f5f5f5",
      "--secondary-text": isLight ? "#737373" : "#a3a3a3",

      "--componentBg": isLight ? "#ffffff" : "#151515",
      "--componentBgHover": isLight ? "#f5f5f5" : "#3f3f3f",

      /* shadow */
      "--shadow-minimal": isLight
        ? "0px 1px 3px 0px #e6e6e6, 0px 1px 2px 0px #f0f0f0"
        : "0px 1px 3px 0px #111111, 0px 1px 2px 0px #1a1a1a",
      "--shadow-moderate": isLight
        ? "2px 8px 10px 0px #8aa4961f, -1px -1px 6px 0px #8aa4961f"
        : "2px 8px 10px 0px #8aa4961f, -1px -1px 6px 0px #8aa4961f",
    };
    return finalColors;
  };

  const lightColors = tenantColor(themeEnum.light);
  const darkColors = tenantColor(themeEnum.dark);

  // Convert object → CSS variables string
  const toCSSVars = (obj: Record<string, string>) =>
    Object.entries(obj)
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n");

  const populatedStyle = `
          :root.light {${toCSSVars(lightColors)}}
          :root.dark {${toCSSVars(darkColors)}}
          [data-theme="light"] {${toCSSVars(lightColors)}}
      `;
  return populatedStyle;
};
