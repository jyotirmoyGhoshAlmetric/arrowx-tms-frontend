import React, { memo } from "react";
import { Tab as HeadlessTab, TabGroup, TabList } from "@headlessui/react";
import Icon from "./Icon";
import { type AvailableIcon, isIconAvailable } from "@/config/icon";

export interface TabItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  tabListClassName?: string;
  fullWidth?: boolean;
}

const Tabs: React.FC<TabsProps> = memo(
  ({
    tabs,
    activeTab,
    onChange,
    size = "md",
    className = "",
    tabListClassName = "",
    fullWidth = false,
  }) => {
    const selectedIndex = activeTab
      ? tabs.findIndex((tab) => tab.value === activeTab)
      : 0;

    const handleChange = (index: number) => {
      if (onChange && tabs[index]) {
        onChange(tabs[index].value);
      }
    };

    // Size variants
    const sizeClasses = {
      sm: "py-2 px-4 text-xs gap-1.5",
      md: "py-2.5 px-5 text-sm gap-2",
      lg: "py-3 px-6 text-base gap-2.5",
    };

    const iconSizes = {
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const badgeSizes = {
      sm: "min-w-[18px] h-[18px] px-1.5 text-xs",
      md: "min-w-[20px] h-[20px] px-2 text-xs",
      lg: "min-w-[22px] h-[22px] px-2.5 text-sm",
    };

    const TabContent = memo(
      ({ tab, selected }: { tab: TabItem; selected: boolean }) => (
        <div
          className={`flex items-center justify-center relative z-10 ${sizeClasses[size]}`}
        >
          {tab.icon && (
            <Icon
              icon={
                (tab.icon && isIconAvailable(tab.icon)
                  ? tab.icon
                  : "heroicons:list-bullet") as AvailableIcon
              }
              className={`${iconSizes[size]} ${selected ? "text-slate-900 dark:text-slate-100" : ""}`}
            />
          )}

          <span
            className={`whitespace-nowrap ${selected ? "font-semibold" : ""}`}
          >
            {tab.label}
          </span>

          {tab.badge !== undefined &&
            tab.badge !== null &&
            tab.badge !== "" && (
              <span
                className={`
            inline-flex items-center justify-center rounded-full font-semibold
            ${badgeSizes[size]}
            ${
              selected
                ? "bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm"
                : "bg-slate-100 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300"
            }
          `}
              >
                {tab.badge}
              </span>
            )}
        </div>
      ),
    );

    TabContent.displayName = "TabContent";

    return (
      <div className={className}>
        <TabGroup selectedIndex={selectedIndex} onChange={handleChange}>
          <TabList
            className={`
            relative flex p-1 px-2 rounded-full bg-slate-100/80 backdrop-blur-sm 
            dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50
            shadow-sm
            ${fullWidth ? "w-full justify-between" : "inline-flex"} 
            ${tabListClassName}
          `}
          >
            {tabs.map((tab) => (
              <HeadlessTab
                key={tab.value}
                disabled={tab.disabled}
                className={({ selected }) => `
                relative focus:outline-none focus:ring-0 focus:ring-offset-0
                rounded-full transition-colors duration-200 ease-out
                ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                ${selected ? "bg-white dark:bg-slate-700 shadow-md" : ""}
                ${
                  selected
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }
                ${fullWidth ? "" : "flex-shrink-0"}
              `}
              >
                {({ selected }) => <TabContent tab={tab} selected={selected} />}
              </HeadlessTab>
            ))}
          </TabList>
        </TabGroup>
      </div>
    );
  },
);

Tabs.displayName = "Tabs";

export default Tabs;
