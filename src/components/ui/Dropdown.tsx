import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Fragment, type ReactNode } from "react";
import { NavLink } from "react-router";
import Icon from "@/components/ui/Icon";
import { type AvailableIcon, isIconAvailable } from "@/config/icon";

// Types for dropdown menu items
export interface DropdownItem {
  label: string;
  link?: string;
  icon?: string;
  hasDivider?: boolean;
  onClick?: () => void;
}

// Anchor position type
type AnchorPosition =
  | "bottom start"
  | "bottom end"
  | "top start"
  | "top end"
  | "left start"
  | "left end"
  | "right start"
  | "right end";

// Props interface for the Dropdown component
interface DropdownProps {
  label: ReactNode;
  wrapperClass?: string;
  labelClass?: string;
  children?: ReactNode;
  anchor?: AnchorPosition;
  classMenuItems?: string;
  items?: DropdownItem[];
  classItem?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  wrapperClass = "inline-block",
  labelClass = "",
  children,
  classMenuItems = "mt-2 w-[200px]",
  items = [
    { label: "Action", link: "#" },
    { label: "Another action", link: "#" },
    { label: "Something else here", link: "#" },
  ],
  classItem = "px-4 py-2",
}) => {
  const handleOpenDropdown = (): void => {
    if (typeof window !== "undefined") {
      document.documentElement.style.paddingRight = "0px";
    }
  };

  const handleItemClick = (item: DropdownItem): void => {
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className={`relative ${wrapperClass}`}>
      <Menu>
        <MenuButton
          className={`block w-full ${labelClass}`}
          onClick={handleOpenDropdown}
        >
          {label}
        </MenuButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            className={`absolute ltr:right-0 rtl:left-0 origin-top-right border border-slate-100
            rounded bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm z-9999 focus-visible:outline-none
            ${classMenuItems}
            `}
          >
            <div>
              {children
                ? children
                : items.map((item: DropdownItem, index: number) => (
                    <MenuItem key={index}>
                      {({ focus }: { focus: boolean }) => (
                        <div
                          className={`${
                            focus
                              ? "bg-slate-100 text-slate-900 dark:bg-slate-600/50 dark:text-slate-300"
                              : "text-slate-600 dark:text-slate-300"
                          } block ${
                            item.hasDivider
                              ? "border-t border-slate-100 dark:border-slate-700"
                              : ""
                          }`}
                        >
                          {item.link ? (
                            <NavLink
                              to={item.link}
                              className={`block ${classItem}`}
                              onClick={() => handleItemClick(item)}
                            >
                              {item.icon ? (
                                <div className="flex items-center">
                                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                                    <Icon
                                      icon={
                                        (item.icon && isIconAvailable(item.icon)
                                          ? item.icon
                                          : "heroicons:star") as AvailableIcon
                                      }
                                    />
                                  </span>
                                  <span className="block text-sm">
                                    {item.label}
                                  </span>
                                </div>
                              ) : (
                                <span className="block text-sm">
                                  {item.label}
                                </span>
                              )}
                            </NavLink>
                          ) : (
                            <div
                              className={`block cursor-pointer ${classItem}`}
                              onClick={() => handleItemClick(item)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleItemClick(item);
                                }
                              }}
                            >
                              {item.icon ? (
                                <div className="flex items-center">
                                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                                    <Icon
                                      icon={
                                        (item.icon && isIconAvailable(item.icon)
                                          ? item.icon
                                          : "heroicons:star") as AvailableIcon
                                      }
                                    />
                                  </span>
                                  <span className="block text-sm">
                                    {item.label}
                                  </span>
                                </div>
                              ) : (
                                <span className="block text-sm">
                                  {item.label}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </MenuItem>
                  ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
