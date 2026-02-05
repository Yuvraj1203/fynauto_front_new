"use client";
import { CustomColor, CustomRadius, CustomSize } from "@/services/types";
import { Button } from "@heroui/react";
import { ReactNode } from "react";

export enum ButtonVariant {
  solid = "solid",
  bordered = "bordered",
  light = "light",
  flat = "flat",
  faded = "faded",
  shadow = "shadow",
  ghost = "ghost",
}

export enum ButtonType {
  submit = "submit",
  reset = "reset",
  button = "button",
}

type CustomButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  color?: CustomColor;
  size?: CustomSize;
  radius?: CustomRadius;
  type?: ButtonType;
  fullWidth?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  startContent?: ReactNode;
  isIconOnly?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const CustomButton = ({
  color = CustomColor.primary,
  isDisabled = false,
  type = ButtonType.button,
  loading = false,
  size = CustomSize.md,
  radius = CustomRadius.md,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      variant={props.variant}
      color={color}
      size={size}
      radius={radius}
      fullWidth={props.fullWidth}
      isDisabled={isDisabled}
      className={`min-h-10 ${props.className}`}
      onPress={props.onClick}
      type={type}
      isLoading={loading}
      startContent={props.startContent}
      isIconOnly={props.isIconOnly}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
