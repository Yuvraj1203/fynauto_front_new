"use client";
import { Snippet } from "@heroui/react";
import { ReactNode } from "react";

export enum SnippetVariantEnum {
  bordered = "bordered",
  flat = "flat",
  solid = "solid",
  shadow = "shadow",
}

export enum SnippetRadiusEnum {
  none = "none",
  sm = "sm",
  md = "md",
  lg = "lg",
}

type CustomSnippetProps = {
  children?: ReactNode;
  hideSymbol?: boolean;
  codeString?: string;
  className?: string;
  variant?: SnippetVariantEnum;
  radius?: SnippetRadiusEnum;
};
const CustomSnippet = ({
  children,
  hideSymbol = true,
  radius = SnippetRadiusEnum.md,
  ...props
}: CustomSnippetProps) => {
  return (
    <Snippet
      classNames={{
        pre: "hidden",
      }}
      size="sm"
      radius={radius}
      hideSymbol={hideSymbol}
      {...props}
    >
      {children}
    </Snippet>
  );
};

export default CustomSnippet;
