"use client";

import { CustomSpinner } from "@/components/custom";
import { useSidebarStore } from "@/store/zustandStore";
import {
  getKeyValue,
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

type CustomTableProps<T> = {
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
};

const CustomTable = <T extends object>({
  columns,
  data,
  loading = false,
  emptyText,
  rowKey,
  ...props
}: CustomTableProps<T>) => {
  const t = useTranslations();
  const sidebarState = useSidebarStore((state) => state.sidebarState);

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
