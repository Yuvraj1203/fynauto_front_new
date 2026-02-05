export enum ThemeModeLabelEnum {
  Light = "light",
  Dark = "dark",
}

const ThemeScope = ({
  mode,
  children,
  className = "",
}: {
  mode: ThemeModeLabelEnum;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      data-theme={mode}
      className={`${mode} ${className}`}
      style={{ colorScheme: mode }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};

export default ThemeScope;
