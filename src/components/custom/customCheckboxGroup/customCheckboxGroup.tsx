import { CustomSize } from "@/services/types";
import { Checkbox, CheckboxGroup } from "@heroui/react";

export enum CheckboxOrientation {
  horizontal = "horizontal",
  vertical = "vertical",
}

type CustomCheckboxGroupProps<T extends object> = {
  data: T[];
  id: keyof T;
  value?: keyof T;
  label?: string;
  selectedValue?: string[];
  setSelectedValue?: (value: string[]) => void;
  orientation?: CheckboxOrientation;
  labelStyle?: string;
  labelSize?: CustomSize;
  groupLabel?: string;
};

const CustomCheckboxGroup = <T extends object>({
  labelSize = CustomSize.sm,
  groupLabel = "subpixel-antialiased text-sm text-primary-text text-nowrap",
  labelStyle = "font-medium text-secondary-text",
  ...props
}: CustomCheckboxGroupProps<T>) => {
  return (
    <CheckboxGroup
      orientation={props.orientation}
      value={props.selectedValue}
      onValueChange={props.setSelectedValue}
      label={props.label}
      classNames={{
        label: groupLabel,
      }}
    >
      {props.data.map((item, index) => (
        <Checkbox
          key={index}
          size={labelSize}
          value={String(item[props.id])}
          classNames={{
            label: `${labelStyle}`,
          }}
        >
          {props.value ? String(item[props.value]) : String(item[props.id])}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default CustomCheckboxGroup;
