"use client";
import { ProceedButton } from "@/components/common";
import { ReactIcons } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { SetTenantInfoModel } from "@/services/models";
import {
  useCurrentTenantInfoStore,
  useTenantDataStore,
} from "@/store/zustandStore";
import { base64ToFile, showSnackbar, SnackbarEnum } from "@/utils/utils";
import { Tooltip } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImageDropBox from "./ImageDropBox";

type DropBoxContainerProps = {
  content?: string;
  title?: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
};
type IconGeneratorProps = {
  handleProceed: () => void;
};

const IconGenerator = ({ handleProceed }: IconGeneratorProps) => {
  const tenantDataStore = useTenantDataStore();
  const [loading, setLoading] = useState(false);
  const [appIconFile, setAppIconFile] = useState<File[]>([]);
  const [notificationIconFile, setNotificationIconFile] = useState<File[]>([]);
  const [appBannerFile, setAppBannerFile] = useState<File[]>([]);

  useEffect(() => {
    if (
      tenantDataStore.tenantId ==
      useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId
    ) {
      tenantDataStore.iconsData.map((item) => {
        if (item.name?.includes("appIcon")) {
          setAppIconFile([item]);
        }
        if (item.name?.includes("bannerIcon")) {
          setAppBannerFile([item]);
        }
        if (item.name?.includes("notificationIcon")) {
          setNotificationIconFile([item]);
        }
      });
    }
  }, [tenantDataStore.iconsData]);

  const handleSubmit = () => {
    if (
      appIconFile.length == 0 ||
      appBannerFile.length == 0 ||
      notificationIconFile.length == 0
    ) {
      showSnackbar("Please upload icons and images", SnackbarEnum.Warning);
      return;
    }
    const formData = new FormData();
    if (appIconFile[0]) {
      formData.append("app_icon", appIconFile[0]); // must match FastAPI param name
    }

    if (appBannerFile[0]) {
      formData.append("app_banner", appBannerFile[0]); // must match FastAPI param name
    }

    if (notificationIconFile[0]) {
      formData.append("notification_icon", notificationIconFile[0]); // must match FastAPI param name
    }

    IconGeneratorApi.mutate({
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId,
        tenancyName:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenancyName,
      },
      data: formData,
    });
  };

  //icon generator
  const IconGeneratorApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.IconGenerator,
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
        showSnackbar(data.result.message, SnackbarEnum.Success);
        handleProceed();
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, SnackbarEnum.Danger);
    },
  });

  const DropBoxContainer = ({
    content,
    title,
    files,
    setFiles,
    extensions = [".png", ".svg", ".jpeg"],
  }: DropBoxContainerProps) => (
    <>
      <div
        className={`flex flex-col gap-3 p-3 rounded-2xl bg-default-200 max-w-72 shadow-fullShadow`}
      >
        <div className="flex justify-between px-1.5">
          <span className="heading4 text-outline">{title}</span>
          <Tooltip
            classNames={{
              content: "p-2 w-52 text-xs font-semibold",
            }}
            content={content}
            showArrow={true}
          >
            <span className="p-0 text-outline cursor-pointer">
              <ReactIcons.Error />
            </span>
          </Tooltip>
        </div>
        <ImageDropBox
          setFiles={setFiles}
          files={files}
          extensions={extensions}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-wrap gap-7 justify-around p-5 grow overflow-auto customScrollbar">
        <DropBoxContainer
          content={`Upload app icon or you can drag drop the icon here as well`}
          title={`App Icon`}
          setFiles={setAppIconFile}
          files={appIconFile}
        />
        <DropBoxContainer
          content={`Upload App Banner icon or you can drag drop the icon here as well`}
          title={`App Banner`}
          setFiles={setAppBannerFile}
          files={appBannerFile}
        />
        <DropBoxContainer
          content={`Upload Notification icon (Without background) or you can drag drop the icon here as well`}
          title={`Notification Icon`}
          setFiles={setNotificationIconFile}
          files={notificationIconFile}
        />
      </div>
      <ProceedButton
        buttonType={"submit"}
        loading={loading}
        onClick={handleSubmit}
      />
    </>
  );
};

export default IconGenerator;
