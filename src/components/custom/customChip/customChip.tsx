import { CustomColor, CustomRadius, CustomSize } from "@/services/types";
import { Chip } from "@heroui/react";
import { ReactNode } from "react";

export enum ChipVariant {
  Solid = "solid",
  Bordered = "bordered",
  Light = "light",
  Flat = "flat",
  Faded = "faded",
  Shadow = "shadow",
  Dot = "dot",
}

type CustomChipProps = {
  children?: ReactNode;
  className?: string;
  color?: CustomColor;
  size?: CustomSize;
  radius?: CustomRadius;
  variant?: ChipVariant;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onClose?: () => void;
  contentStyle?: string;
};

const CustomChip = ({ ...props }: CustomChipProps) => {
  return (
    <>
      <Chip
        color={props.color}
        radius={props.radius}
        size={props.size}
        variant={props.variant}
        startContent={props.startContent}
        endContent={props.endContent}
        onClose={props.onClose}
        className={props.className}
        classNames={{
          content: `${props.contentStyle} font-medium`,
          base: "rounded-md",
        }}
      >
        {props.children}
      </Chip>
    </>
  );
};

export default CustomChip;
