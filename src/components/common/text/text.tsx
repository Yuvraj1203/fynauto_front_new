// src/components/ui/Text.tsx
import clsx from "clsx";
import React from "react";

export enum TextVariant {
  headline = "headline",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  title = "title",
  subTitle = "subTitle",
  bodyLg = "bodyLg",
  body = "body",
  bodySm = "bodySm",
  caption = "caption",
  custom = "custom",
}

const variantClasses: Record<TextVariant, string> = {
  [TextVariant.headline]: "text-pre5 sm:text-5xl lg:text-6xl font-bold",
  [TextVariant.h1]: "text-3xl font-bold",
  [TextVariant.h2]: "text-2xl font-semibold",
  [TextVariant.h3]: "text-xl font-semibold",
  [TextVariant.title]: "text-xl lg:text-2xl text-primary-text font-semibold",
  [TextVariant.subTitle]: "text-sm",
  [TextVariant.bodyLg]: "text-base sm:text-lg lg:text-xl",
  [TextVariant.body]: "text-sm sm:text-base lg:text-lg ",
  [TextVariant.bodySm]: "text-xs sm:text-sm lg:text-base ",
  [TextVariant.caption]: "text-[10px] sm:text-xs lg:text-sm font-medium",
  [TextVariant.custom]: "", // No default styles for custom variant
};

type TextProps = React.HTMLAttributes<HTMLElement> & {
  variant?: TextVariant;
  as?: keyof HTMLElementTagNameMap; //choose the html tag
  className?: string;
  children: React.ReactNode;
};

const Text = ({
  variant = TextVariant.body,
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) => {
  return (
    <Component className={clsx(className, variantClasses[variant])} {...props}>
      {children}
    </Component>
  );
};

export default Text;
