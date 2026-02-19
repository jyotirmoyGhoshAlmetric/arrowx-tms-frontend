import React from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * Simple ProtectedRoute that checks authentication only
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = "/",
}) => {
  // 🔐 Manually control authentication here
  const isAuthenticated = true; // change to false to test redirect

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
