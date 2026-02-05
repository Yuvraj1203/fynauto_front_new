"use client";
import { CustomSpinner } from "@/components/custom";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <CustomSpinner />
    </div>
  );
};

export default Loading;
