/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, NavLink, useParams } from "react-router";
import { getMenuItemsByViewMode } from "@/constant/menuConfig";
import { useGetHosDetailsQuery } from "@/store/slices/hos/hosApi";
import { useGetVehicleByIdQuery } from "@/store/slices/vehicles/vehicleApi";
import Icon from "@/components/ui/Icon";
import routes from "@/config/routes.json";
import { useAppSelector } from "@/store";
import { selectViewMode } from "@/store/slices/auth/authSlice";

interface RouteConfig {
  path: string;
  component: string;
  permissions: string[];
  layout?: string;
  breadcrumbLabel?: string;
  parentPath?: string;
  exact?: boolean;
  auth?: boolean;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname.replace(/^\//, "");
  const viewMode = useAppSelector(selectViewMode);
  const menuItems = getMenuItemsByViewMode(viewMode);

  const [isHide, setIsHide] = useState<boolean | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  // Get driver name for HOS logbook details
  const isLogbookDetails = currentPath.includes("hos/logbook/") && params.id;
  const { data: hosDetails } = useGetHosDetailsQuery(
    {
      driverId: params.id as string,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      skip: !isLogbookDetails,
    },
  );

  const driverName = useMemo(() => {
    if (hosDetails?.assignedLogs && hosDetails.assignedLogs.length > 0) {
      return hosDetails.assignedLogs[0]?.assignedLogs?.driver?.name || "Driver";
    }
    return "Driver";
  }, [hosDetails]);

  // Get vehicle details for vehicle pages
  const isVehicleDetails =
    currentPath.includes("assets/vehicles/") && params.id;
  const { data: vehicleDetails } = useGetVehicleByIdQuery(params.id as string, {
    skip: !isVehicleDetails,
  });

  const vehicleNumber = useMemo(() => {
    if (vehicleDetails?.data?.vehicleNumber) {
      return vehicleDetails.data.vehicleNumber;
    }
    return "Vehicle";
  }, [vehicleDetails]);

  const findRouteConfig = (path: string): RouteConfig | undefined => {
    return routes.routes.find((route: any) => {
      if (route.path.includes(":")) {
        const routePattern = route.path.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
      }
      return route.path === path;
    }) as RouteConfig | undefined;
  };

  const buildBreadcrumbs = (currentPath: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      path: "/dashboard",
      isActive: false,
    });

    // Find current route config
    const currentRoute = findRouteConfig(currentPath);

    if (!currentRoute) {
      // Fallback for routes not in config
      const segments = currentPath.split("/").filter(Boolean);
      segments.forEach((segment, index) => {
        const isLast = index === segments.length - 1;
        breadcrumbs.push({
          label: segment.replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"),
          path: isLast
            ? undefined
            : `/${segments.slice(0, index + 1).join("/")}`,
          isActive: isLast,
        });
      });
      return breadcrumbs;
    }

    // Handle parent path if exists
    if (currentRoute.parentPath) {
      const parentRoute = findRouteConfig(currentRoute.parentPath);
      if (parentRoute?.breadcrumbLabel) {
        breadcrumbs.push({
          label: parentRoute.breadcrumbLabel,
          path: `/${currentRoute.parentPath}`,
          isActive: false,
        });
      }
    }

    // Add current route
    let currentLabel =
      currentRoute.breadcrumbLabel || currentPath.split("/").pop() || "";

    // Handle dynamic content
    if (currentPath.includes("hos/logbook/") && params.id) {
      currentLabel = `${currentLabel} - ${driverName}`;
    } else if (currentPath.includes("assets/vehicles/") && params.id) {
      currentLabel = `${currentLabel} - ${vehicleNumber}`;
    }

    breadcrumbs.push({
      label: currentLabel,
      path: undefined,
      isActive: true,
    });

    return breadcrumbs;
  };

  useEffect(() => {
    // Check if breadcrumbs should be hidden
    const currentMenuItem = menuItems.find(
      (item) => item.link === `/${currentPath}`,
    );

    const currentChild = menuItems.find((item) =>
      item.child?.find((child) => child.childlink === `/${currentPath}`),
    );

    if (currentMenuItem) {
      setIsHide(currentMenuItem.isHide || false);
    } else if (currentChild) {
      setIsHide(currentChild?.isHide || false);
    } else {
      setIsHide(false);
    }

    // Build breadcrumbs
    const breadcrumbs = buildBreadcrumbs(currentPath);
    setBreadcrumbItems(breadcrumbs);
  }, [currentPath, driverName, vehicleNumber, params.id, menuItems]);

  if (isHide) {
    return null;
  }

  return (
    <div className="md:mb-8 mb-6">
      <nav aria-label="Breadcrumb">
        <ol className="elegant-breadcrumbs">
          {breadcrumbItems.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${item.isActive ? "current" : ""}`}
              {...(item.isActive && { "aria-current": "page" })}
            >
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={`breadcrumb-link ${index === 0 ? "home-link" : ""}`}
                  {...(index === 0 && { "aria-label": "Home" })}
                >
                  {index === 0 && (
                    <Icon icon="heroicons-outline:home" className="w-4 h-4" />
                  )}
                  {index === 0 && <span className="sr-only">Home</span>}
                  {index > 0 && item.label}
                </NavLink>
              ) : (
                <span
                  className={`breadcrumb-text ${item.isActive ? "current-page" : ""}`}
                >
                  {item.label}
                </span>
              )}
              {!item.isActive && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
