export type TenantColorSet = {
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  primary: string;
  onPrimary: string;

  /* SECONDARY */
  secondary50: string;
  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;
  secondary600: string;
  secondary700: string;
  secondary800: string;
  secondary900: string;
  secondary: string;
  onSecondary: string;
};

export type TenantColorsType = {
  light: TenantColorSet;
  dark: TenantColorSet;
};

export type TenantInfoType = {
  domain?: string;
  clientId?: string;
  redirect_uri?: string;
  isData?: boolean;
};

export type TenantResponse =
  | {
      success: true;
      data: {
        tenantInfo: TenantInfoType;
        isTenantInfo: boolean;
        color: TenantColorsType;
        isColor: boolean;
      };
    }
  | {
      success: false;
      message: string;
    };
