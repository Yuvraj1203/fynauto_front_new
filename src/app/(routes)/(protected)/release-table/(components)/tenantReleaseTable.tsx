"use client";

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
import { useGitCredStore } from "@/store/zustandStore";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isDeployAvailable, setIsDeployAvailable] = useState(true);
  const manualRefetch = useRef(false);
  const initialRender = useRef(true);
  const [cancelButtonLoading, setCancelButtonLoading] = useState(false);
  const [onGoingTenants, setOnGoingTenants] = useState<number>(0);

  const azureBearerToken = useGitCredStore().azureBearer;

  const handleDeployClick = (item: TenantReleaseDataType) => {
    setSelectedTenants([item]);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) {
      refreshData();
      refetch();
      DeploymentDataAvailableApi.mutate({});
      setTableSelection([]);
    }
  }, [isModalOpen]);

  const handleMultipleDeployClick = () => {
    // Filter selected items that are in Pending or Failed status
    const deployableItems = tenantReleaseData.filter(
      (item) =>
        tableSelection.includes(String(item.id)) &&
        (item.status === TenantReleaseStatusEnum.Pending ||
          item.status === TenantReleaseStatusEnum.Failed),
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
    manualRefetch.current = true; // mark manual call

    setIsDeployAvailable(false);
    UpdateTenantStatusApi.mutate({
      data: {
        name: selectedTenants[0].name,
        status: TenantReleaseStatusEnum.Ongoing,
        android: android,
        ios: ios,
      },
      param: {
        version: tenantReleaseVersion,
      },
    });
    refetch();
    setTableSelection([]);
  };

  // Get selected tenant IDs
  const getSelectedTenants = ():
    | TenantReleaseDataType
    | TenantReleaseDataType[] => {
    return selectedTenants.length === 1 ? selectedTenants[0] : selectedTenants;
  };

  // Check if there are any deployable items in selection
  const hasDeployableSelection = () => {
    return tenantReleaseData.some(
      (item) =>
        tableSelection.includes(String(item.id)) &&
        (item.status === TenantReleaseStatusEnum.Pending ||
          item.status === TenantReleaseStatusEnum.Failed),
    );
  };

  // Get count of deployable items
  const getDeployableCount = () => {
    return tenantReleaseData.filter(
      (item) =>
        tableSelection.includes(String(item.id)) &&
        (item.status === TenantReleaseStatusEnum.Pending ||
          item.status === TenantReleaseStatusEnum.Failed),
    ).length;
  };

  //polling
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["GetProgress"],
    queryFn: (sendData: Record<string, any>) =>
      makeRequest<any>({
        endpoint: ApiConstants.GetProgress,
        method: HttpMethodApi.Get,
        data: { token: azureBearerToken },
        withoutBaseModel: true,
      }),
    refetchInterval: (data) => {
      if (data?.state?.data?.result?.status === AzureStatusEnum.InProgress) {
        return 1000 * 60 * 3; // 3 minutes
      } else {
        return false;
      }
    },
  });

  const UpdateTenantStatusApi = useMutation({
    mutationFn: (sendData: {
      data: Record<string, any>;
      param: Record<string, any>;
    }) => {
      return makeRequest<any>({
        endpoint: ApiConstants.UpdateTenantStatus,
        method: HttpMethodApi.Put,
        data: sendData.data,
        params: sendData.param,
      }); // API Call
    },
    onMutate(variables) {
      // setLoading(true);
    },
    onSettled(data, error, variables, context) {
      // setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.success) {
        showSnackbar(
          "Tenant status updated successfully",
          SnackbarEnum.Success,
        );
      }
      if (manualRefetch.current) {
        refetch();
      }
      refreshData();
    },
    onError(error, variables, context) {
      // showSnackbar("Failed to update tenant status", SnackbarEnum.Danger);
    },
  });

  useEffect(() => {
    DeploymentDataAvailableApi.mutate({});
    if (!data?.result) return;

    const isManual = manualRefetch.current;

    if (data?.result) {
      if (data.result?.status === AzureStatusEnum.Succeeded) {
        // update statius for success
        UpdateTenantStatusApi.mutate({
          data: {
            name: data.result.tenant,
            status: TenantReleaseStatusEnum.Published,
            android: selectedOs.android,
            ios: selectedOs.ios,
          },
          param: {
            version: tenantReleaseVersion,
          },
        });
        setSelectedOS({ android: false, ios: false });
        setIsDeployAvailable(true);
        if (!initialRender.current) {
          refreshData();
        }
      } else if (data.result?.status === AzureStatusEnum.Failed) {
        // update status for failed
        UpdateTenantStatusApi.mutate({
          data: {
            name: data.result.tenant,
            status: TenantReleaseStatusEnum.Failed,
            android: false,
            ios: false,
          },
          param: {
            version: tenantReleaseVersion,
          },
        });
        setIsDeployAvailable(true);
        if (!initialRender.current) {
          refreshData();
        }
      } else if (data.result?.status === AzureStatusEnum.InProgress) {
        setIsDeployAvailable(false);
      }
    }
    // reset flag after handling
    manualRefetch.current = false;
    initialRender.current = false;
  }, [data]);

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
        case "id":
          switch (item.status) {
            case TenantReleaseStatusEnum.Pending:
              console.log("onGoingTenants - ", onGoingTenants);
              return (
                <CustomButton
                  startContent={<ReactIcons.Play />}
                  className="bg-focus"
                  isDisabled={!isDeployAvailable || onGoingTenants > 0}
                  onClick={() => isDeployAvailable && handleDeployClick(item)}
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
                  isDisabled={!isDeployAvailable || onGoingTenants > 0}
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
                  isDisabled={!isDeployAvailable || onGoingTenants > 0}
                  onClick={() => isDeployAvailable && handleDeployClick(item)}
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
            >
              {t("CancelFurther")} ({onGoingTenants})
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
