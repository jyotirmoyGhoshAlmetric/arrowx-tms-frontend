import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import SwitchDark from "./Tools/SwitchDark";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import Logo from "./Tools/Logo";
import Profile from "./Tools/Profile";
import useMobileMenu from "@/hooks/useMobileMenu";
// import SelectCompany from "./Tools/SelectCompany";
// import SelectTerminal from "./Tools/SelectTerminal";
// import ViewModeToggle from "./Tools/ViewModeToggle";

const Header: React.FC<{ className?: string }> = ({
  className = "custom-class",
}) => {
  const [collapsed, setMenuCollapsed] = useSidebar();
  const { width, breakpoints } = useWidth();
  const viewMode = "fleet";

  const navbarTypeClass = () => {
    return "sticky top-0 z-999";
  };

  const [mobileMenu, setMobileMenu] = useMobileMenu();

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const borderSwicthClass = () => {
    return "dark:border-slate-700/60";
  };

  // Check if user is Super Admin
  const showFleetGlobalToggle = true

  // Show company/terminal dropdowns only in fleet view
  const showCompanyTerminalDropdowns = viewMode === "fleet";

  // Mobile Layout (< 768px): Exactly 3 rows with Fleet in top row
  if (width < breakpoints.md) {
    return (
      <header className={className + " " + navbarTypeClass()}>
        <div
          className={`app-header dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white ${borderSwicthClass()}`}
        >
          {/* Row 1: Hamburger + Logo + Fleet Toggle + Icons */}
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center space-x-3">
              <button
                className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                onClick={handleOpenMobileMenu}
              >
                <Icon icon="heroicons-outline:menu-alt-3" />
              </button>
              <Logo />
            </div>
            <div className="flex items-center space-x-2">
              {showFleetGlobalToggle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {/* <ViewModeToggle /> */}
                </motion.div>
              )}
              {/* <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Language />
              </motion.div> */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <SwitchDark />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Profile />
              </motion.div>
            </div>
          </div>

          {/* Row 2: Company Dropdown (if in fleet view) */}
          {showCompanyTerminalDropdowns && (
            <div className="px-4 py-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="w-full"
              >
                {/* <SelectCompany /> */}
              </motion.div>
            </div>
          )}

          {/* Row 3: Terminal Dropdown (if in fleet view) */}
          {showCompanyTerminalDropdowns && (
            <div className="px-4 py-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="w-full"
              >
                {/* <SelectTerminal /> */}
              </motion.div>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Tablet Layout (768px - 1024px): 2 rows with proper alignment
  if (width < 1024) {
    return (
      <header className={className + " " + navbarTypeClass()}>
        <div
          className={`app-header dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white ${borderSwicthClass()}`}
        >
          {/* Row 1: Hamburger + Logo + Icons + Super Admin Toggle */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center space-x-4">
              <button
                className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                onClick={handleOpenMobileMenu}
              >
                <Icon icon="heroicons-outline:menu-alt-3" />
              </button>
              <Logo />
            </div>

            <div className="flex items-center space-x-4">
              {showFleetGlobalToggle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {/* <ViewModeToggle /> */}
                </motion.div>
              )}

              {/* <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Language />
              </motion.div> */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <SwitchDark />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Profile />
              </motion.div>
            </div>
          </div>

          {/* Row 2: Company and Terminal Dropdowns (if in fleet view) */}
          {showCompanyTerminalDropdowns && (
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  {/* <SelectCompany /> */}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  {/* <SelectTerminal /> */}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }

  // 1024px Layout: Single row with hamburger on left
  if (width < breakpoints.xl) {
    return (
      <header className={className + " " + navbarTypeClass()}>
        <div
          className={`app-header md:px-6 px-3.75 dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white
          ${borderSwicthClass()}
               md:py-6 py-3
          `}
        >
          <div className="flex justify-between items-center h-full">
            {/* Left Section */}
            <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
              <button
                className="cursor-pointer text-slate-900 dark:text-white text-2xl mr-4"
                onClick={handleOpenMobileMenu}
              >
                <Icon icon="heroicons-outline:menu-alt-3" />
              </button>
              <Logo />
            </div>

            {/* Right Section - Nav Tools */}
            <div className="nav-tools flex items-center lg:space-x-3 space-x-2 rtl:space-x-reverse">
              {/* Company and Terminal Dropdowns - only show in fleet view */}
              {showCompanyTerminalDropdowns && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: showFleetGlobalToggle ? 0.2 : 0.1,
                    }}
                  >
                    {/* <SelectCompany /> */}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: showFleetGlobalToggle ? 0.3 : 0.2,
                    }}
                  >
                    {/* <SelectTerminal /> */}
                  </motion.div>
                </>
              )}
              {/* Super Admin View Mode Toggle */}
              {showFleetGlobalToggle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {/* <ViewModeToggle /> */}
                </motion.div>
              )}

              {/* <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: showFleetGlobalToggle
                    ? showCompanyTerminalDropdowns
                      ? 0.4
                      : 0.2
                    : 0.3,
                }}
              >
                <Language />
              </motion.div> */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: showFleetGlobalToggle
                    ? showCompanyTerminalDropdowns
                      ? 0.5
                      : 0.3
                    : 0.4,
                }}
              >
                <SwitchDark />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: showFleetGlobalToggle
                    ? showCompanyTerminalDropdowns
                      ? 0.6
                      : 0.4
                    : 0.5,
                }}
                className="flex items-center"
              >
                <Profile />
              </motion.div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Desktop Layout (>= 1280px): Single row (original layout)
  return (
    <header className={className + " " + navbarTypeClass()}>
      <div
        className={`app-header md:px-6 px-3.75 dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white
        ${borderSwicthClass()}
             md:py-6 py-3
        `}
      >
        <div className="flex justify-between items-center h-full">
          {/* Left Section */}
          <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
            {collapsed && width >= breakpoints.xl && (
              <button
                className="text-xl text-slate-900 dark:text-white"
                onClick={() => setMenuCollapsed(!collapsed)}
              >
                <Icon icon="akar-icons:arrow-right" />
              </button>
            )}
          </div>

          {/* Right Section - Nav Tools */}
          <div className="nav-tools flex items-center lg:space-x-3 space-x-2 rtl:space-x-reverse">
            {/* Company and Terminal Dropdowns - only show in fleet view */}
            {showCompanyTerminalDropdowns && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: showFleetGlobalToggle ? 0.2 : 0.1,
                  }}
                >
                  {/* <SelectCompany /> */}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: showFleetGlobalToggle ? 0.3 : 0.2,
                  }}
                >
                  {/* <SelectTerminal /> */}
                </motion.div>
              </>
            )}

            {/* Super Admin View Mode Toggle */}
            {showFleetGlobalToggle && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* <ViewModeToggle /> */}
              </motion.div>
            )}

            {/* <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: showFleetGlobalToggle
                  ? showCompanyTerminalDropdowns
                    ? 0.4
                    : 0.2
                  : 0.3,
              }}
            >
              <Language />
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: showFleetGlobalToggle
                  ? showCompanyTerminalDropdowns
                    ? 0.5
                    : 0.3
                  : 0.4,
              }}
            >
              <SwitchDark />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: showFleetGlobalToggle
                  ? showCompanyTerminalDropdowns
                    ? 0.6
                    : 0.4
                  : 0.5,
              }}
              className="flex items-center"
            >
              <Profile />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
