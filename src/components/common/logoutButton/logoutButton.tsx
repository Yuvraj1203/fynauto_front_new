"use client";
import { ReactIcons } from "@/public";
import { LayoutTypes } from "@/services/types";
import { userDetailsStore } from "@/store/zustandStore";

const LogoutButton = ({ className, isSidebarOpen }: LayoutTypes) => {
  const clearUserDetails = userDetailsStore((state) => state.clearUserDetails);

  /**
   *clear all the necessary details or data when user logs out
   */
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // stop instant navigation

    clearUserDetails();

    // small delay to allow persist middleware to write
    setTimeout(() => {
      window.location.href = "/auth/logout";
    }, 50);
  };

  return (
    <a
      href="/auth/logout"
      className="flex items-center justify-center font-medium text-sm bg-primary rounded-medium text-onPrimary w-full h-10 text-nowrap"
      onClick={handleLogout}
    >
      <ReactIcons.Logout size={24} className="p-0.5" />
      {isSidebarOpen && "Log out"}
    </a>
  );
};

export default LogoutButton;
