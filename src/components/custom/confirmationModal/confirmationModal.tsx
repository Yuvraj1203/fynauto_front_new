"use client";

import { Text, TextVariant } from "@/components/common";
import {
  BackdropEnum,
  ButtonVariant,
  CustomButton,
  CustomModal,
} from "@/components/custom";
import { CustomColor } from "@/services/types";
import { ReactNode } from "react";

export type ConfirmationModalProps = {
  state: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  title: ReactNode;
  description: ReactNode;
  cancelText?: string;
  successText?: string;
  loading?: boolean;
};

const ConfirmationModal = ({
  state: isOpen,
  onCancel,
  onSuccess,
  title,
  description,
  cancelText = "Cancel",
  successText = "Confirm",
  loading = false,
}: ConfirmationModalProps) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      backdrop={BackdropEnum.blur}
      closeButton={false}
      wrapperStyle="max-w-md"
    >
      {() => (
        <div className="flex flex-col gap-4 p-4">
          {title && (
            <div className="flex flex-col gap-1">
              <Text variant={TextVariant.title} as="h2">
                {title}
              </Text>
            </div>
          )}
          {description && (
            <Text
              variant={TextVariant.bodySm}
              className="text-secondary-text font-medium"
            >
              {description}
            </Text>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <CustomButton
              color={CustomColor.danger}
              variant={ButtonVariant.light}
              onClick={onCancel}
            >
              {cancelText}
            </CustomButton>
            <CustomButton loading={loading} onClick={onSuccess}>
              {successText}
            </CustomButton>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default ConfirmationModal;
