import { CustomColor } from "@/services/types";
import { Tooltip } from "@heroui/react";
import { ReactNode } from "react";

type CustomTooltipProps = {
  children?: ReactNode;
  content?: ReactNode;
  color?: CustomColor;
};

const CustomTooltip = ({ ...props }: CustomTooltipProps) => {
  return (
    <Tooltip content={props.content} color={props.color}>
      {props.children}
    </Tooltip>
  );
};

export default CustomTooltip;
