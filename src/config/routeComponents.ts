import { lazy } from "react";

// Lazy load all components
export const routeComponents = {
  // Auth components
  Login: lazy(() => import("../pages/auth/login")),
  Register: lazy(() => import("../pages/auth/register")), // Placeholder - create register page if needed
  ForgotPassword: lazy(() => import("../pages/auth/forgot-password")),
  ForceResetPassword: lazy(() => import("../pages/auth/force-reset-password")),

  // Main app components
  Dashboard: lazy(() => import("../pages/dashboard")),
 

  // Special
  Error: lazy(() => import("../pages/error/error")),
} as const;

export type ComponentName = keyof typeof routeComponents;
