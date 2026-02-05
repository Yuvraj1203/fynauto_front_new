"use client";
import { CustomColor } from "@/services/types";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { cloneElement, ReactElement, ReactNode } from "react";
import { ButtonVariant } from "../customButton/customButton";

export enum DrawerPlacement {
  left = "left",
  right = "right",
  top = "top",
  bottom = "bottom",
}

export enum BackdropEnum {
  opaque = "opaque",
  blur = "blur",
  transparent = "transparent",
}

type CustomDrawerProps<T extends object = any> = {
  title?: ReactNode;
  content?: ReactNode;
  closeButton?: boolean;
  actionButton?: string;
  actionButtonPress?: () => void;
  placement?: DrawerPlacement;
  closeFloating?: string;
  hideCloseFloating?: boolean;
  backdrop?: BackdropEnum;
  trigger: ReactElement<T>;
  renderContent?: (onClose: () => void) => ReactNode;
  className?: string;
  wrapperStyle?: string;
  baseStyle?: string;
  headerStyle?: string;
  bodyStyle?: string;
};

const CustomDrawer = ({
  renderContent,
  actionButton,
  actionButtonPress,
  trigger,
  closeButton,
  className,
  wrapperStyle,
  baseStyle,
  headerStyle,
  bodyStyle,
  hideCloseFloating = true,
  backdrop = BackdropEnum.blur,
  placement = DrawerPlacement.left,
  ...props
}: CustomDrawerProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {cloneElement(trigger, {
        ...(trigger.type === Button
          ? { onPress: onOpen }
          : { onClick: onOpen }),
      })}
      <Drawer
        isOpen={isOpen}
        placement={placement}
        backdrop={backdrop}
        onOpenChange={onOpenChange}
        className={className}
        hideCloseButton={hideCloseFloating}
        classNames={{
          wrapper: `${wrapperStyle}`,
          base: `${baseStyle}`,
          body: `${bodyStyle}`,
          header: `${headerStyle} `,
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              {props.title && (
                <DrawerHeader className="flex flex-col gap-1">
                  {props.title}
                </DrawerHeader>
              )}
              {props.content && <DrawerBody>{props.content}</DrawerBody>}

              {renderContent && (
                <DrawerBody>{renderContent(onClose)}</DrawerBody>
              )}

              {(closeButton || actionButton) && (
                <DrawerFooter>
                  {closeButton && (
                    <Button
                      color={CustomColor.danger}
                      variant={ButtonVariant.ghost}
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  )}
                  {actionButton && (
                    <Button
                      color={CustomColor.primary}
                      onPress={actionButtonPress}
                    >
                      {actionButton}
                    </Button>
                  )}
                </DrawerFooter>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
