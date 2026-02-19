// Minimal type definitions
export interface MultiMenuItem {
  multiTitle: string;
  multiLink: string;
  badge?: string | number;
  badgeColor?: string;
  permissions?: string[];
}

export interface ChildMenuItem {
  childtitle: string;
  childlink?: string;
  multi_menu?: MultiMenuItem[];
  badge?: string | number;
  badgeColor?: string;
  permissions?: string[];
  viewMode?: ("fleet" | "global")[];
}

export interface MenuItem {
  isHeadr?: boolean;
  title: string;
  icon?: string;
  isOpen?: boolean;
  isHide?: boolean;
  child?: ChildMenuItem[];
  link?: string;
  badge?: string | number;
  badgeColor?: string;
  permissions?: string[];
  viewMode?: ("fleet" | "global")[];
}
