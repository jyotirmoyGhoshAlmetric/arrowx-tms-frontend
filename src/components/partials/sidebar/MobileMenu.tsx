import React, { useRef, useEffect, useState } from "react";
import Navmenu from "./Navmenu";
import { getMenuItemsByViewMode } from "@/constants/menuConfig";
import SimpleBar from "simplebar-react";
import useDarkMode from "@/hooks/useDarkMode";
import useMobileMenu from "@/hooks/useMobileMenu";
import { Link } from "react-router";
import Icon from "@/components/ui/Icon";
import MobileLogo from "@/assets/images/logo/logo-dark.svg";
import MobileLogoWhite from "@/assets/images/logo/logo-white.svg";

type MobileMenuProps = { className?: string };

const MobileMenu: React.FC<MobileMenuProps> = ({ className = "custom-class" }) => {
  const scrollableNodeRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(false);
  const menuItems = getMenuItemsByViewMode("fleet");
  const [isDark] = useDarkMode();
  const [, setMobileMenu] = useMobileMenu();

  useEffect(() => {
    const node = scrollableNodeRef.current;
    if (!node) return;
    const handleScroll = () => setScroll(node.scrollTop > 0);
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${className} fixed top-0 bg-white dark:bg-slate-800 shadow-lg h-full w-62`}>
      <div className="logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-9 h-21.25 px-4">
        <Link to="/dashboard">
          <div className="flex items-center justify-center">
            <div className="logo-icon">
              {!isDark ? (
                <img src={MobileLogo} alt="Logo" className="h-10 w-auto" />
              ) : (
                <img src={MobileLogoWhite} alt="Logo" className="h-10 w-auto" />
              )}
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenu(false)}
          className="cursor-pointer text-slate-900 dark:text-white text-2xl"
        >
          <Icon icon="heroicons:x-mark" />
        </button>
      </div>

      <div
        className={`h-15 absolute top-20 nav-shadow z-1 w-full transition-all duration-200 pointer-events-none ${
          scroll ? "opacity-100" : "opacity-0"
        }`}
      />
      <SimpleBar
        className="sidebar-menu px-4 h-[calc(100%-80px)]"
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        <Navmenu menus={menuItems} />
      </SimpleBar>
    </div>
  );
};

export default MobileMenu;