import { CustomSize } from "@/services/types";
import { Checkbox } from "@heroui/react";

type CustomCheckboxProps = {
  isSelected: boolean;
  setIsSelected: (value: boolean) => void;
  label: string;
  labelSize?: CustomSize;
  labelStyle?: string;
};
const CustomCheckbox = ({
  labelSize = CustomSize.sm,
  ...props
}: CustomCheckboxProps) => {
  return (
    <Checkbox
      size={labelSize}
      isSelected={props.isSelected}
      onValueChange={props.setIsSelected}
      classNames={{
        label: `${props.labelStyle}`,
      }}
    >
      {props.label}
    </Checkbox>
  );
};

export default CustomCheckbox;
