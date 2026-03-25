"use client";

import { Text, TextVariant } from "@/components/common";
import {
  ButtonVariant,
  ChipVariant,
  CustomButton,
  CustomChip,
  CustomModal,
  CustomTable,
  TableSelectionModeEnum,
} from "@/components/custom";
import { ReactIcons } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { CustomColor, CustomSize } from "@/services/types";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import AddTenantModal from "./AddTenantModal";
import AzureTokenModal from "./AzureTokenModal";
import {
  TenantReleaseDataType,
  TenantReleaseStatusEnum,
  TenantReleaseStatusEnumLabel,
} from "./tenantListAccordians";

type TenantReleaseTableProps = {
  tenantReleaseData: TenantReleaseDataType[];
  tenantReleaseVersion: string;
  refreshData: () => void;
  latestReleaseVersion: string;
  onSuccess: () => void;
};

export enum AzureStatusEnum {
  InProgress = "inProgress",
  Succeeded = "succeeded",
  Failed = "failed",
}

//custom header
const tableHeader = [
  { key: "name", label: "Tenant Name" },
  { key: "status", label: "Status" },
  { key: "androidVersion", label: "Android Version" },
  { key: "iosVersion", label: "Ios Version" },
  { key: "id", label: "Actions" },
];

//dynamic color switching for chips
export const statusColorMap: Record<number, CustomColor> = {
  0: CustomColor.warning,
  1: CustomColor.secondary,
  2: CustomColor.success,
  3: CustomColor.danger,
};

const TenantReleaseTable = ({
  tenantReleaseData,
  tenantReleaseVersion,
  refreshData,
  latestReleaseVersion,
  onSuccess,
}: TenantReleaseTableProps) => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<
    TenantReleaseDataType[]
  >([]);
  const [tableSelection, setTableSelection] = useState<string[]>([]); // Use string array for HeroUI Table
  const [selectedOs, setSelectedOS] = useState({
    android: false,
    ios: false,
  });
  const [cancelButtonLoading, setCancelButtonLoading] = useState(false);
  const [onGoingTenants, setOnGoingTenants] = useState<number>(0);

  const handleDeployClick = (item: TenantReleaseDataType) => {
    setSelectedTenants([item]);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) {
      refreshData();
      DeploymentDataAvailableApi.mutate({});
      setTableSelection([]);
    }
  }, [isModalOpen]);

  const handleMultipleDeployClick = () => {
    // Filter selected items that are in Pending or Failed status
    const ongoingItems = tenantReleaseData.filter(
      (item) =>
        tableSelection.includes(String(item.id)) &&
        item.status === TenantReleaseStatusEnum.Ongoing,
    );

    if (ongoingItems.length > 0) {
      showSnackbar(t("OngoingDeployment"), SnackbarEnum.Warning, 2000);
      return;
    }

    const deployableItems = tenantReleaseData.filter(
      (item) =>
        tableSelection.includes(String(item.id)) &&
        item.status !== TenantReleaseStatusEnum.Ongoing,
    );

    if (deployableItems.length > 0) {
      setSelectedTenants(deployableItems);
      setIsModalOpen(true);
    }
  };

  const handleCancelAllDeployments = () => {
    DeleteBulkDeploymentDataApi.mutate({});
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = ({
    android,
    ios,
  }: {
    android: boolean;
    ios: boolean;
  }) => {
    console.log("Deployment triggered for OS - ", { android, ios });
    // Optionally trigger a refresh or show success message
    setSelectedOS({ android, ios });
    setTableSelection([]);
  };

  // Get selected tenant IDs
  const getSelectedTenants = ():
    | TenantReleaseDataType
    | TenantReleaseDataType[] => {
    return selectedTenants.length === 1 ? selectedTenants[0] : selectedTenants;
  };

  //dynamic and customize cell rendering
  const renderCustomCell = useCallback(
    (item: TenantReleaseDataType, columnKey: keyof TenantReleaseDataType) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "status":
          return (
            <CustomChip
              className="capitalize"
              color={statusColorMap[item.status]}
              size={CustomSize.sm}
              variant={ChipVariant.Flat}
            >
              {
                TenantReleaseStatusEnumLabel[
                  cellValue as TenantReleaseStatusEnum
                ]
              }
            </CustomChip>
          );

        case "androidVersion":
        case "iosVersion":
          const osStatus =
            columnKey === "androidVersion"
              ? item.androidStatus
              : item.iosStatus;

          return (
            <div className="flex items-center gap-2 font-semibold text-nowrap">
              <Text variant={TextVariant.caption}>{cellValue}</Text>
              <CustomChip
                className="capitalize"
                color={statusColorMap[osStatus]}
                size={CustomSize.sm}
                variant={ChipVariant.Flat}
              >
                {
                  TenantReleaseStatusEnumLabel[
                    osStatus as TenantReleaseStatusEnum
                  ]
                }
              </CustomChip>
            </div>
          );
        case "id":
          if (latestReleaseVersion !== tenantReleaseVersion) {
            return (
              <CustomButton
                startContent={<ReactIcons.Play />}
                className="bg-focus"
                isDisabled={true}
              >
                {t("Deploy")}
              </CustomButton>
            );
          }
          switch (item.status) {
            case TenantReleaseStatusEnum.Pending:
              return (
                <CustomButton
                  startContent={<ReactIcons.Play />}
                  className="bg-focus"
                  isDisabled={onGoingTenants > 0}
                  onClick={() => handleDeployClick(item)}
                >
                  {t("Deploy")}
                </CustomButton>
              );
            case TenantReleaseStatusEnum.Ongoing:
              return (
                <CustomButton color={CustomColor.default} loading={true}>
                  {t("Deploying")}
                </CustomButton>
              );
            case TenantReleaseStatusEnum.Failed:
              return (
                <CustomButton
                  color={CustomColor.danger}
                  startContent={<ReactIcons.Refresh />}
                  isDisabled={onGoingTenants > 0}
                  onClick={() => handleDeployClick(item)}
                >
                  {t("Retry")}
                </CustomButton>
              );
            case TenantReleaseStatusEnum.Published:
              return (
                <CustomButton
                  startContent={<ReactIcons.TickCircle />}
                  color={CustomColor.success}
                  variant={ButtonVariant.light}
                  isDisabled={onGoingTenants > 0}
                  onClick={() => handleDeployClick(item)}
                >
                  {t("Live")}
                </CustomButton>
              );
            default:
              return null;
          }
        default:
          return cellValue;
      }
    },
    [t, onGoingTenants],
  );

  // deploy multitenants
  const DeploymentDataAvailableApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<any>({
        endpoint: ApiConstants.DeploymentDataAvailable,
        method: HttpMethodApi.Get,
        data: sendData,
        withoutBaseModel: true,
      }); // API Call
    },
    onMutate(variables) {
      setCancelButtonLoading(true);
    },
    onSettled(data, error, variables, context) {
      setCancelButtonLoading(false);
    },
    onSuccess(data, variables, context) {
      setOnGoingTenants(data.result);
    },
    onError() {
      // Keep initial branch list as fallback on error
      showSnackbar("Failed to deploy tenant", SnackbarEnum.Danger);
    },
  });

  //remove ongoing tenant from deploying
  const DeleteBulkDeploymentDataApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<any>({
        endpoint: ApiConstants.DeleteBulkDeploymentData,
        method: HttpMethodApi.Delete,
        data: sendData,
        withoutBaseModel: true,
      }); // API Call
    },
    onMutate(variables) {
      setCancelButtonLoading(true);
    },
    onSettled(data, error, variables, context) {
      setCancelButtonLoading(false);
    },
    onSuccess(data, variables, context) {
      refreshData();
      setOnGoingTenants(0);
    },
    onError() {
      // Keep initial branch list as fallback on error
      showSnackbar("Failed to deploy tenant", SnackbarEnum.Danger);
    },
  });
  return (
    <>
      {latestReleaseVersion == tenantReleaseVersion && (
        <div className="flex items-center justify-end gap-4">
          {onGoingTenants > 1 ? (
            <CustomButton
              startContent={<ReactIcons.Play />}
              className="bg-focus"
              onClick={handleCancelAllDeployments}
              loading={cancelButtonLoading}
            >
              {t("CancelFurther")} ({onGoingTenants - 1})
            </CustomButton>
          ) : (
            tableSelection.length > 1 && (
              <CustomButton
                startContent={<ReactIcons.Play />}
                className="bg-focus"
                onClick={handleMultipleDeployClick}
              >
                {t("Deploy")} ({tableSelection.length})
              </CustomButton>
            )
          )}
          <CustomModal
            trigger={
              <CustomButton
                className="flex justify-self-end"
                color={CustomColor.default}
                variant={ButtonVariant.faded}
                startContent={<ReactIcons.AddUser />}
              >
                Add Tenant
              </CustomButton>
            }
            closeButton={false}
            children={(onClose) => {
              return (
                <AddTenantModal
                  releaseVersion={latestReleaseVersion}
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              );
            }}
          />
        </div>
      )}
      <CustomTable
        key={onGoingTenants}
        columns={tableHeader}
        data={tenantReleaseData}
        rowKey="id"
        isHeaderSticky={true}
        renderCustomCell={renderCustomCell}
        removeWrapper={true}
        selectionMode={TableSelectionModeEnum.Multiple}
        selectedValue={tableSelection}
        onSelectionChange={(value: string[]) => setTableSelection(value)}
      />
      {selectedTenants.length > 0 && (
        <AzureTokenModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          tenants={getSelectedTenants()}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default TenantReleaseTable;
