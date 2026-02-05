import { Skeleton } from "@heroui/react";
import { ReactNode } from "react";

type CustomSkeletonProps = {
  children?: ReactNode;
  className?: string;
  isLoaded?: boolean;
};

const CustomSkeleton = ({
  className,
  children,
  isLoaded,
}: CustomSkeletonProps) => {
  return (
    <Skeleton className={className} isLoaded={isLoaded}>
      {children}
    </Skeleton>
  );
};

export default CustomSkeleton;
