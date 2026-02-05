import { CustomModal } from "@/components/custom";
import { ReactIcons } from "@/public";
import { GetTenantIdByNameModel } from "@/services/models";
import { useCurrentTenantInfoStore } from "@/store/zustandStore";
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import FetchDetails from "./fetchDetails";

type TenantTableProps = {
  allTenants: GetTenantIdByNameModel[];
  getAllTenants: () => void;
  handleDeleteTenant: (value: GetTenantIdByNameModel) => void;
  handleGetFolder: (value: GetTenantIdByNameModel) => void;
};

type User = {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  email: string;
};

type Column = {
  name: string;
  uid: string;
  sortable?: boolean;
};

type StatusOption = {
  name: string;
  uid: string;
};

type InputProps = React.ComponentProps<typeof Input>;
type ButtonProps = React.ComponentProps<typeof Button>;
type DropdownProps = React.ComponentProps<typeof Dropdown>;
type TableProps = React.ComponentProps<typeof Table>;

type SortableColumn = Extract<keyof GetTenantIdByNameModel, string>;

export const columns: Column[] = [
  { name: "TENANT ID", uid: "tenantId", sortable: true },
  { name: "TENANCY NAME", uid: "tenancyName", sortable: true },
  { name: "TENANT NAME", uid: "tenantName", sortable: true },
  { name: "STEP", uid: "step", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions: StatusOption[] = [
  { name: "Pending", uid: "Pending" },
  { name: "On-Going", uid: "On-Going" },
  { name: "Completed", uid: "Completed" },
];

export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({ size = 24, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      role="presentation"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

export const VerticalDotsIcon = ({ size = 24, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      role="presentation"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SearchIcon = () => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  Completed: "success",
  Pending: "danger",
  "On-Going": "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "tenantId",
  "tenancyName",
  "tenantName",
  "status",
  "step",
  "actions",
];

const TenantTable = ({
  allTenants,
  getAllTenants,
  handleDeleteTenant,
  handleGetFolder,
}: TenantTableProps) => {
  const currentTenantInfo = useCurrentTenantInfoStore();
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<
    "all" | Set<string>
  >(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "tenantId" as SortableColumn,
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns as Set<string>).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...allTenants];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.tenancyName?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status!),
      );
    }

    return filteredUsers;
  }, [allTenants, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const column = sortDescriptor.column as SortableColumn;
      const first = a[column];
      const second = b[column];

      if (typeof first === "string" && typeof second === "string") {
        return sortDescriptor.direction === "descending"
          ? second.localeCompare(first)
          : first.localeCompare(second);
      }

      if (typeof first === "number" && typeof second === "number") {
        return sortDescriptor.direction === "descending"
          ? second - first
          : first - second;
      }

      // Fallback for other types (shouldn't occur in this case)
      return 0;
    });
  }, [sortDescriptor, items]);

  const handleProceed = (user: GetTenantIdByNameModel) => {
    currentTenantInfo.setCurrentTenantInfo(user);
    console.log(user.step, "user.step");
    currentTenantInfo.setCurrentStep(user.step!);
    Cookies.set("currentTenant", user.tenantId!);
    router.push("/dashboard/tenant-creation");
  };

  const renderCell = React.useCallback(
    (
      user: GetTenantIdByNameModel,
      columnKey: keyof GetTenantIdByNameModel | "actions",
    ) => {
      const cellValue = columnKey === "actions" ? null : user[columnKey];

      switch (columnKey) {
        // case "name":
        //   return (
        //     <User
        //       avatarProps={{ radius: "lg", src: user.avatar }}
        //       description={user.email}
        //       name={cellValue}
        //     >
        //       {user.email}
        //     </User>
        //   );
        // case "role":
        //   return (
        //     <div className="flex flex-col">
        //       <p className="text-bold text-small capitalize">{cellValue}</p>
        //       <p className="text-bold text-tiny capitalize text-default-400">
        //         {user.team}
        //       </p>
        //     </div>
        //   );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status!] as ChipProps["color"]}
              size="sm"
              variant="flat"
            >
              {cellValue?.toString()}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleProceed(user)} key="view">
                    Proceed
                  </DropdownItem>
                  <DropdownItem onClick={() => handleGetFolder(user)} key="get">
                    Download Zip
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleDeleteTenant(user)}
                    key="delete"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          if (typeof cellValue == "object") {
            return;
          }
          return cellValue;
      }
    },
    [],
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex max-md:flex-col justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  const typedKeys = new Set(Array.from(keys).map(String)); // force string
                  if (typedKeys.size === columns.length) {
                    setVisibleColumns("all");
                  } else {
                    setVisibleColumns(typedKeys);
                  }
                }}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <CustomModal
              title="Add Tenant"
              children={(onClose) => (
                <FetchDetails getAllTenants={getAllTenants} onClose={onClose} />
              )}
              closeButton={false}
              trigger={
                <Button color="primary" endContent={<PlusIcon />}>
                  Add New
                </Button>
              }
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {allTenants.length} users
          </span>
          <div className="flex justify-between items-center gap-5 md:gap-10">
            <span
              onClick={getAllTenants}
              className={` text-outline flex items-center justify-center size-6 shadow-lightShadow rounded-lg duration-400 cursor-pointer `}
            >
              <ReactIcons.Refresh />
            </span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    allTenants.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex max-md:flex-col max-md:gap-2 justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper:
          "max-md:w-[calc(100vw-120px)] max-h-[382px] w-full  customScrollbar",
        table: "min-w-full ",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      onSelectionChange={setSelectedKeys as TableProps["onSelectionChange"]}
      onSortChange={(descriptor) =>
        setSortDescriptor(
          descriptor as {
            column: SortableColumn;
            direction: "ascending" | "descending";
          },
        )
      }
      topContent={topContent}
      topContentPlacement="outside"
      className="p-5"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.tenantId}>
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  columnKey as keyof GetTenantIdByNameModel | "actions",
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TenantTable;
