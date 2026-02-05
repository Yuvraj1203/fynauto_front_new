import { ColorPopoverProps } from "./SegmentButtons";

const primaryColorChoices = [
  "#6200EE",
  "#2962FF",
  "#00C853",
  "#D50000",
  "#FF6D00",
  "#AA00FF",
  "#0091EA",
  "#C51162",
  "#FFD600",
  "#00B8D4",
  "#1DE9B6",
  "#3D5AFE",
  "#E64A19",
  "#5D4037",
  "#607D8B",
];

const PresentSegment = ({ colorValue, setColorValue }: ColorPopoverProps) => {
  return (
    <>
      <div className="grid gap-4 grid-cols-5">
        {primaryColorChoices.map((item, index) => {
          return (
            <span
              key={`${item}-${index}`}
              className={`${
                item == colorValue ? "border-primary" : "border-none"
              } size-6 rounded-full
              border-3`}
              style={{ background: item }}
              onClick={() => setColorValue(item)}
            ></span>
          );
        })}
      </div>
    </>
  );
};

export default PresentSegment;
