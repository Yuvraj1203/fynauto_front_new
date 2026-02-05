"use client";

import { CustomRadius, CustomSize } from "@/services/types";
import { stringToDateValue } from "@/utils/dateUtils/dateUtils";
import { DatePicker, DateValue } from "@heroui/react";
import { ReactNode, useState } from "react";
import { InputVariant, LabelPlacementEnum } from "../customInput/customInput";

type CustomDatePickerProps = {
  className?: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  variant?: InputVariant;
  labelPlacement?: LabelPlacementEnum;
  description?: string;
  showMonthAndYearPickers?: boolean;
  visibleMonths?: number;
  defaultValue?: DateValue | null;
  selectorIcon?: ReactNode;
  value?: string; // YYYY-MM-DD
  onChange?: (value?: string) => void;
  radius?: CustomRadius;
  inputStyle?: string;
  inputWrapperStyle?: string;
  labelStyle?: string;
  descriptionStyle?: string;
  innerWrapperStyle?: string;
  titleStyle?: string;
  calendarContentStyle?: string;
  size?: CustomSize;
};

const CustomDatePicker = ({
  visibleMonths = 1,
  radius = CustomRadius.md,
  labelPlacement = LabelPlacementEnum.outside,
  inputStyle = "text-default-900 font-medium",
  inputWrapperStyle = "border-1 bg-componentBg hover:bg-componentBgHover",
  labelStyle = "text-nowrap",
  descriptionStyle = "text-nowrap",
  ...props
}: CustomDatePickerProps) => {
  const [calendarValue, setCalendarValue] = useState<DateValue | null>(
    stringToDateValue(props.value)
  );

  const handleChange = (date: DateValue | null) => {
    if (date === null) return;
    setCalendarValue(date);
    props.onChange?.(date.toString());
  };

  return (
    <DatePicker
      {...props}
      value={calendarValue}
      onChange={handleChange}
      labelPlacement={labelPlacement}
      visibleMonths={visibleMonths}
      radius={radius}
      classNames={{
        innerWrapper: `${props.innerWrapperStyle}`,
        inputWrapper: `${inputWrapperStyle}`,
        input: `${inputStyle}`,
        label: `${labelStyle}`,
        description: `${descriptionStyle}`,
        calendarContent: `${props.calendarContentStyle} [&>div>div>table>thead>tr>th]:text-primary-text [&>div>div>button]:text-primary-text [&>div>div>button>span]:text-primary-text`,
      }}
    />
  );
};

export default CustomDatePicker;
