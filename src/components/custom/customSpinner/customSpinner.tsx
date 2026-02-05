"use client";
import { Spinner } from "@heroui/react";

export enum SpinnerVariant {
  default = "default",
  simple = "simple",
  gradient = "gradient",
  spinner = "spinner",
  wave = "wave",
  dots = "dots",
}

type CustomSpinnerProps = {
  variant?: SpinnerVariant;
  className?: string;
};

const CustomSpinner = ({
  variant = SpinnerVariant.default,
  className,
  ...props
}: CustomSpinnerProps) => {
  return <Spinner className={className} variant={variant} />;
};

export default CustomSpinner;
