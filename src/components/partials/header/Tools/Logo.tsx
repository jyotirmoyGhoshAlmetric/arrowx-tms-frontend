import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router";
import useWidth from "@/hooks/useWidth";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import MobileLogo from "@/assets/images/logo/logo-a.svg";
import MobileLogoWhite from "@/assets/images/logo/logo-a-white.svg";
import LogoDark from "@/assets/images/logo/logo-dark.svg";

type LogoProps = {
  isAuth?: boolean;
};

const Logo: React.FC<LogoProps> = ({ isAuth = false }) => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  if (isAuth) {
    return (
      <Link to="/">
        <img src={isDark ? LogoWhite : LogoWhite} alt="" className="mb-10" />
      </Link>
    );
  }

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          <img src={isDark ? LogoWhite : LogoDark} alt="" />
        ) : (
          <img src={isDark ? MobileLogoWhite : MobileLogo} alt="" />
        )}
      </Link>
    </div>
  );
};

export default Logo;
