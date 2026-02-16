"use client";
import { Text, TextVariant } from "@/components/common";
import { CustomColor } from "@/services/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { cloneElement, ReactElement, ReactNode } from "react";
import CustomButton, { ButtonVariant } from "../customButton/customButton";

export enum BackdropEnum {
  opaque = "opaque",
  blur = "blur",
  transparent = "transparent",
}

type CustomModalProps<T extends object = any> = {
  title?: ReactNode;
  subTitle?: ReactNode;
  content?: ReactNode;
  closeButton?: boolean;
  actionButton?: string;
  actionButtonPress?: () => void;
  trigger: ReactElement<T>;
  wrapperStyle?: string;
  contentWrapperStyle?: string;
  backdrop?: BackdropEnum;
  closeFloating?: string;
  children?: (onClose: () => void) => ReactNode;
  loading?: boolean;
};

const CustomModal = ({
  content,
  title,
  closeButton = true,
  actionButton,
  actionButtonPress,
  trigger,
  wrapperStyle,
  contentWrapperStyle,
  backdrop = BackdropEnum.blur,
  closeFloating,
  children,
  ...props
}: CustomModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {cloneElement(trigger, {
        ...(trigger.type === Button
          ? { onPress: onOpen }
          : { onClick: onOpen }),
      })}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          closeButton: `${closeFloating} -top-10 md:-right-4 md:-top-4 bg-background shadow-fullShadow cursor-pointer `,
          base: `overflow-visible ${wrapperStyle}`,
          body: `${contentWrapperStyle}`,
        }}
        backdrop={backdrop}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {title && (
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                  {props.subTitle && (
                    <Text
                      variant={TextVariant.subTitle}
                      className="text-secondary-text font-semibold"
                    >
                      {props.subTitle}
                    </Text>
                  )}
                </ModalHeader>
              )}

              {content && <ModalBody>{content}</ModalBody>}

              {children && <ModalBody>{children(onClose)}</ModalBody>}

              {(closeButton || actionButton) && (
                <ModalFooter>
                  {closeButton && (
                    <CustomButton
                      color={CustomColor.danger}
                      variant={ButtonVariant.light}
                      onClick={onClose}
                    >
                      Close
                    </CustomButton>
                  )}
                  {actionButton && (
                    <CustomButton
                      loading={props.loading}
                      onClick={actionButtonPress}
                    >
                      {actionButton}
                    </CustomButton>
                  )}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
