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

  // fleet components
  Drivers: lazy(() => import("../pages/fleet/drivers")),
  Vehicles: lazy(() => import("../pages/fleet/vehicles")),
  Trailers: lazy(() => import("../pages/fleet/trailers")),
  Carriers: lazy(() => import("../pages/fleet/carriers")),
  DriverTeams: lazy(() => import("../pages/fleet/driver-teams")),
  FuelCardReport: lazy(() => import("../pages/fleet/fuel-card-report")),
  PartnerCarriers: lazy(() => import("../pages/fleet/partner-carriers")),

  // CRM components
  Contacts: lazy(() => import("../pages/crm/contacts")),

  // Special
  Error: lazy(() => import("../pages/error/error")),
} as const;

export type ComponentName = keyof typeof routeComponents;
