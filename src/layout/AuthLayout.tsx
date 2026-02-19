import React, { Suspense } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading";
import AuthVideo from "../videos/login-page.mp4"; // keep the video if you have it, else remove

const AuthLayout: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* Toasts */}
        <div style={{ display: "contents" }}>
          <ToastContainer />
        </div>

        {/* Main layout */}
        <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
          {/* Left column - Video background */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-800">
            {AuthVideo && (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover z-0"
              >
                <source src={AuthVideo} type="video/mp4" />
              </video>
            )}

            <div className="absolute inset-0 bg-black/35 z-10"></div>

            <div className="absolute inset-0 z-20 flex flex-col justify-between h-full p-8 pb-16">
              {/* Desktop Logo Placeholder */}
              <div
                className="scale-90 text-white font-bold text-2xl"
                style={{ maxWidth: "300px" }}
              >
                ARROWX TMS
              </div>

              {/* Tagline */}
              <div className="w-full flex justify-center scale-90">
                <span className="text-white text-md">
                  Smart, Safe, Compliant - Powered by AI
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
              <div className="h-full flex flex-col justify-center auth-box-login">
                {/* Mobile Logo Placeholder */}
                <div className="mobile-logo text-center mb-6 lg:hidden block text-2xl font-bold">
                  ARROWX TMS
                </div>

                {/* Child route content */}
                <Outlet />

                {/* Footer */}
                <div className="auth-footer text-center mt-8 text-sm text-gray-500">
                  COPYRIGHT © 2025 ArrowX, All rights Reserved
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default AuthLayout;
