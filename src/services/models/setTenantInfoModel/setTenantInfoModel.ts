import { ThemeColorSet } from "@/components/pages/themeGenerator/ThemeGenerator";

export type TenantFormDataType = {
  id?: string;
  apiUrl?: string;
  appName?: string;
  auth0ClientId?: string;
  auth0Domain?: string;
  bundleId?: string;
  androidVersionCode?: string;
  androidVersionName?: string;
  iosTeamId?: string;
  iosVersionCode?: string;
  iosVersionName?: string;
  packageName?: string;
  sentryDsn?: string;
  tenancyName?: string;
  tenantId?: string;
  auth0Organization?: string | undefined;
  oktaClientId?: string | undefined;
  oktaDomain?: string | undefined;
};

type fileConfigsType = {
  googleServiceInfoPlist: string;
  googleServicesJson: string;
  firebaseAdminsdkJson: string;
  message?: string;
  success?: boolean;
};

export type ThemeColorsType = {
  light?: ThemeColorSet;
  dark?: ThemeColorSet;
  id?: string;
  message?: string;
};

export type Base64FileType = {
  base64: string;
  fileName: string;
};

export type FontsFilesType = {
  boldFont?: Base64FileType;
  lightFont?: Base64FileType;
  regularFont?: Base64FileType;
  success?: true;
};

export type FontsDataType = {
  id?: string;
  tenancyName?: string;
  defaultFontName?: string;
  files?: FontsFilesType;
  tenantId?: string;
  lightFontPath?: string;
  regularFontPath?: string;
  boldFontPath?: string;
};

export type IconsDataType = {
  appIcon?: string;
  bannerIcon?: string;
  notificationIcon?: string;
  success?: boolean;
};

export type SetTenantInfoModel = {
  id?: string;
  message: string;
  uploaded?: string[];
  tenantFormData?: TenantFormDataType;
  fileConfigsData?: fileConfigsType;
  themeColors?: ThemeColorsType;
  fontsData?: FontsDataType;
  iconsData?: IconsDataType;
};
