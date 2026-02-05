import { CustomRadius, CustomSize } from "@/services/types";
import { Pagination } from "@heroui/react";

export enum PaginationVariant {
  flat = "flat",
  bordered = "bordered",
  faded = "faded",
  light = "light",
}

type CustomPaginationProps = {
  initialPage?: number;
  total?: number;
  isDisabled?: boolean;
  radius?: CustomRadius;
  size?: CustomSize;
  loop?: boolean;
  showControls?: boolean;
  variant?: PaginationVariant;
  className?: string;
  baseStyle?: string;
  wrapperStyle?: string;
  prevStyle?: string;
  nextStyle?: string;
  itemStyle?: string;
  cursorStyle?: string;
  forwardIconStyle?: string;
  ellipsisStyle?: string;
  chevronNextStyle?: string;
  onChange?: (page: number) => void;
  boundaries?: number;
  siblings?: number;
};

const CustomPagination = ({
  initialPage = 1,
  total = 1,
  radius = CustomRadius.md,
  size = CustomSize.md,
  variant = PaginationVariant.flat,
  showControls = true,
  ...props
}: CustomPaginationProps) => {
  return (
    <Pagination
      initialPage={initialPage}
      total={total}
      radius={radius}
      size={size}
      boundaries={props.boundaries}
      siblings={props.siblings}
      variant={variant}
      showControls={showControls}
      classNames={{
        base: `${props.baseStyle}`,
        wrapper: `${props.wrapperStyle}`,
        prev: `${props.prevStyle}`,
        next: `${props.nextStyle}`,
        item: `${props.itemStyle}`,
        cursor: `${props.cursorStyle}`,
        forwardIcon: `${props.forwardIconStyle}`,
        ellipsis: `${props.ellipsisStyle}`,
        chevronNext: `${props.chevronNextStyle}`,
      }}
      {...props}
    />
  );
};

export default CustomPagination;
