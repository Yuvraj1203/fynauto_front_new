"use client";
import { CustomSpinner } from "@/components/custom";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full ">
      <CustomSpinner />
    </div>
  );
};

export default LoadingPage;
