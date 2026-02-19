import type { MenuItem } from "@/@types/menu";

// Fleet View Menu Items (company/terminal specific operations)
export const fleetMenuItems: MenuItem[] = [
  {
    isHeadr: true,
    title: "Fleet Operations",
  },
  {
    title: "Dashboard",
    icon: "material-symbols:dashboard-outline-rounded",
    link: "/dashboard",
    isHide: false,
    permissions: ["dashboard:view"],
    viewMode: ["fleet"],
  },
  {
    title: "Planning",
    icon: "material-symbols:dashboard-outline-rounded",
    link: "/planning",
    isHide: false,
    permissions: ["dashboard:view"],
    viewMode: ["fleet"],
  },
  {
    title: "Documents",
    icon: "material-symbols:dashboard-outline-rounded",
    link: "/documents",
    isHide: false,
    permissions: ["dashboard:view"],
    viewMode: ["fleet"],
  },

  {
    title: "Fleet",
    icon: "material-symbols-light:calendar-clock-outline",
    link: "/#",
    isHide: false,
    permissions: ["logbook:view", "driver_hos:view"],
    viewMode: ["fleet"],
    child: [
      {
        childtitle: "Carriers",
        childlink: "/fleet/carriers",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Driver teams",
        childlink: "/fleet/driver-teams",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Trailers",
        childlink: "/fleet/trailers",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Vehicles",
        childlink: "/fleet/vehicles",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Drivers",
        childlink: "/fleet/drivers",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Drivers Rate Cards",
        childlink: "/fleet/drivers-rate-cards",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Trailers Report",
        childlink: "/fleet/trailers-report",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Fuel Card Report",
        childlink: "/fleet/fuel-card-report",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      },
      {
        childtitle: "Partner Carriers",
        childlink: "/fleet/partner-carriers",
        permissions: ["logbook:view"],
        viewMode: ["fleet"],
      }
    ],
  },

  {
    title: "CRM",
    icon: "mdi:account-group-outline",
    link: "/#",
    isHide: false,
    permissions: [],
    viewMode: ["fleet", "global"],
    child: [
      { childtitle: "Contacts", childlink: "/crm/contacts", permissions: [], viewMode: ["fleet", "global"] },
      { childtitle: "Customers", childlink: "/crm/customers", permissions: [], viewMode: ["fleet", "global"] },
      { childtitle: "Locations", childlink: "/crm/locations", permissions: [], viewMode: ["fleet", "global"] },
      { childtitle: "Activities", childlink: "/crm/activities", permissions: [], viewMode: ["fleet", "global"] },
      { childtitle: "Opportunities", childlink: "/crm/opportunities", permissions: [], viewMode: ["fleet", "global"] },
    ],
  },

  // Agency Management
  {
    title: "Agency Management",
    icon: "mdi:account-multiple-outline",
    link: "/#",
    isHide: false,
    permissions: [],
    viewMode: ["fleet", "global"],
    child: [
      { childtitle: "Agencies", childlink: "/agency/agencies", permissions: [], viewMode: ["fleet", "global"] },
      { childtitle: "Agents/Reps", childlink: "/agency/agents-reps", permissions: [], viewMode: ["fleet", "global"] },
      { childtitle: "Agency/Agent Balances", childlink: "/agency/agent-balances", permissions: [], viewMode: ["fleet", "global"] },
    ],
  },

  
];

// Global View Menu Items (super admin operations)
export const globalMenuItems: MenuItem[] = [
  {
    isHeadr: true,
    title: "Global Administration",
  },
  {
    title: "Dashboard",
    icon: "material-symbols:dashboard-outline-rounded",
    link: "/global/dashboard",
    isHide: false,
    permissions: ["global:view"],
    viewMode: ["global"],
  },
  {
    title: "Company Management",
    icon: "ion:business-outline",
    link: "/#",
    isHide: false,
    permissions: ["company:view"],
    viewMode: ["global"],
    child: [
      {
        childtitle: "Companies",
        childlink: "/company",
        permissions: ["company:view"],
        viewMode: ["global"],
      },
      {
        childtitle: "Onboarding Requests",
        childlink: "/onboarding-requests",
        permissions: ["company:view"],
        viewMode: ["global"],
      },
    ],
  },
  {
    title: "Inventory Management",
    icon: "ic:baseline-device-hub",
    link: "/#",
    isHide: false,
    permissions: [
      "inventory.eld:view",
      "inventory.tracking:view",
      "inventory.sensor:view",
      "inventory.dashcam:view",
    ],
    viewMode: ["global"],
    child: [
      {
        childtitle: "ELD Devices",
        childlink: "/inventory/eld-devices",
        permissions: ["inventory.eld:view"],
        viewMode: ["global"],
      },
      {
        childtitle: "Prepare Device",
        childlink: "/inventory/printing-eld-label",
        permissions: ["inventory.eld:view"],
        viewMode: ["global"],
      },
      {
        childtitle: "Tracking Devices",
        childlink: "/inventory/tracking-devices",
        permissions: ["inventory.tracking:view"],
        viewMode: ["global"],
      },
      {
        childtitle: "Sensor Devices",
        childlink: "/inventory/sensor-devices",
        permissions: ["inventory.sensor:view"],
        viewMode: ["global"],
      },
      {
        childtitle: "Dashcam Devices",
        childlink: "/inventory/dashcam-devices",
        permissions: ["inventory.dashcam:view"],
        viewMode: ["global"],
      },
    ],
  },
  {
    title: "User Management",
    icon: "heroicons-outline:user-group",
    link: "/#",
    isHide: false,
    permissions: ["global:users:view", "global:roles:view"],
    viewMode: ["fleet", "global"],
    child: [
      {
        childtitle: "Users",
        childlink: "/users",
        permissions: ["global:users:view"],
        viewMode: ["fleet", "global"],
      },
      {
        childtitle: "Roles",
        childlink: "/roles",
        permissions: ["global:roles:view"],
        viewMode: ["fleet", "global"],
      },
    ],
  },
  // {
  //   title: "Super User Management",
  //   icon: "heroicons-outline:user-group",
  //   link: "/#",
  //   isHide: false,
  //   permissions: ["users:view", "user_roles:view"],
  //   viewMode: ["fleet", "global"],
  //   child: [
  //     {
  //       childtitle: "Super Users",
  //       childlink: "/super-users",
  //       permissions: ["users:view"],
  //       viewMode: [ "global"],
  //     },
  //     {
  //       childtitle: "Super Roles",
  //       childlink: "/super-roles",
  //       permissions: ["user_roles:view"],
  //       viewMode: [ "global"],
  //     },
  //   ],
  // },
  {
    title: "Messages",
    icon: "heroicons:chat-bubble-bottom-center-text",
    link: "/messages",
    isHide: false,
    permissions: ["messages:view"],
    viewMode: ["global"],
  },
  {
    title: "Configuration Management",
    icon: "heroicons:cog-6-tooth",
    link: "/#",
    isHide: false,
    permissions: ["global:configuration:view"],
    viewMode: ["global"],
    child: [
      {
        childtitle: "APP Configuration",
        childlink: "/configuration-management?configType=APP",
        permissions: ["global:configuration:view"],
        viewMode: ["global"],
      },
      {
        childtitle: "ELD Configuration",
        childlink: "/configuration-management?configType=ELD",
        permissions: ["global:configuration:view"],
        viewMode: ["global"],
      },
    ],
  },
  {
    title: "HOS Auto Status Schedule",
    icon: "heroicons:clock",
    link: "/hos/auto-status-schedule",
    isHide: false,
    permissions: ["dashboard:view"],
    viewMode: ["global"],
  },
  {
    title: "HOS Auto Status History",
    icon: "heroicons:clipboard-document",
    link: "/hos/auto-status-history",
    isHide: false,
    permissions: ["dashboard:view"],
    viewMode: ["global"],
  },
  {
    title: "ELD Log Viewer",
    icon: "mdi:math-log",
    link: "/hos/eld-log-viewer",
    isHide: false,
    permissions: ["global:eld-logs:view"],
    viewMode: ["global"],
  },
  {
    title: "ELD Diagnostics",
    icon: "mdi:file-eye-outline",
    link: "/eld-devices/diagnostics",
    isHide: false,
    permissions: ["global:eld-diagnostic:view"],
    viewMode: ["global"],
  },
  {
    title: "Mobile App Version",
    icon: "heroicons:device-phone-mobile",
    link: "/mobile-app-versions",
    isHide: false,
    permissions: ["global:eld-diagnostic:view"],
    viewMode: ["global"],
  },
];

// Function to get menu items based on view mode
export const getMenuItemsByViewMode = (
  viewMode: "fleet" | "global",
): MenuItem[] => {
  return viewMode === "fleet" ? fleetMenuItems : globalMenuItems;
};
