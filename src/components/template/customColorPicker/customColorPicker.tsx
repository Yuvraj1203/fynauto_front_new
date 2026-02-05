"use client";
import { Text, TextVariant } from "@/components/common";
import {
  ButtonVariant,
  CustomButton,
  CustomInput,
  CustomPopover,
  InputVariant,
} from "@/components/custom";
import CustomTab, { TabVariant } from "@/components/custom/customTab/customTab";
import { ReactIcons } from "@/public";
import { CustomColor } from "@/services/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ColorPickerTabs, { ColorpickerTabEnum } from "./colorPickerTabs";
import ColorPickerTrigger from "./colorPickerTrigger";

type CustomColorPickerProps = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  label: string;
};
const CustomColorPicker = ({
  selectedColor,
  setSelectedColor,
  label,
}: CustomColorPickerProps) => {
  const t = useTranslations();

  const [customColorValue, setCustomColorValue] =
    useState<string>(selectedColor);

  const isValidHex = (value: string) =>
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(
      value
    );

  const handleSelectedColor = (color: string) => {
    setSelectedColor(color);
    setCustomColorValue(color);
  };

  const handleColorSwitch = () => {
    if (isValidHex(customColorValue)) {
      setSelectedColor(customColorValue);
    } else {
      setCustomColorValue(selectedColor);
    }
  };

  const handleCustomColorValueChange = (color: string) => {
    if (color.startsWith("#") && color.length < 10) {
      setCustomColorValue(color);
    }
  };

  const tabsData = [
    {
      key: "Default",
      title: "Default",
      content: (
        <ColorPickerTabs
          navigateFrom={ColorpickerTabEnum.Default}
          selectedColor={selectedColor}
          setSelectedColor={handleSelectedColor}
        />
      ),
    },
    {
      key: "Custom",
      title: "Custom",
      content: (
        <ColorPickerTabs
          navigateFrom={ColorpickerTabEnum.Custom}
          selectedColor={selectedColor}
          setSelectedColor={handleSelectedColor}
        />
      ),
    },
  ];

  return (
    <CustomPopover
      trigger={
        <div className="flex flex-col w-full bg-surface rounded-medium shadow-moderate cursor-pointer">
          <ColorPickerTrigger label={label} selectedColor={selectedColor} />
        </div>
      }
    >
      <>
        <CustomTab
          ariaLabel={t("ColorPickerTabs")}
          variant={TabVariant.Underlined}
          data={tabsData}
          itemKey={"key"}
          itemTitle={"title"}
          itemContent={"content"}
        />
        <div className="flex items-center justify-between w-[188px] gap-1 cursor-pointer">
          <CustomInput
            value={customColorValue}
            onChange={(e) => handleCustomColorValueChange(e.target.value)}
            startContent={<Text variant={TextVariant.caption}>{"HEX "}</Text>}
            className="w-3/4 border-default"
            variant={InputVariant.bordered}
            onKeyDown={(e) => e.key === "Enter" && handleColorSwitch()}
          />
          <CustomButton
            onClick={handleColorSwitch}
            className={" min-w-10 bg-surface border-1 border-default-300"}
            variant={ButtonVariant.bordered}
            color={CustomColor.default}
          >
            {<ReactIcons.Plus />}
          </CustomButton>
        </div>
      </>
    </CustomPopover>
  );
};

export default CustomColorPicker;
