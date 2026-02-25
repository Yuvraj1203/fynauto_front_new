"use client";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel, SetTenantInfoModel } from "@/services/models";
import {
  useCurrentTenantInfoStore,
  useTenantDataStore,
} from "@/store/zustandStore";
import {
  base64ToFile,
  proceedStepsStatus,
  showSnackbar,
  SnackbarEnum,
} from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FileConfigMain from "../file-configs/FileConfigMain";
import FontsUpload from "../fontsUpload/FontsUpload";
import IconGenerator from "../iconGenerator/IconGenerator";
import TenantInfoForm from "../tenantInfoForm/TenantInfoForm";
import ThemeGenerator, { colors } from "../themeGenerator/ThemeGenerator";

type TenantStepsProps = {
  tenantId: string;
  tenancyName: string;
};

const TenantSteps = ({ tenancyName, tenantId }: TenantStepsProps) => {
  const router = useRouter(); // router used in procceed
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep,
  );
  const tenantDataStore = useTenantDataStore();
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);

  const [uiLoading, setUiLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

  useEffect(() => {
    if (tenantId) {
      GetTenantFormDataApi.mutate({ tenantId, tenancyName });
    }
  }, []);

  const handleProceed = () => {
    const stepsData = proceedStepsStatus(
      useCurrentTenantInfoStore.getState()?.currentTenantInfo?.steps!,
      useCurrentTenantInfoStore.getState()?.currentStep - 1,
      router,
    );
    UpdateTenantStepApi.mutate({
      params: {
        tenantId: tenantId,
        step: stepsData.step,
      },
      data: stepsData.steps,
    });
  };

  //update tenant steps
  const UpdateTenantStepApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<GetTenantIdByNameModel>({
        endpoint: ApiConstants.UpdateTenantStep,
        method: HttpMethodApi.Patch,
        params: sendData.params,
        data: sendData.data,
      });
    },
    onMutate(variables) {
      // setLoading(true);
    },
    onSettled(data, error, variables, context) {
      // setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        useCurrentTenantInfoStore.getState().setCurrentTenantInfo(data.result);
        useCurrentTenantInfoStore.getState().setCurrentStep(data.result.step!);
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, SnackbarEnum.Danger);
    },
  });

  //set tenant info api
  const GetTenantFormDataApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.GetTenantFormData,
        method: HttpMethodApi.Get,
        data: sendData,
      });
    },
    onMutate(variables) {
      setUiLoading(true);
    },
    onSettled(data, error, variables, context) {
      setUiLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        tenantDataStore.setTenantId(data.result?.id!);
        if (data?.result?.tenantFormData?.tenantId == tenantId) {
          tenantDataStore.setTenantFormInfo(data?.result?.tenantFormData!);
        } else {
          tenantDataStore.setTenantFormInfo({});
        }
        // file config
        const fileConfigs = data.result.fileConfigsData;
        if (fileConfigs?.success) {
          const {
            googleServicesJson,
            googleServiceInfoPlist,
            firebaseAdminsdkJson,
          } = fileConfigs;

          const files: File[] = [];

          if (googleServicesJson) {
            files.push(
              base64ToFile(
                googleServicesJson,
                "google-services.json",
                "application/json",
              ),
            );
          }

          if (googleServiceInfoPlist) {
            files.push(
              base64ToFile(
                googleServiceInfoPlist,
                "GoogleService-Info.plist",
                "application/xml",
              ),
            );
          }

          if (firebaseAdminsdkJson) {
            files.push(
              base64ToFile(
                firebaseAdminsdkJson,
                "firebase-adminsdk.json",
                "application/json",
              ),
            );
          }

          tenantDataStore.setFilesConfig(files);
        } else {
          tenantDataStore.setFilesConfig([]);
        }
        //theme
        if (data.result?.themeColors?.id) {
          const themeColorsTemp = {
            light: data.result.themeColors.light,
            dark: data.result.themeColors.dark,
          };
          tenantDataStore.setThemeColors(themeColorsTemp);
        } else {
          tenantDataStore.setThemeColors(colors);
        }
        //fonts
        if (data.result.fontsData?.id) {
          const fontName = data.result.fontsData.defaultFontName;
          const fileConfigs = data.result.fontsData.files; //files
          if (fileConfigs?.success) {
            const files: File[] = [];

            const { lightFont, regularFont, boldFont } = fileConfigs;

            if (lightFont) {
              files.push(
                base64ToFile(
                  lightFont.base64,
                  lightFont.fileName.includes("light")
                    ? lightFont.fileName
                    : `light-${lightFont.fileName}`,
                  "application/json",
                ),
              );
            }
            if (regularFont) {
              files.push(
                base64ToFile(
                  regularFont.base64,
                  regularFont.fileName.includes("regular")
                    ? regularFont.fileName
                    : `regular-${regularFont.fileName}`,
                  "application/json",
                ),
              );
            }
            if (boldFont) {
              files.push(
                base64ToFile(
                  boldFont.base64,
                  boldFont.fileName.includes("bold")
                    ? boldFont.fileName
                    : `bold-${boldFont.fileName}`,
                  "application/json",
                ),
              );
            }

            tenantDataStore.setFontsData({
              files: files,
              defaultFontName: fontName,
            });
          }
        } else {
          tenantDataStore.setFontsData({});
        }
        //icons
        // file config
        const iconsFiles = data.result.iconsData;
        if (iconsFiles?.success) {
          const { appIcon, bannerIcon, notificationIcon } = iconsFiles;

          const files: File[] = [];

          if (appIcon) {
            files.push(
              base64ToFile(appIcon, "appIcon.png", "application/json"),
            );
          }

          if (bannerIcon) {
            files.push(
              base64ToFile(bannerIcon, "bannerIcon.png", "application/xml"),
            );
          }

          if (notificationIcon) {
            files.push(
              base64ToFile(
                notificationIcon,
                "notificationIcon.png",
                "application/json",
              ),
            );
          }

          tenantDataStore.setIconsData(files);
        } else {
          tenantDataStore.setIconsData([]);
        }
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, SnackbarEnum.Danger);
    },
  });

  return (
    <>
      {currentStep == 1 ? (
        <TenantInfoForm handleProceed={handleProceed} uiLoading={uiLoading} />
      ) : currentStep == 2 ? (
        <FileConfigMain handleProceed={handleProceed} />
      ) : currentStep == 3 ? (
        <ThemeGenerator handleProceed={handleProceed} />
      ) : currentStep == 4 ? (
        <FontsUpload handleProceed={handleProceed} />
      ) : (
        <IconGenerator handleProceed={handleProceed} />
      )}
    </>
  );
};

export default TenantSteps;
