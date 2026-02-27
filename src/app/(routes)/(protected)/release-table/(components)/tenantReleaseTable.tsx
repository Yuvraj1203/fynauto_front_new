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
import { CustomColor, CustomSize } from "@/services/types";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import AzureTokenModal from "./AzureTokenModal";
import {
  TenantReleaseDataType,
  TenantReleaseStatusEnum,
  TenantReleaseStatusEnumLabel,
} from "./tenantListAccordians";

type TenantReleaseTableProps = {
  tenantReleaseData: TenantReleaseDataType[];
};

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

const TenantReleaseTable = ({ tenantReleaseData }: TenantReleaseTableProps) => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<
    TenantReleaseDataType[]
  >([]);
  const [tableSelection, setTableSelection] = useState<any>(new Set());

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
    setSelectedTenants([]);
  };

  const handleSuccess = () => {
    // Optionally trigger a refresh or show success message
    console.log("Deployment triggered successfully");
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
              return (
                <CustomButton
                  startContent={<ReactIcons.Play />}
                  className="bg-focus"
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
