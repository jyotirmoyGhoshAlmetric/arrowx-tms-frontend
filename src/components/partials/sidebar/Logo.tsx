import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";

// import images
import MobileLogo from "@/assets/images/logo/logo-a.svg";
import MobileLogoWhite from "@/assets/images/logo/logo-a-white.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import LogoDark from "@/assets/images/logo/logo-dark.svg";

const SidebarLogo: React.FC<{ menuHover: boolean }> = ({ menuHover }) => {
  const viewMode = "fleet"
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  const logoNavigationPath = "/dashboard";
  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-9 py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${" border-none"}
      `}
    >
      <Link
        to={logoNavigationPath}
        className={`${collapsed ? "w-full" : "w-[80%]"}`}
      >
        <div className="flex items-center space-x-4">
          {collapsed && !menuHover && (
            <motion.div
              className="logo-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {!isDark ? (
                <img src={MobileLogo} className="w-full" alt="" />
              ) : (
                <img src={MobileLogoWhite} className="w-full" alt="" />
              )}
            </motion.div>
          )}

          {(!collapsed || menuHover) && (
            <motion.div
              className="logo-icon flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {!isDark ? (
                <img src={LogoDark} alt="" className="w-full" />
              ) : (
                <img src={LogoWhite} alt="" className="w-full" />
              )}
            </motion.div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <motion.div
          onClick={() => setMenuCollapsed(!collapsed)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`h-4 w-4 border-[1.5px] border-slate-900 dark:border-slate-700 rounded-full transition-all duration-150 cursor-pointer
          ${
            collapsed
              ? ""
              : "ring-2 ring-inset ring-offset-4 ring-black-900 dark:ring-slate-400 bg-slate-900 dark:bg-slate-400 dark:ring-offset-slate-700"
          }
          `}
        ></motion.div>
      )}
    </div>
  );
};

export default SidebarLogo;
