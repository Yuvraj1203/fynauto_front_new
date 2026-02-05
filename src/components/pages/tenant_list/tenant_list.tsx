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
import { useCallback } from "react";

type TenantListModel = {
  tenantName: string;
  status: StatusEnum;
  androidVersion: string;
  iosVersion: string;
  actionId: string;
};

//custom header
const tableHeader = [
  { key: "tenantName", label: "App Name" },
  { key: "status", label: "Status" },
  { key: "androidVersion", label: "Android Version" },
  { key: "iosVersion", label: "IOS Version" },
  { key: "actionId", label: "Actions" },
];

export enum StatusEnum {
  OnGoing = "OnGoing",
  Published = "Published",
  Pending = "Pending",
  Failed = "Failed",
}

export const formsData: TenantListModel[] = [
  {
    tenantName: "Alpha Corp",
    status: StatusEnum.Failed,
    androidVersion: "1.2.0",
    iosVersion: "1.1.5",
    actionId: "alpha-001",
  },
  {
    tenantName: "Beta Solutions",
    status: StatusEnum.OnGoing,
    androidVersion: "1.0.8",
    iosVersion: "1.0.3",
    actionId: "beta-002",
  },
  {
    tenantName: "Gamma Tech",
    status: StatusEnum.Pending,
    androidVersion: "2.0.1",
    iosVersion: "2.0.0",
    actionId: "gamma-003",
  },
  {
    tenantName: "Delta Systems",
    status: StatusEnum.Published,
    androidVersion: "1.3.4",
    iosVersion: "1.3.2",
    actionId: "delta-004",
  },
  {
    tenantName: "Epsilon Labs",
    status: StatusEnum.OnGoing,
    androidVersion: "0.9.9",
    iosVersion: "0.9.7",
    actionId: "epsilon-005",
  },
];

export const StatusColorEnum = {
  OnGoing: "primary",
  Published: "success",
  Pending: "warning",
  Failed: "danger",
};

const statusColorMap: Record<string, CustomColor> = {
  OnGoing: CustomColor.primary,
  Published: CustomColor.success,
  Pending: CustomColor.warning,
  Failed: CustomColor.danger,
};

const TenantList = () => {
  //dynamic and customize cell rendering
  const renderCustomCell = useCallback(
    (item: TenantListModel, columnKey: keyof TenantListModel) => {
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
              {cellValue}
            </CustomChip>
          );
        case "actionId":
          return (
            <div className="relative flex items-center gap-2">
              <CustomTooltip content="Copy">
                <CustomSnippet
                  variant={SnippetVariantEnum.flat}
                  className={
                    "flex items-center justify-center text-default-600 bg-surface group-hover:bg-default-100 duration-250 min-w-4.5 p-0"
                  }
                  codeString={item.tenantName}
                />
              </CustomTooltip>
              <CustomTooltip content="Edit user">
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
    <div>
      <CustomTable
        columns={tableHeader}
        data={formsData}
        rowKey="actionId"
        isHeaderSticky={true}
        renderCustomCell={renderCustomCell}
      />
    </div>
  );
};

export default TenantList;
