import { type ComponentName } from "../config/routeComponents";

export interface RouteConfig {
  path: string;
  component?: ComponentName;
  permissions?: string[];
  layout: "main" | "auth" | "none";
  redirect?: string;
  breadcrumbLabel?: string;
  parentPath?: string;
  exact?: boolean;
  auth?: boolean;
  viewMode?: ("fleet" | "global")[];
  isProtected?: boolean
}

export interface RoutesConfig {
  routes: RouteConfig[];
  authRoutes: RouteConfig[];
  specialRoutes: RouteConfig[];
}
