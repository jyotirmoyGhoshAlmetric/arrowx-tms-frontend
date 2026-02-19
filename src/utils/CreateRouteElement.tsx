import React, { Suspense } from "react";
import { Route, Navigate } from "react-router";
import { type RouteConfig } from "../types/routes";
import { routeComponents } from "../config/routeComponents";
import ProtectedRoute from "../components/ProtectedRoutes";
import Loading from "../components/Loading";

/**
 * Creates individual route elements based on configuration
 */
export const createRouteElement = (
  route: RouteConfig,
): React.ReactElement | null => {
  // Handle redirect routes
  if (route.redirect) {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={<Navigate to={route.redirect} replace />}
      />
    );
  }

  // Get component
  if (!route.component) {
    console.warn(`No component specified for route: ${route.path}`);
    return null;
  }

  const Component = routeComponents[route.component];

  if (!Component) {
    console.error(
      `Component ${route.component} not found for route: ${route.path}`,
    );
    return null;
  }

  const WrappedComponent = (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );

  // ✅ Protect only if route.isProtected is true
  if (route.isProtected) {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={<ProtectedRoute>{WrappedComponent}</ProtectedRoute>}
      />
    );
  }

  return (
    <Route key={route.path} path={route.path} element={WrappedComponent} />
  );
};
