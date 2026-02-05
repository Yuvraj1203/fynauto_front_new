import { colors } from "@/components/pages/themeGenerator/ThemeGenerator";
import { TenantFormDataType } from "@/services/models";
import { ThemeColorsType } from "@/services/models/setTenantInfoModel/setTenantInfoModel";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FontsDataType = {
  defaultFontName?: string;
  files?: File[];
};

type TenantDataStoreType = {
  tenantId: string;
  setTenantId: (Value: string) => void;
  tenantFormInfo: TenantFormDataType;
  setTenantFormInfo: (value: TenantFormDataType) => void;
  filesConfig: File[];
  setFilesConfig: (value: File[]) => void;
  themeColors: ThemeColorsType;
  setThemeColors: (value: ThemeColorsType) => void;
  fontsData: FontsDataType;
  setFontsData: (value: FontsDataType) => void;
  iconsData: File[];
  setIconsData: (value: File[]) => void;
};

const useTenantDataStore = create<TenantDataStoreType>()(
  persist(
    (set) => ({
      tenantId: "",
      setTenantId: (value: string) => set({ tenantId: value }),
      tenantFormInfo: {},
      setTenantFormInfo: (value: TenantFormDataType) =>
        set({ tenantFormInfo: value }),
      filesConfig: [],
      setFilesConfig: (value: File[]) => set({ filesConfig: value }),
      themeColors: colors,
      setThemeColors: (value: ThemeColorsType) => set({ themeColors: value }),
      fontsData: {},
      setFontsData: (value: FontsDataType) => set({ fontsData: value }),
      iconsData: [],
      setIconsData: (value: File[]) => set({ iconsData: value }),
    }),
    {
      name: "tenant-data-store",
      partialize: (state) => ({
        tenantId: state.tenantId,
        tenantFormInfo: state.tenantFormInfo,
        filesConfig: state.filesConfig,
        themeColors: state.themeColors,
        fontsData: state.fontsData,
        iconsData: state.iconsData,
      }),
    }
  )
);

export default useTenantDataStore;
