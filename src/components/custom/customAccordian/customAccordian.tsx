"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { ReactNode } from "react";

type CustomAccordianProps<T extends object> = {
  data: T[];
  itemKey: keyof T;
  itemLabel: keyof T;
  itemContent: ReactNode;
};
const CustomAccordian = <T extends object>({
  data,
  ...props
}: CustomAccordianProps<T>) => {
  return (
    <Accordion>
      {data.map((item, index) => (
        <AccordionItem
          key={String(item[props.itemKey])}
          aria-label={String(item[props.itemLabel])}
          title={String(item[props.itemLabel])}
        >
          {props.itemContent}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CustomAccordian;
