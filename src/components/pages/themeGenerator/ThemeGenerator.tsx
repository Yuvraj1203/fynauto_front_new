"use client";
import { ColorPopover, ProceedButton } from "@/components/common";
import { CustomImage } from "@/components/custom";
import { Images } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { SetTenantInfoModel } from "@/services/models";
import {
  useCurrentTenantInfoStore,
  useTenantDataStore,
} from "@/store/zustandStore";
import {
  generateColorScheme,
  getContrastText,
} from "@/utils/generateColorScheme";
import { showSnackbar } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

type ColorBoxProps = {
  label: DisplayColorKey;
  color: string;
  handleThemeColorsUpdate: (key: DisplayColorKey, value: string) => void;
  isCustomizable?: boolean;
};

export type ColorKey = keyof typeof colors.light;

type DisplayColorKey = keyof typeof displayColor.light;

export type ThemeColorSet = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;
  lightPrimaryContainer: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
};

export type ThemeColorsSetType = {
  light: ThemeColorSet;
  dark: ThemeColorSet;
};

export const colors = {
  light: {
    primary: "#7845AC",
    onPrimary: "#FFFFFF",
    primaryContainer: "#F0DBFF",
    onPrimaryContainer: "#2C0051",
    secondary: "#665A6F",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#EDDDF6",
    onSecondaryContainer: "#21182A",
    tertiary: "#805158",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFD9DD",
    onTertiaryContainer: "#321017",
    error: "#B71C1C",
    onError: "#FFFFFF",
    errorContainer: "#FFB4AB",
    onErrorContainer: "#410004",
    background: "#FFFFFF",
    onBackground: "#1A1A1A",
    surface: "#FFFFFF",
    onSurface: "#1A1A1A",
    surfaceVariant: "#E7E0EC",
    onSurfaceVariant: "#4E484F",
    outline: "#80787F",
    outlineVariant: "#D1CACF",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#2E2B2E",
    inverseOnSurface: "#F4EFF2",
    inversePrimary: "#A6CFFF",
    elevation: {
      level0: "#00000000",
      level1: "#F8F8FC",
      level2: "#F1F1F9",
      level3: "#EAEAF6",
      level4: "#E7E7F4",
      level5: "#E4E3F2",
    },
    surfaceDisabled: "#1A1A1A1F",
    onSurfaceDisabled: "#1A1A1A61",
    backdrop: "#33312F66",
    lightPrimaryContainer: "#85f9c025",
  },
  dark: {
    primary: "#DCB8FF",
    onPrimary: "#470C7A",
    primaryContainer: "#5F2B92",
    onPrimaryContainer: "#F0DBFF",
    secondary: "#D0C1DA",
    onSecondary: "#362C3F",
    secondaryContainer: "#4D4357",
    onSecondaryContainer: "#EDDDF6",
    tertiary: "#F3B7BE",
    onTertiary: "#4B252B",
    tertiaryContainer: "#653A41",
    onTertiaryContainer: "#FFD9DD",
    error: "#FFB4AB",
    onError: "#690003",
    errorContainer: "#93000A",
    onErrorContainer: "#FFB4AB",
    background: "#1A1A1A",
    onBackground: "#ECE0E4",
    surface: "#1A1A1A",
    onSurface: "#ECE0E4",
    surfaceVariant: "#4E484F",
    onSurfaceVariant: "#D1CACF",
    outline: "#A99FA8",
    outlineVariant: "#4E484F",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#ECE0E4",
    inverseOnSurface: "#2E2B2E",
    inversePrimary: "#2196F3",
    elevation: {
      level0: "#00000000",
      level1: "#2E2B2E",
      level2: "#363134",
      level3: "#3E393C",
      level4: "#413C40",
      level5: "#474146",
    },
    surfaceDisabled: "#ECE0E41F",
    onSurfaceDisabled: "#ECE0E461",
    backdrop: "#33312F66",
    lightPrimaryContainer: "#85f9c025",
  },
};

type DisplayColor = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
};

const requiredColorKeys: (keyof DisplayColor)[] = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "outline",
];

const displayColor = {
  light: {
    primary: colors.light.primary,
    onPrimary: colors.light.onPrimary,
    primaryContainer: colors.light.primaryContainer,
    onPrimaryContainer: colors.light.onPrimaryContainer,
    secondary: colors.light.secondary,
    onSecondary: colors.light.onSecondary,
    secondaryContainer: colors.light.secondaryContainer,
    onSecondaryContainer: colors.light.onSecondaryContainer,
    tertiary: colors.light.tertiary,
    onTertiary: colors.light.onTertiary,
    tertiaryContainer: colors.light.tertiaryContainer,
    onTertiaryContainer: colors.light.onTertiaryContainer,
    error: colors.light.error,
    onError: colors.light.onError,
    errorContainer: colors.light.errorContainer,
    onErrorContainer: colors.light.onErrorContainer,
    background: colors.light.background,
    onBackground: colors.light.onBackground,
    surface: colors.light.surface,
    onSurface: colors.light.onSurface,
    surfaceVariant: colors.light.surfaceVariant,
    onSurfaceVariant: colors.light.onSurfaceVariant,
    outline: colors.light.outline,
  },
  dark: {
    primary: colors.dark.primary,
    onPrimary: colors.dark.onPrimary,
    primaryContainer: colors.dark.primaryContainer,
    onPrimaryContainer: colors.dark.onPrimaryContainer,
    secondary: colors.dark.secondary,
    onSecondary: colors.dark.onSecondary,
    secondaryContainer: colors.dark.secondaryContainer,
    onSecondaryContainer: colors.dark.onSecondaryContainer,
    tertiary: colors.dark.tertiary,
    onTertiary: colors.dark.onTertiary,
    tertiaryContainer: colors.dark.tertiaryContainer,
    onTertiaryContainer: colors.dark.onTertiaryContainer,
    error: colors.dark.error,
    onError: colors.dark.onError,
    errorContainer: colors.dark.errorContainer,
    onErrorContainer: colors.dark.onErrorContainer,
    background: colors.dark.background,
    onBackground: colors.dark.onBackground,
    surface: colors.dark.surface,
    onSurface: colors.dark.onSurface,
    surfaceVariant: colors.dark.surfaceVariant,
    onSurfaceVariant: colors.dark.onSurfaceVariant,
    outline: colors.dark.outline,
  },
};

const getPairedColorKey = (
  key: DisplayColorKey,
): DisplayColorKey | undefined => {
  const pairMap: Record<DisplayColorKey, DisplayColorKey> = {
    primary: "onPrimary",
    onPrimary: "primary",
    primaryContainer: "onPrimaryContainer",
    onPrimaryContainer: "primaryContainer",
    secondary: "onSecondary",
    onSecondary: "secondary",
    secondaryContainer: "onSecondaryContainer",
    onSecondaryContainer: "secondaryContainer",
    tertiary: "onTertiary",
    onTertiary: "tertiary",
    tertiaryContainer: "onTertiaryContainer",
    onTertiaryContainer: "tertiaryContainer",
    error: "onError",
    onError: "error",
    errorContainer: "onErrorContainer",
    onErrorContainer: "errorContainer",
    background: "onBackground",
    onBackground: "background",
    surface: "onSurface",
    onSurface: "surface",
    surfaceVariant: "onSurfaceVariant",
    onSurfaceVariant: "surfaceVariant",
    outline: "background",
  };

  return pairMap[key];
};

type ThemeGeneratorProps = {
  handleProceed: () => void;
};

const ThemeGenerator = ({ handleProceed }: ThemeGeneratorProps) => {
  const themeColorStore = useTenantDataStore(); // store

  const mainColors = {
    primary: themeColorStore?.themeColors?.light?.primary ?? "#7845AC",
    secondary: themeColorStore?.themeColors?.light?.secondary ?? "#665A6F",
    tertiary: themeColorStore?.themeColors?.light?.tertiary ?? "#805158",
  };

  const [loading, setLoading] = useState(false);
  const [themeMainColors, setThemeMainColors] = useState({ ...mainColors });
  const [themeColors, setThemeColors] = useState(
    themeColorStore.themeColors.light?.primary
      ? { ...(themeColorStore.themeColors as ThemeColorsSetType) }
      : { ...colors },
  );
  const [themeDisplayColor, setThemeDisplayColor] = useState({
    ...displayColor,
  });
  const debounceColorUpdateRef = useRef(false);

  //display color gets set by colors accordingly as display color doesnt have all the keys
  const pickColorKeys = (
    source: Record<string, any>,
    keys: (keyof DisplayColor)[],
  ): DisplayColor =>
    Object.fromEntries(keys.map((key) => [key, source[key]])) as DisplayColor;

  useEffect(() => {
    //set colors to store
    themeColorStore.setThemeColors({
      light: themeColors.light,
      dark: themeColors.dark,
    });
    //display colors
    setThemeDisplayColor({
      light: pickColorKeys(themeColors.light, requiredColorKeys),
      dark: pickColorKeys(themeColors.dark, requiredColorKeys),
    });
  }, [themeColors]);

  //action when playground colors gets changed
  const handleThemeMainColorsUpdate = (key: ColorKey, value: string) => {
    if (debounceColorUpdateRef.current) return; //for hex selector
    if (!value) return; // Optional: guard clause for empty values

    const updatedMainColors = {
      ...themeMainColors,
      [key]: value,
    };
    setThemeMainColors(updatedMainColors);

    const { light, dark } = generateColorScheme(updatedMainColors);

    // Optional: override on* colors manually
    light.primary = updatedMainColors.primary;
    light.secondary = updatedMainColors.secondary;
    light.tertiary = updatedMainColors.tertiary;
    light.onPrimary = getContrastText(updatedMainColors.primary);
    light.onSecondary = getContrastText(updatedMainColors.secondary);
    light.onTertiary = getContrastText(updatedMainColors.tertiary);

    dark.onPrimary = getContrastText(`${dark.primary}`);
    dark.onSecondary = getContrastText(`${updatedMainColors.secondary}`);
    dark.onTertiary = getContrastText(`${updatedMainColors.tertiary}`);

    const FinalColor = {
      light: {
        ...light,
        elevation: {
          level0: "#00000000",
          level1: "#F8F8FC",
          level2: "#F1F1F9",
          level3: "#EAEAF6",
          level4: "#E7E7F4",
          level5: "#E4E3F2",
        },
        surfaceDisabled: "#1A1A1A1F",
        onSurfaceDisabled: "#1A1A1A61",
        backdrop: "#33312F66",
        lightPrimaryContainer: "#85f9c025",
      },
      dark: {
        ...dark,
        elevation: {
          level0: "#00000000",
          level1: "#2E2B2E",
          level2: "#363134",
          level3: "#3E393C",
          level4: "#413C40",
          level5: "#474146",
        },
        surfaceDisabled: "#ECE0E41F",
        onSurfaceDisabled: "#ECE0E461",
        backdrop: "#33312F66",
        lightPrimaryContainer: "#85f9c025",
      },
    };

    setThemeColors(FinalColor as any);
    debounceColorUpdateRef.current = true;
    setTimeout(() => {
      debounceColorUpdateRef.current = false;
    }, 400);
  };

  //action when preview colors gets changed
  const handleThemeColorsUpdate = (key: DisplayColorKey, value: string) => {
    if (debounceColorUpdateRef.current) return; //for hex selector
    const currentThemeColors = { ...themeColors };
    currentThemeColors.light[key] = value;
    setThemeColors(currentThemeColors);
    setTimeout(() => {
      debounceColorUpdateRef.current = false;
    }, 400);
  };

  //handle the submission
  const handleSubmit = () => {
    CreateColorsApi.mutate({
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState()?.currentTenantInfo.tenantId,
        tenancyName:
          useCurrentTenantInfoStore.getState()?.currentTenantInfo.tenancyName,
      },
      data: themeColors,
    });
  };

  const CreateColorsApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.CreateColors,
        method: HttpMethodApi.Post,
        params: sendData.params,
        data: sendData.data,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        showSnackbar(data.result.message, "success");
        handleProceed();
      }
    },
    onError(error, variables, context) {},
  });

  return (
    <>
      <div className="grow overflow-auto customScrollbar">
        <div className="flex justify-between px-5 pt-3">
          <h2 className="heading3 ">{"Playground"}</h2>
        </div>
        <div className="flex max-md:flex-col justify-between p-5">
          <div className="flex flex-wrap md:grow md:flex-col gap-4 p-5 max-md:justify-around">
            {Object.entries(themeMainColors).map(([key, value]) => (
              <ColorBox
                key={key}
                label={key as DisplayColorKey}
                color={value}
                handleThemeColorsUpdate={handleThemeMainColorsUpdate}
                isCustomizable={true}
              />
            ))}
          </div>

          <div className="flex gap-4 p-5 w-full md:w-2/3  justify-around">
            <div
              className={"h-fit w-1/2 max-w-fit flex"}
              style={{ backgroundColor: themeColors.light.primary }}
            >
              <CustomImage
                src={Images.loginScreen}
                className={"max-h-full md:max-h-72"}
                containerStyle={``}
                width={200}
                height={400}
              />
            </div>
            <div
              className={"h-fit w-1/2 max-w-fit flex"}
              style={{ backgroundColor: themeColors.light.primary }}
            >
              <CustomImage
                src={Images.profileScreen}
                className={"max-h-full md:max-h-72"}
                containerStyle={``}
                width={200}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <h2 className="heading3 mx-5 ">{"Preview"}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4  gap-4 p-5 ">
        {Object.entries(themeDisplayColor.light).map(([key, value]) => (
          <ColorBox
            key={key}
            label={key as DisplayColorKey}
            color={value as DisplayColorKey}
            handleThemeColorsUpdate={handleThemeColorsUpdate}
          />
        ))}
      </div> */}
      <ProceedButton
        buttonType={"submit"}
        loading={loading}
        onClick={handleSubmit}
      />
    </>
  );
};

const ColorBox = ({
  label,
  color,
  handleThemeColorsUpdate,
  isCustomizable = false,
}: ColorBoxProps) => {
  const [colorValue, setColorValue] = useState(color);
  const textColorKey = getPairedColorKey(label as DisplayColorKey);
  const textColor = textColorKey ? colors.light[textColorKey] : "#000";

  useEffect(() => {
    handleThemeColorsUpdate(label, colorValue);
  }, [colorValue]);

  useEffect(() => {
    setColorValue(color);
  }, [color]);

  const ColorPickerDropDown = () => {
    return (
      <div
        key={`${label}-${color}`}
        className={`max-md:text-xs md:min-w-24 rounded-lg overflow-hidden shadow-lightShadow ${
          isCustomizable ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div
          className={`min-w-24 h-14 rounded-b-lg flex justify-center py-2 shadow-sm duration-400`}
          style={{ backgroundColor: colorValue }}
        >
          <span className="font-semibold" style={{ color: textColor }}>
            {colorValue}
          </span>
        </div>
        <div className="min-w-24 p-1.5 rounded-lg overflow-hidden flex items-center justify-center font-semibold">
          <span>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {isCustomizable ? (
        <ColorPopover
          trigger={ColorPickerDropDown}
          colorValue={colorValue}
          setColorValue={setColorValue}
        />
      ) : (
        <ColorPickerDropDown />
      )}
    </>
  );
};

export default ThemeGenerator;
