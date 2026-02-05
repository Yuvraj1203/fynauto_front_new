"use client";

import { CustomPopover } from "@/components/custom";
import { useWindowWidth } from "@/hooks";
import { ReactIcons } from "@/public";

type ScreenRightContentProps = {
  children?: React.ReactNode;
  buttonContainerStyle?: string;
};

const ScreenRightContent = ({
  children,
  buttonContainerStyle,
}: ScreenRightContentProps) => {
  const { isMobile } = useWindowWidth();
  return (
    <>
      {isMobile ? (
        <CustomPopover
          trigger={<ReactIcons.More size={24} className="text-outline" />}
        >
          <div className={`flex flex-col my-2 gap-4 ${buttonContainerStyle}`}>
            {children}
          </div>
        </CustomPopover>
      ) : (
        <div className={`flex items-center gap-4 ${buttonContainerStyle}`}>
          {children}
        </div>
      )}
    </>
  );
};

export default ScreenRightContent;
