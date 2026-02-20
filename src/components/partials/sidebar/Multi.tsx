import Badge from "@/components/ui/Badge";
import React from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router"; // ✅ Fixed import

// Proper type definitions for menu items
interface MultiMenuItem {
  multiTitle: string;
  multiLink: string;
  badge?: string;
  disabled?: boolean;
  icon?: string;
}

interface SubMenuItem {
  multi_menu: MultiMenuItem[];
  title?: string;
  disabled?: boolean;
}

interface LockLinkProps {
  to: string;
  children: React.ReactNode;
  item: MultiMenuItem;
  disabled?: boolean;
}

interface MultilevelProps {
  activeMultiMenu: number | null;
  j: number;
  subItem: SubMenuItem;
}

const LockLink: React.FC<LockLinkProps> = ({ to, item, disabled = false }) => {
  const { multiTitle, badge } = item;

  // Check if item should be disabled (has badge or explicitly disabled)
  const isDisabled = disabled || item.disabled || !!badge;

  if (isDisabled) {
    return (
      <span
        className="text-slate-600 dark:text-slate-300 opacity-50 cursor-not-allowed text-sm flex space-x-3 rtl:space-x-reverse items-center"
        title={badge ? `Feature locked: ${badge}` : "This feature is disabled"}
      >
        <span className="h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none"></span>
        <span className="flex-1 flex space-x-2 rtl:space-x-reverse truncate">
          <span className="grow truncate">{multiTitle}</span>
          {badge && (
            <span className="grow-0">
              <Badge className="bg-slate-900 px-2 py-0.75 font-normal text-xs rounded-full text-slate-100 capitalize">
                {badge}
              </Badge>
            </span>
          )}
        </span>
      </span>
    );
  }

  // Render as active NavLink
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm flex space-x-3 rtl:space-x-reverse items-center transition-all duration-150 ${
          isActive
            ? "text-black dark:text-white font-medium"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none transition-all duration-150 ${
              isActive
                ? "bg-slate-900 dark:bg-slate-300 ring-4 ring-slate-500/20 dark:ring-slate-300/20"
                : ""
            }`}
          ></span>
          <span className="flex-1 truncate">{multiTitle}</span>
        </>
      )}
    </NavLink>
  );
};

const Multilevel: React.FC<MultilevelProps> = ({
  activeMultiMenu,
  j,
  subItem,
}) => {
  if (!subItem?.multi_menu || !Array.isArray(subItem.multi_menu)) {
    return null;
  }

  return (
    <Collapse isOpened={activeMultiMenu === j}>
      <ul className="space-y-3.5 pl-4">
        {subItem.multi_menu.map((item: MultiMenuItem, i: number) => (
          <li key={i} className="first:pt-3.5">
            <LockLink to={item.multiLink} item={item} disabled={item.disabled}>
              {item.multiTitle}
            </LockLink>
          </li>
        ))}
      </ul>
    </Collapse>
  );
};

export default Multilevel;

// Export types for use in other components
export type { MultiMenuItem, SubMenuItem, MultilevelProps };
