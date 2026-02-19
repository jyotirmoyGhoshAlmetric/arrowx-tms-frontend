import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import { createRouteElement } from "./utils/CreateRouteElement";
import routesConfig from "./config/routes.json";
import { type RoutesConfig } from "./types/routes";

// Type assertion for the imported JSON
const { routes, authRoutes, specialRoutes } = routesConfig as RoutesConfig;

const App: React.FC = () => {
  return (
    <main className="App relative">
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          {authRoutes.map((route) => createRouteElement(route))}
        </Route>

        {/* Main App Routes */}
        <Route path="/*" element={<Layout />}>
          {routes.map((route) => createRouteElement(route))}
        </Route>

        {/* Special Routes (404, redirects, etc.) - Outside of Layout */}
        {specialRoutes.map((route) => createRouteElement(route))}

        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </main>
  );
};

export default App;
