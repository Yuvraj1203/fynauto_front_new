"use client";

import { HexColorPicker } from "react-colorful";

export enum ColorpickerTabEnum {
  Default = "Default",
  Custom = "Custom",
}

type ColorPickerTabsProps = {
  navigateFrom: ColorpickerTabEnum;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

const defaultColors = [
  // Row 1 — Deep & elegant (luxury feel)
  { predefineColor: "#ff0055" },
  { predefineColor: "#006c48" },
  { predefineColor: "#006fee" },
  { predefineColor: "#7828c8" },

  // Row 2 — Cool retro (very trendy)
  { predefineColor: "#52796F" }, // Retro teal
  { predefineColor: "#4A6FA5" }, // Dusty blue
  { predefineColor: "#6B705C" }, // Olive grey
  { predefineColor: "#8D99AE" }, // Cool desaturated blue

  // Row 3 — Soft pastels (user favorites)
  { predefineColor: "#E6B8C2" }, // Blush pink
  { predefineColor: "#CDB4DB" }, // Lavender
  { predefineColor: "#BEE1E6" }, // Pastel cyan
  { predefineColor: "#F1DCA7" }, // Soft pastel yellow

  // Row 4 — Neutral pastels (background-safe)
  { predefineColor: "#FAF3DD" }, // Cream
  { predefineColor: "#EDEDE9" }, // Soft grey
  { predefineColor: "#DAD7CD" }, // Warm neutral
  { predefineColor: "#F5EBE0" }, // Beige pastel
];

const ColorPickerTabs = ({ navigateFrom, ...props }: ColorPickerTabsProps) => {
  if (navigateFrom == ColorpickerTabEnum.Default) {
    return (
      <div className="grid grid-cols-4 gap-3 rounded-medium bg-background p-3 shadow-inner">
        {defaultColors.map((color) => (
          <span
            onClick={() => props.setSelectedColor(color.predefineColor)}
            style={{ backgroundColor: color.predefineColor }}
            key={color.predefineColor}
            className={`size-8 rounded-medium cursor-pointer border-2 ${
              color.predefineColor == props.selectedColor
                ? "border-default-900"
                : "border-default-300"
            }`}
          ></span>
        ))}
      </div>
    );
  }

  if (navigateFrom == ColorpickerTabEnum.Custom) {
    return (
      <div className=" ">
        <HexColorPicker
          className="max-w-[188px] max-h-[188px]"
          color={props.selectedColor} // always valid
          onChange={props.setSelectedColor}
        />
      </div>
    );
  }

  return <></>;
};

export default ColorPickerTabs;
