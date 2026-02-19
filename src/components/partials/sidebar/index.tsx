import React, { useRef, useEffect, useState, useMemo } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import { getMenuItemsByViewMode } from "@/constants/menuConfig";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";

const Sidebar: React.FC = () => {
  const scrollableNodeRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState(false);
  const [collapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);

  const menuItems = useMemo(() => getMenuItemsByViewMode("fleet"), []);

  useEffect(() => {
    const node = scrollableNodeRef.current;
    if (!node) return;
    const handleScroll = () => setScroll(node.scrollTop > 0);
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800 ${
          collapsed ? "w-18 close_sidebar" : "w-62"
        } ${menuHover ? "sidebar-hovered" : ""} shadow-base`}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
      >
        <SidebarLogo menuHover={menuHover} />
        <div
          className={`h-15 absolute top-20 nav-shadow z-1 w-full transition-all duration-200 pointer-events-none ${
            scroll ? "opacity-100" : "opacity-0"
          }`}
        />
        <SimpleBar
          className="sidebar-menu px-4 h-[calc(100%-86px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={menuItems} />
        </SimpleBar>
      </div>
    </div>
  );
};

export default Sidebar;