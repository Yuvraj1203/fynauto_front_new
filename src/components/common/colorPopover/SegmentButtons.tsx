import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { HexColorPicker } from "react-colorful";
import PresentSegment from "./PresentSegment";

export type ColorPopoverProps = {
  colorValue: string;
  setColorValue: (value: string) => void;
};

const SegmentButtons = ({ colorValue, setColorValue }: ColorPopoverProps) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="present" title="Present">
          <Card>
            <CardBody>
              <PresentSegment
                colorValue={colorValue}
                setColorValue={setColorValue}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="custom" title="Custom">
          <Card>
            <CardBody>
              <HexColorPicker
                className="w-40! h-40! mx-2"
                color={colorValue}
                onChange={setColorValue}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default SegmentButtons;
