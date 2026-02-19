import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import MobileMenu from "@/components/partials/sidebar/MobileMenu";
import useMobileMenu from "@/hooks/useMobileMenu";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";
const Layout: React.FC = () => {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const navigate = useNavigate();
  const isAuth = true; // hardcoded
  const user = { name: "Demo User" }; // hardcoded

  useEffect(() => {
    if (!isAuth || !user) {
      navigate("/");
    }
  }, [isAuth, navigate, user]);

  const switchHeaderClass = () => {
    if (collapsed) {
      return "ltr:ml-[72px] rtl:mr-[72px]";
    } else {
      return "ltr:ml-[248px] rtl:mr-[248px]";
    }
  };
  // content width
  // mobile menu
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999999 }}
        toastStyle={{ zIndex: 99999999 }}
      />
      <Header className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      {width > breakpoints.xl && <Sidebar />}
      <MobileMenu
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-9999"
            : "-left-75 invisible opacity-0  z-[-999] "
        }`}
      />
      {width < breakpoints.xl && mobileMenu && (
        <div
          className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-xs opacity-100 fixed inset-0 z-999"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}
      <div
        className={`content-wrapper transition-all duration-150 ${width > 1280 ? switchHeaderClass() : ""}`}
      >
        {/* md:min-h-screen will h-full*/}
        <div className="page-content   page-min-height  ">
          <div className={"container-fluid"}>
            <Suspense fallback={<Loading />}>
              <motion.div
                key={location.pathname}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                  pageInitial: {
                    opacity: 0,
                    y: 50,
                  },
                  pageAnimate: {
                    opacity: 1,
                    y: 0,
                  },
                  pageExit: {
                    opacity: 0,
                    y: -50,
                  },
                }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5,
                }}
              >
                {/* <Breadcrumbs /> */}
                {<Outlet />}
              </motion.div>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
