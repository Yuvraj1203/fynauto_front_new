"use client";

import { Accordion, AccordionItem } from "@heroui/react";

export enum AccordionVariant {
  Light = "light",
  Shadow = "shadow",
  Bordered = "bordered",
  Splitted = "splitted",
}

type CustomAccordionProps<T extends object> = {
  data: T[];
  itemKey: keyof T;
  itemLabel: keyof T;
  itemContentKey: keyof T;
  variant?: AccordionVariant;
  baseStyle?: string;
  contentStyle?: string;
  className?: string;
  renderContent: (item: T, index: number) => React.ReactNode;
  renderHeader?: (item: T) => React.ReactNode;
};
const CustomAccordion = <T extends object>({
  data,
  ...props
}: CustomAccordionProps<T>) => {
  return (
    <Accordion className={props.className} variant={props.variant}>
      {data.map((item, index) => (
        <AccordionItem
          key={String(item[props.itemKey])}
          aria-label={String(item[props.itemLabel])}
          title={
            props.renderHeader
              ? props.renderHeader(item)
              : String(item[props.itemLabel])
          }
          classNames={{
            base: props.baseStyle,
            content: props.contentStyle,
          }}
        >
          {props.renderContent(item, index)}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CustomAccordion;
