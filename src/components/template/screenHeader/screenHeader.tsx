import { Text, TextVariant } from "@/components/common";
import { ReactNode } from "react";
import HeaderBackButton from "./headerBackButton";
import ScreenRightContent from "./screenRightContent";

type ScreenHeaderProps = {
  children?: ReactNode;
  className?: string;
  title?: string;
  subTitle?: string;
  buttonContainerStyle?: string;
  showBackButton?: boolean;
  moderateCustomStyle?: boolean;
};
const ScreenHeader = ({
  children,
  className,
  title,
  subTitle,
  buttonContainerStyle,
  showBackButton = false,
  ...props
}: ScreenHeaderProps) => {
  return (
    <div
      className={`flex gap-4 items-center justify-between ${props.moderateCustomStyle ? className : `bg-surface border-b-1 border-default-300 w-full ${className}`}`}
    >
      <div className="flex gap-2">
        {showBackButton && <HeaderBackButton />}
        <div className="flex flex-col gap-1">
          <Text
            as="h3"
            variant={TextVariant.title}
            className="line-clamp-1 text-ellipsis"
          >
            {title}
          </Text>
          <Text
            variant={TextVariant.subTitle}
            className="line-clamp-1 text-ellipsis text-secondary-text font-semibold"
          >
            {subTitle}
          </Text>
        </div>
      </div>

      {children && (
        <ScreenRightContent buttonContainerStyle={buttonContainerStyle}>
          {children}
        </ScreenRightContent>
      )}
    </div>
  );
};

export default ScreenHeader;
