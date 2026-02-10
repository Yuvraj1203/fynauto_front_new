import { LayoutTypes } from "@/services/types";

const layout = ({ children }: LayoutTypes) => {
  return (
    <div className="flex h-dvh w-full bg-background overflow-hidden">
      {children}
    </div>
  );
};

export default layout;
