"use client";

import { ProceedButton } from "@/components/common";
import { CustomModal } from "@/components/custom";
import { FileDropZone } from "@/components/template";
import { ReactIcons } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { SetTenantInfoModel } from "@/services/models";
import {
  useCurrentTenantInfoStore,
  useTenantDataStore,
} from "@/store/zustandStore";
import { showSnackbar } from "@/utils/utils";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type FileConfigMainProps = {
  handleProceed: () => void;
};

const FileConfigMain = ({ handleProceed }: FileConfigMainProps) => {
  const tenantFilesStores = useTenantDataStore(); // store
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep,
  );
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setFiles(tenantFilesStores.filesConfig);
  }, [tenantFilesStores.filesConfig]);

  useEffect(() => {
    // setFiles([]);
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

  const handleRemoveFile = (fileToRemove: File) => {
    DeleteFileApi.mutate({
      tenantId: tenantFilesStores.tenantFormInfo.tenantId,
      tenancyName: tenantFilesStores.tenantFormInfo.tenancyName,
      fileName: fileToRemove.name,
    });
    setFiles((prev) => {
      let remainingFiles = prev.filter(
        (file) =>
          file.name !== fileToRemove.name || file.size !== fileToRemove.size,
      );
      tenantFilesStores.setFilesConfig(remainingFiles);
      return remainingFiles;
    });
  };

  const mergeValidTTFFiles = (
    prev: File[],
    incoming: File[],
    maxCount = 3,
  ): File[] => {
    const updatedMap = new Map<string, File>();

    // Add existing files
    prev.forEach((file) => {
      if (file.name.toLowerCase().endsWith(".ttf")) {
        updatedMap.set(file.name, file);
      }
    });

    // Add/replace with incoming files
    incoming.forEach((file) => {
      if (file.name.toLowerCase().endsWith(".ttf")) {
        updatedMap.set(file.name, file); // Replace if same name
      }
    });

    // Limit to maxCount files
    return Array.from(updatedMap.values()).slice(0, maxCount);
  };

  const mergeValidFiles = (prev: File[], incoming: File[]): File[] => {
    const updatedMap = new Map<string, File>();

    // Add existing files to map
    prev.forEach((file) => {
      updatedMap.set(file.name, file);
    });

    incoming.forEach((file) => {
      const lowerName = file.name.toLowerCase();

      const isGoogleJson = lowerName === "google-services.json";
      const isPlist = file.name === "GoogleService-Info.plist";
      const isExtraJson = lowerName.includes("firebase-adminsdk");

      // Only allow specific files
      if (isGoogleJson || isPlist || isExtraJson) {
        updatedMap.set(file.name, file); // replace if exists
      }
    });

    // Validate only 1 plist and max 2 jsons (1 named + 1 arbitrary .json)
    const finalFiles: File[] = [];
    let extraJsonAdded = false;

    for (const file of updatedMap.values()) {
      const name = file.name;
      const isGoogleJson = name.toLowerCase() === "google-services.json";
      const isPlist = name === "GoogleService-Info.plist";
      const isExtraJson = name.toLowerCase().endsWith(".json") && !isGoogleJson;

      if (isGoogleJson) finalFiles.push(file);
      else if (isPlist) finalFiles.push(file);
      else if (isExtraJson && !extraJsonAdded) {
        finalFiles.push(file);
        extraJsonAdded = true;
      }
    }

    return finalFiles;
  };

  const handleSubmit = () => {
    if (files.length == 0) {
      showSnackbar("Please upload files", "warning");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const reqBody = {
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId,
        tenancyName:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenancyName,
      },
      data: formData,
    };

    FileConfigsUploadApi.mutate(reqBody);
  };

  const FileConfigsUploadApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.FileConfigsUpload,
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
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  //delete file from server
  const DeleteFileApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.DeleteFile,
        method: HttpMethodApi.Delete,
        data: sendData,
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
        showSnackbar(data.result.message, "success");
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  return (
    <>
      <div className="grow overflow-auto customScrollbar">
        <p className="text-outline px-5 pt-5">
          {
            "Upload the 'GoogleService-Info.plist', 'google-services.json' & 'firebase.json' files required for configuring Firebase in your app."
          }
        </p>
        <FileDropZone
          setFiles={setFiles}
          extensions={[".json", ".plist"]}
          fileUploadFunction={mergeValidFiles}
          hasCustomFunction={true}
        />
        {files.length > 0 && (
          <div className="flex flex-col p-5 gap-4">
            {files.map((file, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-2xl p-3 border-1"
                >
                  <ReactIcons.FileUpload size={32} />
                  <div className="flex flex-col grow">
                    <p className="heading5">{file.name}</p>
                  </div>
                  <span className="text-success rounded-full hover:bg-success hover:text-onPrimary duration-400 cursor-pointer">
                    <ReactIcons.TickCircle />
                  </span>
                  <CustomModal
                    title="Delete File"
                    content={
                      <div>
                        <p>Are you sure you want to delete this file?</p>
                      </div>
                    }
                    closeButton={true}
                    actionButton="Delete"
                    actionButtonPress={() => handleRemoveFile(file)}
                    trigger={
                      <Button className="min-w-fit h-fit p-0 bg-background text-danger rounded-full hover:bg-danger hover:text-onPrimary duration-400 cursor-pointer ">
                        <ReactIcons.CloseCircle />
                      </Button>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ProceedButton
        buttonType={"submit"}
        loading={loading}
        onClick={handleSubmit}
      />
    </>
  );
};

export default FileConfigMain;
