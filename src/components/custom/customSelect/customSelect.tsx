"use client";

import { CustomRadius, CustomSize } from "@/services/types";
import { Select, SelectItem, SharedSelection } from "@heroui/react";
import type { Key } from "@react-types/shared";
import { LabelPlacementEnum } from "../customInput/customInput";

export enum SelectionModeEnum {
  single = "single",
  multiple = "multiple",
}

type Primitive = string | number;

type CustomSelectProps<T extends object, V extends Primitive = string> = {
  /** Data */
  data: T[];
  itemKey: keyof T;
  itemLabel: keyof T;

  /** Value handling */
  value?: V | V[];
  defaultValue?: V | V[];
  onChange: (value: V | V[]) => void;

  /** Behavior */
  selectionMode?: SelectionModeEnum;
  disallowEmptySelection?: boolean;

  /** UI */
  placeholder?: string;
  label?: string;
  className?: string;

  labelPlacement?: LabelPlacementEnum;
  triggerStyle?: string;
  description?: string;
  itemClassName?: string;
  disabled?: boolean;
  baseStyle?: string;
  isRequired?: boolean;
  labelStyle?: string;

  radius?: CustomRadius;
  size?: CustomSize;
};

const CustomSelect = <T extends object, V extends Primitive = string>({
  data,
  itemKey,
  itemLabel,
  value,
  defaultValue,
  onChange,
  selectionMode = SelectionModeEnum.single,
  disallowEmptySelection = true,
  placeholder,
  label,
  labelPlacement = LabelPlacementEnum.outsideTop,
  triggerStyle = "bg-surface border-default-200 border-1 bg-componentBg",
  itemClassName = "capitalize font-medium",
  labelStyle = "capitalize subpixel-antialiased text-sm text-primary-text mb-2 text-nowrap",
  baseStyle = "",
  ...props
}: CustomSelectProps<T, V>) => {
  // Normalize incoming value(s) → string keys for Select
  const selectedKeys =
    value === undefined
      ? undefined
      : Array.isArray(value)
      ? value.map(String)
      : [String(value)];

  const defaultSelectedKeys =
    defaultValue === undefined
      ? undefined
      : Array.isArray(defaultValue)
      ? defaultValue.map(String)
      : [String(defaultValue)];

  const isNumberValue =
    typeof value === "number" ||
    (Array.isArray(value) && typeof value[0] === "number");

  return (
    <>
      <Select
        label={label}
        placeholder={placeholder}
        labelPlacement={labelPlacement}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        disabled={props.disabled}
        description={props.description}
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection}
        className={props.className}
        isRequired={props.isRequired}
        classNames={{
          trigger: triggerStyle,
          base: baseStyle,
        }}
        size={props.size}
        radius={props.radius}
        onSelectionChange={(selection: SharedSelection) => {
          const keys = Array.from(selection);

          const parsedValues = keys.map((k) =>
            isNumberValue ? (Number(k) as V) : (String(k) as V)
          );

          onChange(
            selectionMode === SelectionModeEnum.multiple
              ? parsedValues
              : parsedValues[0]
          );
        }}
      >
        {data.map((item) => {
          const key = item[itemKey] as Key;
          const labelText = String(item[itemLabel] ?? "");

          return (
            <SelectItem
              key={String(key)}
              textValue={labelText}
              className={itemClassName}
            >
              {labelText}
            </SelectItem>
          );
        })}
      </Select>
    </>
  );
};

export default CustomSelect;
