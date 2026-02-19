import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ThemeMode, getEffectiveDarkMode } from "@/utils/darkmode";

export interface LayoutState {
  themeMode: ThemeMode;
  effectiveDarkMode: boolean;
  isSidebarCollapsed: boolean;
  mobileMenu: boolean;
}

const initialThemeMode = (): ThemeMode => {
  const item = window.localStorage.getItem("themeMode");
  return item ? JSON.parse(item) : "auto";
};

const initialSidebarCollapsed = () => {
  const item = window.localStorage.getItem("sidebarCollapsed");
  return item ? JSON.parse(item) : false;
};

const initialTheme = initialThemeMode();
const initialState: LayoutState = {
  themeMode: initialTheme,
  effectiveDarkMode: getEffectiveDarkMode(initialTheme),
  isSidebarCollapsed: initialSidebarCollapsed(),
  mobileMenu: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    // handle theme mode (light, dark, auto)
    setThemeMode: (state: LayoutState, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      state.effectiveDarkMode = getEffectiveDarkMode(action.payload);
      window.localStorage.setItem("themeMode", JSON.stringify(action.payload));
    },
    // handle system theme change (when in auto mode)
    updateSystemTheme: (state: LayoutState, action: PayloadAction<boolean>) => {
      if (state.themeMode === "auto") {
        state.effectiveDarkMode = action.payload;
      }
    },
    // legacy support for boolean dark mode (for backward compatibility)
    handleDarkMode: (state: LayoutState, action: PayloadAction<boolean>) => {
      const newMode: ThemeMode = action.payload ? "dark" : "light";
      state.themeMode = newMode;
      state.effectiveDarkMode = action.payload;
      window.localStorage.setItem("themeMode", JSON.stringify(newMode));
    },
    // handle sidebar collapsed
    handleSidebarCollapsed: (
      state: LayoutState,
      action: PayloadAction<boolean>,
    ) => {
      state.isSidebarCollapsed = action.payload;
      window.localStorage.setItem(
        "sidebarCollapsed",
        JSON.stringify(action.payload),
      );
    },
    // handle mobile menu
    handleMobileMenu: (state: LayoutState, action: PayloadAction<boolean>) => {
      state.mobileMenu = action.payload;
      window.localStorage.setItem("mobileMenu", JSON.stringify(action.payload));
    },
  },
});

export const {
  setThemeMode,
  updateSystemTheme,
  handleDarkMode,
  handleSidebarCollapsed,
  handleMobileMenu,
} = layoutSlice.actions;

export default layoutSlice.reducer;