import { useEffect, useState, useCallback } from "react";
import { watchSystemThemeChange, type ThemeMode } from "@/utils/darkmode";

type UseDarkModeReturn = [
  boolean, // isDark
  (mode: boolean) => void, // toggle dark mode
  {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
  },
];

const useDarkmode = (): UseDarkModeReturn => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialize based on system preference
    if (themeMode === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return themeMode === "dark";
  });

  // Toggle dark mode manually
  const setDarkMode = useCallback((mode: boolean) => {
    setIsDark(mode);
    if (mode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, []);

  // Update dark mode whenever themeMode changes
  useEffect(() => {
    if (themeMode === "auto") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(systemPrefersDark);
    } else {
      setDarkMode(themeMode === "dark");
    }
  }, [themeMode, setDarkMode]);

  // Watch system theme changes when in auto mode
  useEffect(() => {
    if (themeMode !== "auto") return;

    const cleanup = watchSystemThemeChange((systemIsDark: boolean) => {
      setDarkMode(systemIsDark);
    });

    return cleanup;
  }, [themeMode, setDarkMode]);

  return [isDark, setDarkMode, { themeMode, setThemeMode }];
};

export default useDarkmode;
