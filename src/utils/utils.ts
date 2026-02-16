import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { CustomColor, CustomRadius } from "@/services/types";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

export enum SnackbarEnum {
  "success" = "success",
  "default" = "default",
  "foreground" = "foreground",
  "primary" = "primary",
  "secondary" = "secondary",
  "warning" = "warning",
  "danger" = "danger",
}

//********************** toast types and enums START ************/
type showSnackbarProps = {
  title: string;
  description?: string;
  hideIcon?: boolean;
  promise?: Promise<any>;
  timeout?: number;
  shouldShowTimeoutProgress?: boolean;
  endContent?: React.ReactNode;
  icon?: React.ReactNode;
  color?: CustomColor;
  variant?: ToastVariantEnum;
  radius?: CustomRadius;
};

export enum ToastVariantEnum {
  Flat = "flat",
  Solid = "solid",
  Bordered = "bordered",
}

//********************** toast types and enums END ************/

export function generateUUID() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID &&
    window.isSecureContext
  ) {
    return crypto.randomUUID();
  }

  // RFC 4122 v4 fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// remove special char function
export function hasNoSpecialChars(value: string): boolean {
  if (value === "") return true;

  return /^[a-zA-Z0-9 ]*$/.test(value);
}

//get css value
export function getGlobalCSSProp(value: string): string {
  if (typeof window === "undefined") return "";

  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(value).trim();
}

//********************** toast Function START ************/
export const showSnackbar = (
  msg: string,
  type: SnackbarEnum,
  delay: number = 0,
  timeout: number = 1000,
) => {
  addToast({
    title: msg,
    color: type,
    promise: new Promise((resolve) => setTimeout(resolve, delay)),
    timeout: timeout,
  });
};

//********************** toast Function END ************/

//********************** base 64 START ************/

export function base64ToFile(
  base64: string,
  fileName: string,
  mimeType: string,
): File {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], fileName, { type: mimeType });
}

//********************** base 64 END ************/

//********************** proceedStepsStatus Start ************/
type Step = {
  id: number;
  label: string;
  status: TenantStatusEnum;
};
type UpdateStepsStatusReturn = {
  message: string;
  steps: Step[];
  step: number;
};

export const proceedStepsStatus = (
  steps: Step[],
  step: number,
  router: ReturnType<typeof useRouter>,
): UpdateStepsStatusReturn => {
  const updatedSteps = [...steps];

  // Mark current ongoing step as completed
  updatedSteps[step].status = TenantStatusEnum.completed;

  //change onGoing to pending
  let anyOngoing = updatedSteps.findIndex(
    (s, index) => s.status === TenantStatusEnum.ongoing,
  );

  if (anyOngoing > -1) {
    updatedSteps[anyOngoing].status = TenantStatusEnum.pending;
  }

  // Look for the next pending step *after* the current one
  let nextPendingIndex = updatedSteps.findIndex(
    (s, index) => index > step && s.status === TenantStatusEnum.pending,
  );

  // If not found, cycle to first pending step
  if (nextPendingIndex === -1) {
    nextPendingIndex = updatedSteps.findIndex(
      (s) => s.status === TenantStatusEnum.pending,
    );
  }

  if (nextPendingIndex === -1) {
    router.push("/");
    return { message: "All steps completed", steps: updatedSteps, step: 5 };
  }

  // Set next pending step to ongoing
  updatedSteps[nextPendingIndex].status = TenantStatusEnum.ongoing;
  return {
    message: "updation successful",
    steps: updatedSteps,
    step: nextPendingIndex + 1,
  };
};

//********************** proceedStepsStatus END ************/
