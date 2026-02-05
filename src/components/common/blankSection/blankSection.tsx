import { Text, TextVariant } from "@/components/common";
import { LayoutTypes } from "@/services/types";
import { ReactNode } from "react";

type BlankSectionProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  titleStyle?: string;
};

type BlankSectionPropsExtended = LayoutTypes & BlankSectionProps;

const BlankSection = ({ className, ...props }: BlankSectionPropsExtended) => {
  return (
    <div
      className={
        className
          ? className
          : "flex flex-col items-center justify-center gap-4 p-8 md:p-12 border-1 border-dashed border-default rounded-medium bg-surface text-center"
      }
    >
      {props.icon && <>{props.icon}</>}
      {props.title && (
        <Text variant={TextVariant.bodyLg} className={props.titleStyle}>
          {props.title}
        </Text>
      )}
      {props.description && (
        <Text variant={TextVariant.body}>{props.description}</Text>
      )}
    </div>
  );
};

export default BlankSection;
