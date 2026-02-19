/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Submenu from "./Submenu";
import type { MenuItem } from "@/@types/menu";
import { type AvailableIcon, isIconAvailable } from "@/config/icon";

const Navmenu: React.FC<{ menus: MenuItem[] }> = ({ menus }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);

  const location = useLocation();
  const locationName = location.pathname.replace("/", "");

  const toggleSubmenu = (i: number) => {
    setActiveSubmenu((prev) => (prev === i ? null : i));
  };

  const toggleMultiMenu = (j: number) => {
    setMultiMenu((prev) => (prev === j ? null : j));
  };

  const normalizePath = (path: string) => {
    if (!path || path === "/#") return "";
    return path.startsWith("/") ? path.slice(1) : path;
  };

  const isLocationMatch = (targetLocation: string) => {
    const currentPath = normalizePath(location.pathname);
    const targetPath = normalizePath(targetLocation);
    if (!targetPath) return false;
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  const filteredMenus = useMemo(() => {
    return menus.map((item) => {
      if (!item.child) return item;
      return { ...item, child: item.child || [] };
    });
  }, [menus]);

  useEffect(() => {
    document.title = `ArrowX | ${locationName}`;
  }, [location]);

  return (
    <ul>
      <AnimatePresence mode="popLayout">
        {filteredMenus.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto", transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" } }}
            exit={{ opacity: 0, x: -20, height: 0, transition: { duration: 0.2 } }}
            layout
            className={`single-sidebar-menu ${item.child ? "item-has-children" : ""} ${activeSubmenu === i ? "open" : ""} ${
              isLocationMatch(item.link || "") ? "menu-item-active" : ""
            }`}
          >
            {!item.child && !item.isHeadr && (
              <NavLink className="menu-link" to={item.link || ""}>
                <span className="menu-icon grow-0">
                  <Icon icon={(item.icon && isIconAvailable(item.icon) ? item.icon : "heroicons-outline:home") as AvailableIcon} />
                </span>
                <div className="text-box grow">{item.title}</div>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </NavLink>
            )}

            {item.isHeadr && !item.child && (
              <div className="menulabel">{item.title}</div>
            )}

            {item.child && (
              <div
                className={`menu-link ${activeSubmenu === i ? "parent_active not-collapsed" : "collapsed"}`}
                onClick={() => toggleSubmenu(i)}
              >
                <div className="flex-1 flex items-start">
                  <span className="menu-icon">
                    <Icon icon={(item.icon && isIconAvailable(item.icon) ? item.icon : "heroicons-outline:home") as AvailableIcon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-0">
                  <div className={`menu-arrow transform transition-all duration-300 ${activeSubmenu === i ? "rotate-90" : ""}`}>
                    <Icon icon="heroicons-outline:chevron-right" />
                  </div>
                </div>
              </div>
            )}

            <Submenu
              activeSubmenu={activeSubmenu}
              item={item}
              i={i}
              toggleMultiMenu={toggleMultiMenu}
              activeMultiMenu={activeMultiMenu}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default Navmenu;