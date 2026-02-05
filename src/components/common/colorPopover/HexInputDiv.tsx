"use client";
import { ReactIcons } from "@/public";
import { showSnackbar } from "@/utils/utils";
import { Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { ColorPopoverProps } from "./SegmentButtons";

const HexInputDiv = ({ colorValue, setColorValue }: ColorPopoverProps) => {
  const [inputValue, setInputValue] = useState(colorValue);

  useEffect(() => {
    setInputValue(colorValue);
  }, [colorValue]);

  function isValidHex(hex: string): boolean {
    return /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex.trim());
  }

  const handleColorValue = useCallback(() => {
    const trimmed = inputValue.trim();
    if (
      trimmed.startsWith("#") &&
      trimmed !== colorValue &&
      trimmed.length > 3 &&
      trimmed.length < 10 &&
      isValidHex(trimmed)
    ) {
      setColorValue(trimmed);
    } else {
      showSnackbar("Please input valid HEX", "warning");
    }
  }, [inputValue, colorValue, setColorValue]);

  return (
    <>
      <div className="flex items-center mx-2 gap-2">
        <Input
          size="sm"
          value={inputValue}
          startContent={"HEX"}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleColorValue();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          className="font-semibold text-outline "
          classNames={{
            input: "w-20",
            inputWrapper: "max-w-fit",
          }}
        />
        <span
          className="text-success cursor-pointer"
          onClick={handleColorValue}
        >
          <ReactIcons.TickCircle />
        </span>
      </div>
    </>
  );
};

export default HexInputDiv;
