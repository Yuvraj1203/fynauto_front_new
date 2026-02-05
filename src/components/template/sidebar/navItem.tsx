import { Text, TextVariant } from "@/components/common";
import { useWindowWidth } from "@/hooks";
import { ReactIcons } from "@/public";
import { useSidebarStore } from "@/store/zustandStore";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

type NavItemProps = {
  label?: string;
  icon?: ReactNode;
  href?: string;
};

type NestedNavItemProps = NavItemProps & {
  subItem?: NavItemProps[];
};

type RenderNavItemProps = {
  item: NestedNavItemProps;
  pathname: string;
  isSidebarOpen?: boolean;
  displayIcon?: boolean;
  onClose?: () => void;
};

const NavItem = ({
  item,
  pathname,
  isSidebarOpen,
  onClose,
  displayIcon = true,
}: RenderNavItemProps) => {
  const isActive = pathname === item.href;
  const { isMobile } = useWindowWidth();
  const isSubActive =
    item.subItem?.some((sub) => sub.href === pathname) ||
    (item.href && pathname.includes(item.href)); //checking if url is of subitem

  const sidebarState = useSidebarStore((state) => state.sidebarState); //only used for desktop toggle

  /* used for showing sub items */
  const [showSubItem, setShowSubItem] = useState(
    isMobile ? isSubActive : false,
  );

  useEffect(() => {
    if (!sidebarState) {
      setShowSubItem(false); //closing the subitem on toggling the sidebar when false
    } else if (isSubActive) {
      setShowSubItem(true); //on toggle on showing the subitem if isSubActive true
    }
  }, [sidebarState]);

  return (
    <div className="relative w-full">
      <Link
        onClick={() => {
          if (item.subItem?.length! > 0) {
            setShowSubItem((prev) => !prev);
          }
          if (item.href !== undefined) {
            onClose?.();
          }
        }}
        onMouseEnter={() => {
          if (!isSidebarOpen) {
            setShowSubItem(true);
          }
        }}
        onMouseLeave={() => {
          if (!isSidebarOpen) {
            setShowSubItem(false);
          }
        }}
        href={item.href ? item.href : "#"}
        className={` ${
          isActive
            ? "bg-primary-50 text-primary"
            : isSubActive
              ? "bg-primary-50 text-primary"
              : "text-on-surface hover:text-on-default-100 hover:bg-default-100"
        } flex items-center justify-start mt-1.5 gap-2.5 w-full p-3 font-semibold rounded-medium duration-250`}
      >
        {displayIcon && item.icon}
        {isSidebarOpen && (
          <>
            <Text
              as="span"
              variant={TextVariant.bodySm}
              className={`grow font-semibold duration-250 overflow-hidden text-nowrap`}
            >
              {item.label}
            </Text>
            {item.subItem?.at(0)?.label && (
              <ReactIcons.ArrowDown
                size={16}
                className={`${
                  showSubItem ? "rotate-180" : "rotate-0"
                } mt-0.5 duration-250`}
              />
            )}
          </>
        )}
      </Link>

      {isSidebarOpen && item.subItem?.length! > 0 && (
        <div
          className={`w-full grid ${
            showSubItem ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }  duration-250`}
        >
          <div className="overflow-hidden flex flex-col gap-1">
            {item.subItem?.map((subItem, subItemIndex) => (
              <NavItem
                key={subItemIndex}
                item={subItem}
                pathname={pathname}
                isSidebarOpen={isSidebarOpen}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      )}
      {!isSidebarOpen && item.subItem?.length! > 0 && (
        <div
          onClick={() => !isSidebarOpen && setShowSubItem(false)}
          onMouseEnter={() => {
            if (!isSidebarOpen) {
              setShowSubItem(true);
            }
          }}
          onMouseLeave={() => {
            if (!isSidebarOpen) {
              setShowSubItem(false);
            }
          }}
          className={`absolute ${
            showSubItem ? "block top-0" : "hidden -top-full"
          } left-full bg-surface rounded-medium z-20 p-2 min-w-40 flex flex-col gap-1 shadow-lg duration-300 overflow-hidden`}
        >
          {item.subItem?.map((subItem, subItemIndex) => (
            <NavItem
              key={subItemIndex}
              item={subItem}
              pathname={pathname}
              isSidebarOpen={true}
              displayIcon={false}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default NavItem;
