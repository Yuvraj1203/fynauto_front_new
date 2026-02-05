import { Text, TextVariant } from "@/components/common";

type ColorPickerTriggerProps = {
  selectedColor: string;
  label: string;
};
const ColorPickerTrigger = ({
  label,
  selectedColor,
}: ColorPickerTriggerProps) => {
  return (
    <>
      <div
        style={{ backgroundColor: selectedColor }}
        className=" h-10 rounded-t-medium"
      ></div>
      <Text
        variant={TextVariant.bodySm}
        className="text-secondary-text text-center"
      >
        {label}
      </Text>
    </>
  );
};

export default ColorPickerTrigger;
