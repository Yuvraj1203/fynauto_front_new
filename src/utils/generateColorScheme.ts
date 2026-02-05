import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";

type Input = {
  primary: string;
  secondary?: string;
  tertiary?: string;
};

export type Output = {
  light: Record<string, string | Record<string, string>>;
  dark: Record<string, string | Record<string, string>>;
};

export function getContrastText(hex: string): string {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16)) ?? [0, 0, 0];
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export const generateColorScheme = ({
  primary,
  secondary,
  tertiary,
}: Input): Output => {
  // 1. Generate individual themes
  const primaryTheme = themeFromSourceColor(argbFromHex(primary));
  const secondaryTheme = secondary
    ? themeFromSourceColor(argbFromHex(secondary))
    : null;
  const tertiaryTheme = tertiary
    ? themeFromSourceColor(argbFromHex(tertiary))
    : null;

  // 2. Helper to extract ARGB hex strings from theme object
  const extractColors = (scheme: any) => {
    const colorKeys = Object.keys(scheme);
    const colors: Record<string, string> = {};

    for (const key of colorKeys) {
      const value = scheme[key];
      if (typeof value === "number") {
        colors[key] = hexFromArgb(value);
      }
    }

    return colors;
  };

  // 3. Extract individual color sets
  const light = extractColors(primaryTheme.schemes.light.toJSON());
  const dark = extractColors(primaryTheme.schemes.dark.toJSON());

  // 4. Override secondary and tertiary containers from their own themes if provided
  if (secondaryTheme) {
    const secLight = extractColors(secondaryTheme.schemes.light.toJSON());
    const secDark = extractColors(secondaryTheme.schemes.dark.toJSON());

    light.secondary = secLight.secondary;
    light.onSecondary = secLight.onSecondary;
    light.secondaryContainer = secLight.secondaryContainer;
    light.onSecondaryContainer = secLight.onSecondaryContainer;

    dark.secondary = secDark.secondary;
    dark.onSecondary = secDark.onSecondary;
    dark.secondaryContainer = secDark.secondaryContainer;
    dark.onSecondaryContainer = secDark.onSecondaryContainer;
  }

  if (tertiaryTheme) {
    const terLight = extractColors(tertiaryTheme.schemes.light.toJSON());
    const terDark = extractColors(tertiaryTheme.schemes.dark.toJSON());

    light.tertiary = terLight.tertiary;
    light.onTertiary = terLight.onTertiary;
    light.tertiaryContainer = terLight.tertiaryContainer;
    light.onTertiaryContainer = terLight.onTertiaryContainer;

    dark.tertiary = terDark.tertiary;
    dark.onTertiary = terDark.onTertiary;
    dark.tertiaryContainer = terDark.tertiaryContainer;
    dark.onTertiaryContainer = terDark.onTertiaryContainer;
  }

  return { light, dark };
};
