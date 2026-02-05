"use client";
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

export enum BackdropEnum {
  opaque = "opaque",
  blur = "blur",
  transparent = "transparent",
}

type CustomModalProps<T extends object = any> = {
  title?: ReactNode;
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
  backdrop = BackdropEnum.transparent,
  closeFloating,
  children,
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
                </ModalHeader>
              )}

              {content && <ModalBody>{content}</ModalBody>}

              {children && <ModalBody>{children(onClose)}</ModalBody>}

              {(closeButton || actionButton) && (
                <ModalFooter>
                  {closeButton && (
                    <Button color="danger" variant="ghost" onPress={onClose}>
                      Close
                    </Button>
                  )}
                  {actionButton && (
                    <Button color="primary" onPress={actionButtonPress}>
                      {actionButton}
                    </Button>
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
