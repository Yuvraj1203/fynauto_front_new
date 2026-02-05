"use client";
import { Text, TextVariant } from "@/components/common";
import { CustomColor, CustomRadius, CustomSize } from "@/services/types";
import { Tab, Tabs } from "@heroui/react";
import { ReactNode } from "react";

export enum TabVariant {
  Solid = "solid",
  Underlined = "underlined",
  Bordered = "bordered",
  Light = "light",
}

export enum TabPlacement {
  Top = "top",
  Bottom = "bottom",
  Start = "start",
  End = "end",
}

type CustomTabProps<T extends object> = {
  data: T[];
  itemKey: keyof T;
  itemTitle: keyof T;
  itemContent: keyof T;
  ariaLabel?: string;
  isDisabled?: boolean;
  disabledKeys?: string[];
  size?: CustomSize;
  radius?: CustomRadius;
  color?: CustomColor;
  variant?: TabVariant;
  placement?: TabPlacement;
  fullWidth?: boolean;
  className?: string;
  tablistStyle?: string;
  tabContentStyle?: string;
  withoutContent?: boolean;
  selected?: string;
  setSelected?: (value: string) => void;
  labelStyle?: string;
  label?: string;
  isRequired?: boolean;
};

const CustomTab = <T extends object>({
  data,
  ariaLabel = "Tabs",
  tabContentStyle = "text-default-800",
  withoutContent = false,
  labelStyle = "capitalize subpixel-antialiased text-small text-primary-text pb-2 text-nowrap",
  ...props
}: CustomTabProps<T>) => {
  return (
    <>
      {props.label && (
        <Text
          as={"label"}
          variant={TextVariant.subTitle}
          className={labelStyle}
        >
          <>
            {props.label}
            {props.isRequired && (
              <Text
                as="span"
                variant={TextVariant.subTitle}
                className="text-danger ml-1"
              >
                *
              </Text>
            )}
          </>
        </Text>
      )}
      <Tabs
        aria-label={ariaLabel}
        selectedKey={props.selected}
        onSelectionChange={(key) =>
          props.setSelected && props.setSelected(key as string)
        }
        items={data}
        isDisabled={props.isDisabled}
        disabledKeys={props.disabledKeys}
        size={props.size}
        radius={props.radius}
        color={props.color}
        variant={props.variant}
        placement={props.placement}
        fullWidth={props.fullWidth}
        className={props.className}
        classNames={{
          tabList: props.tablistStyle,
          tabContent: tabContentStyle,
        }}
      >
        {(item) => (
          <Tab
            key={item[props.itemKey] as string}
            title={item[props.itemTitle] as ReactNode}
          >
            {!withoutContent && props.itemContent
              ? (item[props.itemContent] as ReactNode)
              : null}
          </Tab>
        )}
      </Tabs>
    </>
  );
};

export default CustomTab;
