"use client";
import { CustomColor, CustomRadius, CustomSize } from "@/services/types";
import { Textarea } from "@heroui/react";
import { ReactNode } from "react";
import {
  InputTypes,
  InputVariant,
  LabelPlacementEnum,
} from "../customInput/customInput";

type CustomTextareaProps = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  label?: string;
  minRows?: number;
  maxRows?: number;
  disableAutosize?: boolean;
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
};

const CustomTextarea = ({
  radius = CustomRadius.md,
  labelPlacement = LabelPlacementEnum.outside,
  inputStyle = "text-default-900 font-medium",
  inputWrapperStyle = "border-1 bg-componentBg hover:bg-componentBgHover",
  labelStyle = "text-nowrap",
  descriptionStyle = "text-nowrap",
  ...props
}: CustomTextareaProps) => {
  return (
    <Textarea
      {...props}
      labelPlacement={labelPlacement}
      radius={radius}
      minRows={props.minRows}
      maxRows={props.maxRows}
      disableAutosize={props.disableAutosize}
      className={props.className}
      classNames={{
        innerWrapper: `${props.innerWrapperStyle}`,
        inputWrapper: `${inputWrapperStyle}`,
        input: inputStyle,
        label: `${labelStyle}`,
        description: `${descriptionStyle}`,
      }}
    />
  );
};

export default CustomTextarea;
