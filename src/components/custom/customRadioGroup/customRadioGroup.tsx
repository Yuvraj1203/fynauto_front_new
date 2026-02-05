"use client";
import { CustomSize } from "@/services/types";
import { Radio, RadioGroup } from "@heroui/react";
import { CheckboxOrientation } from "../customCheckboxGroup/customCheckboxGroup";

type CustomRadioGroupProps<T extends object> = {
  data: T[];
  id: keyof T;
  value?: keyof T;
  description?: keyof T;
  isDisabled?: boolean;
  orientation?: CheckboxOrientation;
  label?: string;
  selectedValue?: string;
  setSelectedValue?: (value: string) => void;
  labelStyle?: string;
  labelSize?: CustomSize;
  groupLabel?: string;
};

const CustomRadioGroup = <T extends object>({
  labelSize = CustomSize.sm,
  groupLabel = "subpixel-antialiased text-sm text-primary-text text-nowrap",
  labelStyle = "font-medium text-secondary-text",
  ...props
}: CustomRadioGroupProps<T>) => {
  return (
    <RadioGroup
      orientation={props.orientation}
      label={props.label}
      value={props.selectedValue}
      onValueChange={props.setSelectedValue}
      classNames={{
        label: groupLabel,
      }}
      //   isInvalid={props.validOptions?.length >0 ? isInvalid : false}
    >
      {props.data.map((item, index) => (
        <Radio
          key={index}
          description={
            item[props.description!]
              ? String(item[props.description!])
              : undefined
          }
          value={String(item[props.id])}
          classNames={{
            label: `ml-1 ${labelStyle}`,
          }}
          size={labelSize}
        >
          {props.value ? String(item[props.value]) : String(item[props.id])}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroup;
