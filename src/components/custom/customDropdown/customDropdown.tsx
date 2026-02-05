"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  SharedSelection,
} from "@heroui/react";
import type { Key } from "@react-types/shared";
import { ReactNode } from "react";

export enum SelectionModeEnum {
  single = "single",
  multiple = "multiple",
}

type CustomDropdownProps<T extends object> = {
  children: ReactNode;
  data: T[];
  itemKey: keyof T;
  itemLabel: keyof T;
  showDivider?: boolean;
  disableKeys?: string[];
  disallowEmptySelection?: boolean;
  closeOnSelect?: boolean;
  selectedKeys?: "all" | Iterable<Key>;
  selectionMode?: SelectionModeEnum;
  onSelectionChange?: (keys: SharedSelection) => void;
  triggerStyle?: string;
};

const CustomDropdown = <T extends object>({
  showDivider = true,
  disallowEmptySelection = true,
  closeOnSelect = false,
  selectionMode = SelectionModeEnum.single,
  itemKey,
  itemLabel,
  ...props
}: CustomDropdownProps<T>) => {
  return (
    <Dropdown>
      <DropdownTrigger className="">{props.children}</DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection={disallowEmptySelection}
        closeOnSelect={closeOnSelect}
        selectionMode={selectionMode}
        selectedKeys={props.selectedKeys}
        onSelectionChange={props.onSelectionChange}
        disabledKeys={props.disableKeys}
      >
        <DropdownSection showDivider={showDivider}>
          {props.data.map((item, index) => (
            <DropdownItem key={item[itemKey] as Key} className="capitalize">
              {String(item[itemLabel])}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default CustomDropdown;
