"use client";
import {
  ButtonVariant,
  CustomButton,
  CustomInput,
  CustomModal,
} from "@/components/custom";
import { ReactIcons } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { PostModel } from "@/services/models";
import { CustomColor } from "@/services/types";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

type NewReleaseModalProps = {
  setRefreshList: (value: boolean) => void;
};
const NewReleaseModal = ({ setRefreshList }: NewReleaseModalProps) => {
  const t = useTranslations();

  const [loading, setLoading] = useState(false);
  const [releaseVersion, setReleaseVersion] = useState("");
  const [error, setError] = useState<undefined | string>(undefined);

  const CreateReleasesVersionApi = useMutation({
    mutationFn: (sendData: {
      data: Record<string, any>;
      onClose: () => void;
    }) => {
      return makeRequest<PostModel>({
        endpoint: ApiConstants.CreateReleasesVersion,
        method: HttpMethodApi.Post,
        data: sendData.data,
      }); // API Call
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result?.status === 1) {
        variables.onClose();
        setError(undefined);
        setRefreshList(true);
      } else {
        setError(data.result?.message || "Failed to create release version");
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, SnackbarEnum.Danger);
      setError("An error occurred while creating release version");
    },
  });

  const CreateNewReleaseModal = (onClose: () => void) => {
    return (
      <div className="flex flex-col gap-4">
        <CustomInput
          label={t("ReleaseVersion")}
          value={releaseVersion}
          placeholder={"e.g. v1.0.0"}
          onChange={(e) => setReleaseVersion(e.target.value)}
          description={error}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            CreateReleasesVersionApi.mutate({
              data: { version: releaseVersion },
              onClose,
            })
          }
        />
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            color={CustomColor.danger}
            variant={ButtonVariant.light}
            onClick={onClose}
          >
            {t("Close")}
          </CustomButton>
          <CustomButton
            loading={loading}
            onClick={() =>
              CreateReleasesVersionApi.mutate({
                data: { version: releaseVersion },
                onClose,
              })
            }
          >
            {t("Create")}
          </CustomButton>
        </div>
      </div>
    );
  };

  return (
    <>
      <CustomModal
        title={t("CreateNewRelease")}
        subTitle={t("CreateNewReleaseSubtitle")}
        children={(onClose) => CreateNewReleaseModal(onClose)}
        closeButton={false}
        trigger={
          <CustomButton startContent={<ReactIcons.Plus />}>
            {t("NewRelease")}
          </CustomButton>
        }
      />
    </>
  );
};

export default NewReleaseModal;
