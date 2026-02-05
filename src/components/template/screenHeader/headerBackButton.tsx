"use client";
import { ReactIcons } from "@/public";
import { useRouter } from "next/navigation";

const HeaderBackButton = () => {
  const router = useRouter();
  return (
    <div className="min-h-full cursor-pointer" onClick={router.back}>
      <ReactIcons.ArrowDown size={24} className="rotate-90 mt-1" />
    </div>
  );
};

export default HeaderBackButton;
