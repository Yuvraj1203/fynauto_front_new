import { ReactIcons } from "@/public";
import { LayoutTypes } from "@/services/types";

const LogoutButton = ({ className, isSidebarOpen }: LayoutTypes) => {
  return (
    <a
      href="/auth/logout"
      className="flex items-center justify-center font-medium text-sm bg-primary rounded-medium text-onPrimary w-full h-10 text-nowrap"
    >
      <ReactIcons.Logout size={24} className="p-0.5" />
      {isSidebarOpen && "Log out"}
    </a>
  );
};

export default LogoutButton;
