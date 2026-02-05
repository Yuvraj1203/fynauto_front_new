import { LayoutTypes } from "@/services/types";

const LogoutButton = ({ className }: LayoutTypes) => {
  return (
    <a
      href="/auth/logout"
      className="flex items-center justify-center font-medium text-sm bg-primary rounded-medium text-onPrimary w-full h-10"
    >
      Log out
    </a>
  );
};

export default LogoutButton;
