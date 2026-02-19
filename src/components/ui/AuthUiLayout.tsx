// components/AuthLayout.tsx
import React from "react";
import { Link } from "react-router";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
  isRegister?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
  isRegister = false,
}) => {
  return (
    <>
      {/* Header Text */}
      <div className={`text-center ${isRegister ? "mb-8" : "2xl:mb-12 mb-8"}`}>
        <h4
          className={`font-bold mb-3 ${
            isRegister
              ? "text-2xl lg:text-3xl text-slate-900 dark:text-white"
              : "text-3xl lg:text-4xl text-slate-900 dark:text-white"
          }`}
        >
          {title}
        </h4>
        <div className="text-slate-600 dark:text-slate-400 text-base font-normal">
          {subtitle}
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full flex justify-center mt-2">
        <div className="w-full max-w-4xl">{children}</div>
      </div>

      {/* Footer Link */}
      {footerText && footerLink && footerLinkText && (
        <div
          className={`${
            isRegister
              ? "text-center font-normal text-slate-600 dark:text-slate-400 mt-8 text-sm"
              : "text-center mx-auto font-normal text-slate-600 dark:text-slate-400 mt-8 text-sm"
          }`}
        >
          {footerText}{" "}
          <Link
            to={footerLink}
            className="text-slate-900 dark:text-white font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {footerLinkText}
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthLayout;
