import React from "react";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import type { ThemeMode } from "@/utils/darkmode";

const SwitchDark: React.FC = () => {
  const [isDark, , { themeMode, setThemeMode }] = useDarkMode();

  const cycleTheme = () => {
    const nextMode: ThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(nextMode);
  };

  const getIcon = () =>
    isDark ? "heroicons-outline:sun" : "heroicons-outline:moon";

  const getTooltip = () => `Current: ${themeMode} mode`;

  return (
    <span title={getTooltip()}>
      <div
        className="lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center transition-colors hover:opacity-80"
        onClick={cycleTheme}
      >
        <Icon icon={getIcon()} />
      </div>
    </span>
  );
};

export default SwitchDark;
