"use client";

import { Text, TextVariant } from "@/components/common";
import {
  ButtonVariant,
  CustomButton,
  FormTextInput,
  FormTextInputType,
} from "@/components/custom";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { CustomColor } from "@/services/types";
import { useGitCredStore } from "@/store/zustandStore";
import { checkHasValidDate, showSnackbar, SnackbarEnum } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { addCustomTenantSchema, AddCustomTenantType } from "./addtenant.schema";
import {
  TenantReleaseStatusEnum,
  TenantReleaseStatusEnumLabel,
} from "./tenantListAccordians";

type AddTenantModalProps = {
  releaseVersion: string;
  onSuccess: () => void;
  onClose: () => void;
};

const AddTenantModal = ({
  releaseVersion,
  onSuccess,
  onClose,
}: AddTenantModalProps) => {
  const azureBearerToken = useGitCredStore((state) => state.azureBearer);
  const azureBearerTokenExpiry = useGitCredStore(
    (state) => state.azureBearerExpiry,
  );

  const methods = useForm({
    defaultValues: {
      status: TenantReleaseStatusEnum.Pending,
    },
    resolver: zodResolver(addCustomTenantSchema),
  });

  const [teamDropdown, setTeamDropdown] = useState<
    { key: string; label: string }[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<{
    key: string;
    label: string;
  }>();
  const [bearerTokenError, setBearerTokenError] = useState("");

  const [loading, setLoading] = useState(false);

  const statusOptions = [
    {
      key: TenantReleaseStatusEnum.Pending,
      label: TenantReleaseStatusEnumLabel[TenantReleaseStatusEnum.Pending],
    },
    {
      key: TenantReleaseStatusEnum.Ongoing,
      label: TenantReleaseStatusEnumLabel[TenantReleaseStatusEnum.Ongoing],
    },
    {
      key: TenantReleaseStatusEnum.Published,
      label: TenantReleaseStatusEnumLabel[TenantReleaseStatusEnum.Published],
    },
    {
      key: TenantReleaseStatusEnum.Failed,
      label: TenantReleaseStatusEnumLabel[TenantReleaseStatusEnum.Failed],
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  //check if the git token valid
  useEffect(() => {
    const isAzureBearerValid = checkHasValidDate(azureBearerTokenExpiry);

    if (!isAzureBearerValid) {
      setBearerTokenError(
        `Azure bearer token may be expired.Please update from settings in sidebar.`,
      );
    }
    if (azureBearerToken) {
      GetMatchBranchesApi.mutate(azureBearerToken);
    }
  }, [azureBearerToken]);

  const handleSelectTeamChange = (value: string | number) => {
    if (teamDropdown) {
      const selectedTeam = teamDropdown.find(
        (item, index) => item.key == value,
      );
      if (selectedTeam) {
        setSelectedTeam(selectedTeam);
      }
      methods.setValue("matchBranch", selectedTeam?.key ?? "");
    }
  };

  const onSubmit = (data: AddCustomTenantType) => {

    AddCustomTenantApi.mutate({
      body: data,
      param: {
        version: releaseVersion,
      },
    });
  };

  const AddCustomTenantApi = useMutation({
    mutationFn: (sendData: {
      body: Record<string, any>;
      param: Record<string, any>;
    }) => {
      return makeRequest<{ success: boolean; message: string }>({
        endpoint: ApiConstants.AddCustomTenant,
        method: HttpMethodApi.Put,
        data: sendData.body,
        params: sendData.param,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.success) {
        showSnackbar("Tenant added successfully", SnackbarEnum.Success);
        onSuccess();
        onClose();
      }
    },
    onError(error: any, variables, context) {
      showSnackbar("Failed to add tenant", SnackbarEnum.Danger);
    },
  });

  // Fetch branches from Azure DevOps using useMutation
  const GetMatchBranchesApi = useMutation({
    mutationFn: (token: string) => {
      return makeRequest<any>({
        url: ApiConstants.GetMatchBranches,
        method: HttpMethodApi.Get,
        data: { token },
        withoutBaseModel: true,
      }); // API Call
    },
    onMutate(variables) {
      // setLoading(true);
    },
    onSettled(data, error, variables, context) {
      // setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data?.value) {
        setTeamDropdown(
          data.value.map((item: any) => {
            const matchBranchName = item.name.replace("refs/heads/", "");
            return {
              label: matchBranchName,
              key: matchBranchName,
            };
          }),
        );
      }
    },
    onError() {
      // Keep initial branch list as fallback on error
      showSnackbar(
        "Failed to fetch branches from Azure DevOps",
        SnackbarEnum.Danger,
      );
    },
  });

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={() => methods.handleSubmit(onSubmit)} className="py-2">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-xl font-semibold">Add Tenant</h2>
            <p className="text-secondary-text text-sm">
              Add a new tenant to the latest release ({releaseVersion}).
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Tenant Name */}
            <FormTextInput label="Tenant Name" name="name" isRequired={true} />

            {/* Status */}
            <FormTextInput
              name="status"
              label="Status"
              type={FormTextInputType.select}
              displayKey={"label"}
              selectItems={statusOptions}
              selectedValue={selectedStatus}
              isRequired={true}
              handleSelectItemChange={(val) => {
                methods.setValue("status", val as TenantReleaseStatusEnum);
                setSelectedStatus({
                  key: val as TenantReleaseStatusEnum,
                  label:
                    TenantReleaseStatusEnumLabel[
                      val as TenantReleaseStatusEnum
                    ],
                });
              }}
            />

            {/* match branch */}
            <FormTextInput
              name="matchBranch"
              label="Team"
              type={FormTextInputType.select}
              displayKey={"label"}
              selectItems={teamDropdown}
              selectedValue={selectedTeam}
              isRequired={true}
              handleSelectItemChange={handleSelectTeamChange}
            />
            {bearerTokenError && (
              <Text variant={TextVariant.caption}>{bearerTokenError}</Text>
            )}

            <div className="flex gap-1 items-center justify-between">
              {/* Android Version */}

              <FormTextInput
                label="Android Version"
                name="androidVersion"
                isRequired={true}
              />

              {/* iOS Version */}
              <FormTextInput
                label="iOS Version"
                name="iosVersion"
                isRequired={true}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <CustomButton
              color={CustomColor.danger}
              variant={ButtonVariant.light}
              onClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={() => onSubmit(methods.getValues())}
              loading={loading}
            >
              Add Tenant
            </CustomButton>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddTenantModal;
