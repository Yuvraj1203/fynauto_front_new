"use client";
import { CustomImage } from "@/components/custom";
import { useWindowWidth } from "@/hooks";
import { Routes } from "@/navigation/routes";
import { Images, ReactIcons } from "@/public";
import { useSidebarStore } from "@/store/zustandStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/common";
import NavItem from "./navItem";

const navList = [
  {
    label: "Dahboard",
    icon: <ReactIcons.Dashboard size={24} className="p-0.5" />,
    href: Routes.protected.dashboard,
  },
];

type SidebarProps = {
  onClose?: () => void;
  fromLayout?: boolean;
};

const Sidebar = ({ onClose, fromLayout }: SidebarProps) => {
  const { isMobile } = useWindowWidth();
  const pathname = usePathname();
  const sidebarState = useSidebarStore((state) => state.sidebarState);
  const isSidebarOpen = isMobile ? true : sidebarState;

  if (isMobile && fromLayout) return;

  return (
    <aside
      className={`${fromLayout ? " max-lg:hidden" : "max-lg:flex"} ${
        isSidebarOpen ? "w-full lg:w-64 " : "w-full lg:w-20"
      } flex flex-col items-center px-4 gap-2 h-full duration-250`}
    >
      <Link
        href={Routes.protected.dashboard}
        className={`flex items-center justify-start w-full ${
          isSidebarOpen ? "px-3" : "px-1"
        } h-16 overflow-hidden`}
      >
        <CustomImage
          src={isSidebarOpen ? Images.appBanner : Images.appIcon}
          width={isSidebarOpen ? 150 : 40}
          height={30}
          alt={"app banner"}
          className={isSidebarOpen ? "min-w-36" : ""}
        />
      </Link>

      <nav className="flex flex-col items-start w-full">
        {navList.map((item, index) => (
          <NavItem
            key={index}
            item={item}
            pathname={pathname}
            isSidebarOpen={isSidebarOpen}
            onClose={onClose}
          />
        ))}
      </nav>
      <div className="grow flex items-end w-full py-3">
        <LogoutButton className={"w-full"} isSidebarOpen={isSidebarOpen} />
      </div>
    </aside>
  );
};

export default Sidebar;
