"use client";

import {
  ChipVariant,
  CustomChip,
  CustomSnippet,
  CustomTable,
  CustomTooltip,
  SnippetVariantEnum,
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
          return (
            <div className="relative flex items-center gap-2">
              <CustomTooltip content={t("Clone")}>
                <CustomSnippet
                  variant={SnippetVariantEnum.flat}
                  className={
                    "flex items-center justify-center text-default-600 bg-surface group-hover:bg-default-100 duration-250 min-w-4.5 p-0"
                  }
                  codeString={item.name}
                />
              </CustomTooltip>
              <CustomTooltip content={t("EditForm")}>
                <span className="text-lg text-default-600 cursor-pointer active:opacity-50 p-1.75">
                  <ReactIcons.Edit size={18} />
                </span>
              </CustomTooltip>
              <CustomTooltip color={CustomColor.danger} content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50 p-1.75">
                  <ReactIcons.Delete size={18} />
                </span>
              </CustomTooltip>
            </div>
          );
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
    />
  );
};

export default TenantReleaseTable;
