"use client";
import { CustomColor, CustomSize } from "@/services/types";
import { Switch } from "@heroui/react";
import { ReactNode } from "react";

type CustomSwitchProps = {
  children?: ReactNode;
  isSelected?: boolean;
  setIsSelected?: (value: boolean) => void;
  size?: CustomSize;
  color?: CustomColor;
  labelStyle?: string;
  baseStyle?: string;
  className?: string;
};

const CustomSwitch = ({
  children,
  isSelected,
  setIsSelected,
  className,
  baseStyle = "inline-flex flex-row-reverse w-full gap-3",
  ...props
}: CustomSwitchProps) => {
  return (
    <Switch
      size={props.size}
      color={props.color}
      isSelected={isSelected}
      onValueChange={setIsSelected}
      className={className}
      classNames={{
        label: `${props.labelStyle}`,
        base: `${baseStyle}`,
      }}
    >
      {children}
    </Switch>
  );
};

export default CustomSwitch;
