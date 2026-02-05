import { Input, Select, SelectItem } from "@heroui/react";
import { useFormContext } from "react-hook-form";

export enum FormTextInputType {
  text = "text",
  number = "number",
  email = "email",
  password = "password",
  select = "select",
}

// Define the props for FormTextInput without generics
export type FormTextInputProps<T> = {
  name: string; // name of the field
  label?: string;
  type?: FormTextInputType;
  selectItems?: T[]; //mandatory for select and has 'key' key in object
  selectedValue?: T | null; //mandatory for select
  handleSelectItemChange?: (value: string | number) => void; //mandatory for select
  displayKey?: keyof T; //mandatory for select
  isRequired?: boolean;
  style?: string;
  containerStyle?: string;
  isReadOnly?: boolean;
};

const FormTextInput = <T extends Record<string, any>>({
  name,
  label,
  type = FormTextInputType.text,
  selectItems = [],
  selectedValue,
  handleSelectItemChange,
  displayKey = "label",
  isRequired = false,
  style,
  containerStyle,
  isReadOnly = false,
}: FormTextInputProps<T>) => {
  // Get register and errors from the form context
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div
        className={`${containerStyle} flex w-full flex-wrap md:flex-nowrap gap-4`}
      >
        {type == FormTextInputType.select ? (
          <Select
            isRequired={isRequired}
            label={label}
            size={"sm"}
            {...register(name)}
            errorMessage={String(errors[name]?.message)}
            isInvalid={errors[name] ? true : false}
            selectedKeys={selectedValue?.key ? [selectedValue.key] : []}
            onChange={(e) => handleSelectItemChange?.(e.target.value)}
            className={style}
            classNames={{
              trigger:
                "bg-background data-[hover=true]:bg-background group-data-[focus=true]:bg-background !shadow-lightShadow",
            }}
          >
            {selectItems!.map((item: T, index: number) => (
              <SelectItem key={item.key}>{item[displayKey]}</SelectItem>
            ))}
          </Select>
        ) : (
          <Input
            {...register(name, {
              valueAsNumber: type === FormTextInputType.number,
            })}
            isRequired={isRequired}
            label={label ? label : null}
            type={type}
            variant={"flat"}
            size={"sm"}
            isReadOnly={isReadOnly}
            classNames={{
              inputWrapper:
                "bg-background data-[hover=true]:bg-background group-data-[focus=true]:bg-background !shadow-lightShadow",
            }}
            className={style}
            errorMessage={String(errors[name]?.message)}
            isInvalid={errors[name] ? true : false}
            spellCheck={"false"}
          />
        )}
      </div>
    </>
  );
};

export default FormTextInput;
