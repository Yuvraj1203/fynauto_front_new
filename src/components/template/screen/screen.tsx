import { LayoutTypes } from "@/services/types";

const Screen = ({
  children,
  className,
  defaultPadding = true,
}: LayoutTypes) => {
  return (
    <section
      className={`flex h-full text-primary-text font-normal rounded-2xl ${
        defaultPadding ? "p-4 sm:p-6" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
};

export default Screen;
