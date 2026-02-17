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
import { useCallback } from "react";
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
    [],
  );

  return (
    <CustomTable
      columns={tableHeader}
      data={tenantReleaseData}
      rowKey="id"
      isHeaderSticky={true}
      renderCustomCell={renderCustomCell}
      removeWrapper={true}
      selectionMode={TableSelectionModeEnum.Multiple}
      onSelectionChange={(value) => console.log("valuue=>", value)}
    />
  );
};

export default TenantReleaseTable;
