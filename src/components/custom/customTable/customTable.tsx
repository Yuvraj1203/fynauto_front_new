"use client";

import { CustomSpinner } from "@/components/custom";
import { useSidebarStore } from "@/store/zustandStore";
import type { Selection } from "@heroui/react";
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
  itemId?: keyof T | string; // Optional prop to specify unique identifier key, defaults to 'id'
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
  selectedValue?: string[]; // Array of selected keys from parent (strings for HeroUI)
  defaultSelectedValue?: string[]; // Array of default selected keys
  onSelectionChange?: (value: string[]) => void; // Returns array of selected keys to parent
};

const CustomTable = <T extends object, V extends Primitive = string>({
  columns,
  data,
  loading = false,
  emptyText,
  rowKey,
  itemId = "id",
  ...props
}: CustomTableProps<T>) => {
  const t = useTranslations();
  const sidebarState = useSidebarStore((state) => state.sidebarState);

  // Determine if V is number type
  const isValueNumberType = (): boolean => {
    if (!props.selectedValue || props.selectedValue.length === 0) {
      return false;
    }
    return typeof props.selectedValue[0] === "number";
  };

  // Convert array to Set<string> for HeroUI Table's selectedKeys prop
  // HeroUI internally uses string keys, so we always convert to strings for the Table
  const selectedKeys: Selection = props.selectedValue
    ? new Set(props.selectedValue.map(String))
    : new Set();

  // Handle default selected keys
  const defaultSelectedKeys: Selection = props.defaultSelectedValue
    ? new Set(props.defaultSelectedValue.map(String))
    : new Set();

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

  // Handle selection change - returns array to parent
  const handleSelectionChange = (selection: SharedSelection) => {
    const isNumberType = isValueNumberType();
    let selectedArray: string[] = [];

    if (selection === "all") {
      // "all" means all items are selected - return all item IDs as array
      selectedArray = data.map((item) => {
        const itemIdValue = item[itemId as keyof T];
        // Always convert to string for HeroUI Table
        return String(itemIdValue);
      });
    } else {
      // Convert Set to array of strings
      const keysArray = Array.from(selection as Set<React.Key>);
      selectedArray = keysArray.map((k) => String(k));
    }

    // Call parent's onSelectionChange with array
    props.onSelectionChange?.(selectedArray);
  };

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
      onSelectionChange={handleSelectionChange}
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
