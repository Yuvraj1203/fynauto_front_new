"use client";
import { CustomColor, CustomRadius, CustomSize } from "@/services/types";
import { Input } from "@heroui/react";
import { ReactNode } from "react";

export enum InputTypes {
  text = "text",
  email = "email",
  url = "url",
  password = "password",
  tel = "tel",
  search = "search",
  file = "file",
  number = "number",
}

export enum LabelPlacementEnum {
  inside = "inside",
  outside = "outside",
  outsideLeft = "outside-left",
  outsideTop = "outside-top",
}

export enum InputVariant {
  flat = "flat",
  bordered = "bordered",
  faded = "faded",
  underlined = "underlined",
}

type CustomInputProps = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  label?: string;
  type?: InputTypes;
  startContent?: ReactNode;
  endContent?: ReactNode;
  labelPlacement?: LabelPlacementEnum;
  variant?: InputVariant;
  color?: CustomColor;
  children?: ReactNode;
  size?: CustomSize;
  radius?: CustomRadius;
  placeholder?: string;
  isRequired?: boolean;
  fullWidth?: boolean;
  isClearable?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  disableAnimation?: boolean;
  className?: string;
  inputWrapperStyle?: string;
  innerWrapperStyle?: string;
  inputStyle?: string;
  labelStyle?: string;
  description?: string;
  descriptionStyle?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const CustomInput = ({
  radius = CustomRadius.md,
  labelPlacement = LabelPlacementEnum.outside,
  inputStyle = "text-default-900 font-medium",
  inputWrapperStyle = "border-1 bg-componentBg hover:bg-componentBgHover",
  labelStyle = "text-nowrap",
  descriptionStyle = "text-nowrap",
  ...props
}: CustomInputProps) => {
  return (
    <Input
      {...props}
      onValueChange={props.onValueChange}
      onChange={props.onChange}
      labelPlacement={labelPlacement}
      radius={radius}
      onKeyDown={props.onKeyDown}
      className={props.className}
      description={props.description}
      classNames={{
        innerWrapper: `${props.innerWrapperStyle}`,
        inputWrapper: `${inputWrapperStyle}`,
        input: `${inputStyle}`,
        label: `${labelStyle}`,
        description: `${descriptionStyle}`,
      }}
    />
  );
};

export default CustomInput;
