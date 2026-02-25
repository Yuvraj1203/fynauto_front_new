"use client";

import { CustomSpinner } from "@/components/custom";
import { useSidebarStore } from "@/store/zustandStore";
import {
  getKeyValue,
  SharedSelection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { ReactNode, useCallback } from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
};

export enum TableSelectionModeEnum {
  Single = "single",
  Multiple = "multiple",
}

type Primitive = string | number;

type CustomTableProps<T extends object, V extends Primitive = string> = {
  columns?: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  rowKey: keyof T;
  isHeaderSticky?: boolean;
  isCompact?: boolean;
  isStriped?: boolean;
  thStyle?: string;
  trStyle?: string;
  tbodyStyle?: string;
  theadStyle?: string;
  tdStyle?: string;
  removeWrapper?: boolean;
  renderCustomCell?: (
    item: T,
    columnKey: keyof T,
  ) => string | number | ReactNode;
  selectionMode?: TableSelectionModeEnum;
  selectedValue?: V | V[];
  defaultSelectedValue?: V | V[];
  onSelectionChange?: (value: Primitive | Primitive[]) => void;
};

const CustomTable = <T extends object, V extends Primitive = string>({
  columns,
  data,
  loading = false,
  emptyText,
  rowKey,
  ...props
}: CustomTableProps<T>) => {
  const t = useTranslations();
  const sidebarState = useSidebarStore((state) => state.sidebarState);

  // Normalize incoming value(s) → string keys for Select
  const selectedKeys =
    props.selectedValue === undefined
      ? undefined
      : Array.isArray(props.selectedValue)
        ? props.selectedValue.map(String)
        : [String(props.selectedValue)];

  const defaultSelectedKeys =
    props.defaultSelectedValue === undefined
      ? undefined
      : Array.isArray(props.defaultSelectedValue)
        ? props.defaultSelectedValue.map(String)
        : [String(props.defaultSelectedValue)];

  const isNumberValue =
    typeof props.selectedValue === "number" ||
    (Array.isArray(props.selectedValue) &&
      typeof props.selectedValue[0] === "number");

  // Auto-generate header/columns if none provided
  const autoColumns: Column<T>[] =
    columns ??
    (data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          label: key.toUpperCase(),
        }))
      : []);

  // Proper value formatter if the getVALUE unable to render any value like boolean data
  const renderCell = useCallback((item: T, columnKey: React.Key) => {
    if (props.renderCustomCell) {
      return props.renderCustomCell(item, columnKey as keyof T);
    } else {
      const value = getKeyValue(item, columnKey as string);
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (value === null || value === undefined) return "-";

      return String(value);
    }
  }, []);

  //loading while fetching
  if (loading) {
    return <CustomSpinner className="grow" />;
  }

  return (
    <Table
      className={`max-w-[calc(100vw-32px)] ${
        sidebarState
          ? "lg:max-w-[calc(100vw-248px)]"
          : "lg:max-w-[calc(100vw-128px)]"
      } duration-250`}
      isHeaderSticky={props.isHeaderSticky}
      isStriped={props.isStriped}
      selectionMode={props.selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={(selection: SharedSelection) => {
        console.log("Selected keys:", selectedKeys, "Selection:", selection);
        if (selection === "all") {
          if (selectedKeys && selectedKeys[0] === "all") {
            props.onSelectionChange?.([]);
          } else {
            props.onSelectionChange?.(["all"]);
          }
          return;
        }
        const keys = Array.from(selection);
        const parsedValues = keys.map((k) =>
          isNumberValue ? (Number(k) as V) : (String(k) as V),
        );

        if (parsedValues.length === 0) {
          return;
        }

        const value: Primitive | Primitive[] =
          props.selectionMode === TableSelectionModeEnum.Multiple
            ? parsedValues
            : parsedValues[0];

        props.onSelectionChange?.(value);
      }}
      isCompact={props.isCompact}
      removeWrapper={props.removeWrapper}
      classNames={{
        tbody: `${props.tbodyStyle ? props.tbodyStyle : ""}`,
        thead: `${
          props.theadStyle
            ? props.theadStyle
            : "[&>tr]:first:shadow-none [&>*:nth-child(2)]:hidden"
        }`,
        th: `${props.thStyle ? props.thStyle : "text-base bg-surface"}`,
        tr: `${
          props.trStyle
            ? props.trStyle
            : "group border-default-200 text-default-800 [&:not(:last-child)]:border-b-1 shadow-none bg-surface rounded-medium overflow-hidden hover:bg-default-100 duration-250"
        }`,
        td: `${props.tdStyle ? props.tdStyle : ""}`,
      }}
    >
      <TableHeader columns={autoColumns}>
        {(column) => (
          <TableColumn key={String(column.key)}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={loading}
        emptyContent={emptyText ? emptyText : t("DataNotAvailable")}
        items={data}
      >
        {(item) => {
          const keyValue = item[rowKey];

          return (
            <TableRow key={String(keyValue)}>
              {(columnKey) => (
                <TableCell className="">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
