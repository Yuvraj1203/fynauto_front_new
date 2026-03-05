"use client";

import {
  ButtonVariant,
  ChipVariant,
  CustomButton,
  CustomChip,
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
}: TenantReleaseTableProps) => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<
    TenantReleaseDataType[]
  >([]);
  const [tableSelection, setTableSelection] = useState<any>(new Set());
  const [selectedOs, setSelectedOS] = useState({
    android: false,
    ios: false,
  });
  const isDeployAvailable = useRef(true);
  const manualRefetch = useRef(false);
  const initialRender = useRef(true);

  const azureBearerToken = useGitCredStore().azureBearer;

  const handleDeployClick = (item: TenantReleaseDataType) => {
    setSelectedTenants([item]);
    setIsModalOpen(true);
  };

  const handleMultipleDeployClick = () => {
    // Filter selected items that are in Pending or Failed status
    const deployableItems = tenantReleaseData.filter(
      (item) =>
        tableSelection.has(item.id) &&
        (item.status === TenantReleaseStatusEnum.Pending ||
          item.status === TenantReleaseStatusEnum.Failed),
    );

    if (deployableItems.length > 0) {
      setSelectedTenants(deployableItems);
      setIsModalOpen(true);
    }
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

    isDeployAvailable.current = false;
    UpdateTenantStatusApi.mutate({
      data: {
        name: data.result.tenant,
        status: TenantReleaseStatusEnum.Ongoing,
        android: android,
        ios: ios,
      },
      param: {
        version: tenantReleaseVersion,
      },
    });
    refetch();
    setTableSelection(new Set());
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
        tableSelection.has(item.id) &&
        (item.status === TenantReleaseStatusEnum.Pending ||
          item.status === TenantReleaseStatusEnum.Failed),
    );
  };

  // Get count of deployable items
  const getDeployableCount = () => {
    return tenantReleaseData.filter(
      (item) =>
        tableSelection.has(item.id) &&
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
        isDeployAvailable.current = true;
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
        isDeployAvailable.current = true;
        if (!initialRender.current) {
          refreshData();
        }
      } else if (data.result?.status === AzureStatusEnum.InProgress) {
        isDeployAvailable.current = false;
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
      const canDeploy = isDeployAvailable.current;

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
              return (
                <CustomButton
                  startContent={<ReactIcons.Play />}
                  className="bg-focus"
                  isDisabled={!canDeploy}
                  onClick={() => canDeploy && handleDeployClick(item)}
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
    [t],
  );

  return (
    <>
      {/* Bulk Deploy Button - Shows when items are selected */}
      {tableSelection.size > 0 && hasDeployableSelection() && (
        <div className="mb-4 flex justify-end">
          <CustomButton
            startContent={<ReactIcons.Play />}
            className="bg-focus"
            onClick={handleMultipleDeployClick}
          >
            {t("Deploy")} ({getDeployableCount()})
          </CustomButton>
        </div>
      )}
      <CustomTable
        columns={tableHeader}
        data={tenantReleaseData}
        rowKey="id"
        isHeaderSticky={true}
        renderCustomCell={renderCustomCell}
        removeWrapper={true}
        selectionMode={TableSelectionModeEnum.Multiple}
        selectedValue={tableSelection}
        onSelectionChange={(value) => setTableSelection(value)}
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
