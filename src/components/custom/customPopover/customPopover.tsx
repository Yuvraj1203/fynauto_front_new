"use client";
import { CustomColor } from "@/services/types";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { ReactNode } from "react";

export enum TriggerTypeEnum {
  Dialog = "dialog",
  Menu = "menu",
  Listbox = "listbox",
  Tree = "tree",
  Grid = "grid",
}

export enum PopoverPlacementEnum {
  topStart = "top-start",
  top = "top",
  topEnd = "top-end",
  bottomStart = "bottom-start",
  bottom = "bottom",
  bottomEnd = "bottom-end",
  rightStart = "right-start",
  right = "right",
  rightEnd = "right-end",
  leftStart = "left-start",
  left = "left",
  leftEnd = "left-end",
}
type CustomPopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  color?: CustomColor;
  placement?: PopoverPlacementEnum;
  offset?: number;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  triggerType?: TriggerTypeEnum;
  triggerScaleOnOpen?: boolean;
  shouldBlockScroll?: boolean;
  shouldCloseOnScroll?: boolean;
  shouldCloseOnBlur?: boolean;
  isKeyboardDismissDisabled?: boolean;
};

const CustomPopover = ({
  trigger,
  children,
  placement,
  ...props
}: CustomPopoverProps) => {
  return (
    <Popover
      color={props.color}
      placement={placement}
      showArrow={true}
      offset={props.offset}
      isOpen={props.isOpen}
      onOpenChange={(open) => props.setIsOpen && props.setIsOpen(open)}
      {...props}
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
