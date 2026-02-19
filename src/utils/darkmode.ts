/**
 * Utility functions for dark mode detection and management
 */

export type ThemeMode = "light" | "dark" | "auto";

/**
 * Checks if the user's system prefers dark mode
 */
export const getSystemDarkModePreference = (): boolean => {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

/**
 * Gets the effective dark mode state based on user preference and system setting
 */
export const getEffectiveDarkMode = (userMode: ThemeMode): boolean => {
  switch (userMode) {
    case "dark":
      return true;
    case "light":
      return false;
    case "auto":
    default:
      return getSystemDarkModePreference();
  }
};

/**
 * Listens for system theme changes and calls the callback when it changes
 */
export const watchSystemThemeChange = (
  callback: (isDark: boolean) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  // Add event listener
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }
};
