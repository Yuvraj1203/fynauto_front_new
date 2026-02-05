"use client";
import { Timeline } from "@/components/common";
import { CustomDrawer } from "@/components/custom";
import { DrawerPlacement } from "@/components/custom/customDrawer/customDrawer";
import { useWindowWidth } from "@/hooks";
import { ReactIcons } from "@/public";
import { useSidebarStore } from "@/store/zustandStore";
import { usePathname } from "next/navigation";
import Sidebar from "../sidebar/sidebar";

const header = () => {
  const pathname = usePathname();
  const isTenantDashboard = /^\/dashboard\/[^/]+$/.test(pathname);

  const { isMobile } = useWindowWidth(); //get the width
  const setSidebarState = useSidebarStore((state) => state.setSidebarSate); // state for toggling sidebar

  //trigger for collapsable sidebar desktop
  const Trigger = () => {
    return (
      <span
        onClick={isMobile ? undefined : setSidebarState}
        className="hover:bg-background p-2 rounded-full duration-250 "
      >
        <ReactIcons.Menu size={24} className="text-outline cursor-pointer" />
      </span>
    );
  };

  //trigger for drawer for mobile
  const DrawerTrigger = () => {
    return (
      <CustomDrawer
        className="w-64 p-0"
        headerStyle="py-2 px-0"
        bodyStyle="p-0"
        placement={DrawerPlacement.left}
        renderContent={(onClose) => (
          <>
            <Sidebar onClose={onClose} />
          </>
        )}
        trigger={Trigger()}
      />
    );
  };

  return (
    <header className="flex items-center justify-between h-16 p-4 bg-surface sticky top-0">
      <div className="flex w-full items-center gap-2.5">
        {isMobile ? <DrawerTrigger /> : <Trigger />}
        {isTenantDashboard && <Timeline />}
        {/* <span className="hover:bg-background p-2 rounded-full duration-250 ">
          <ReactIcons.Search
            size={24}
            className="text-outline cursor-pointer"
          />
        </span> */}
      </div>

      {/* <div className="flex gap-2.5">
        <span className="hover:bg-background p-2 rounded-full duration-250 ">
          <ReactIcons.Bell size={24} className="text-outline cursor-pointer" />
        </span>

        <Setting />
      </div> */}
    </header>
  );
};

export default header;
