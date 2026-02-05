"use client";

import { CustomSize } from "@/services/types";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export type AutoItem = {
  key: string | number;
  label: string | number;
};

type CustomAutoCompleteProps<T extends AutoItem> = {
  items: T[];
  label?: string;
  placeholder?: string;
  size?: CustomSize;
  className?: string;
  defaultSelectedItem?: string | number;
  onSelection?: (value: string | number) => void;
  isRequired?: boolean;
  clearIcon?: boolean;
  errorMessage?: string;
  isReadOnly?: boolean;
};

const CustomAutoComplete = <T extends AutoItem>({
  items,
  defaultSelectedItem,
  placeholder,
  size = CustomSize.sm,
  className = "max-w-xs",
  isRequired = false,
  clearIcon = true,
  errorMessage = "",
  ...props
}: CustomAutoCompleteProps<T>) => {
  //   const [value, setValue] = useState("");

  const onSelectionChange = (id: any) => {
    if (props.onSelection) {
      props.onSelection(id);
    }
  };

  return (
    <Autocomplete
      className={className}
      defaultItems={items}
      label={props.label}
      placeholder={placeholder}
      size={size}
      isRequired={isRequired}
      isReadOnly={props.isReadOnly}
      onSelectionChange={onSelectionChange}
      defaultSelectedKey={defaultSelectedItem ? defaultSelectedItem : undefined}
      classNames={{
        clearButton: `${clearIcon ? "block" : "hidden"}`,
      }}
    >
      {(item) => (
        <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default CustomAutoComplete;
