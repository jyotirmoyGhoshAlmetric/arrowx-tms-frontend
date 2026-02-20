import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { type AvailableIcon, isIconAvailable } from "@/config/icon";

interface IconProps {
  icon: AvailableIcon;
  className?: string;
  width?: number;
  rotate?: number;
  hFlip?: boolean;
  vFlip?: boolean;
}

const Icon: React.FC<IconProps> = ({
  icon,
  className = "",
  width = 20,
  rotate = 0,
  hFlip = false,
  vFlip = false,
}) => {
  // Runtime validation for development
  if (!isIconAvailable(icon)) {
    console.error(
      `Icon "${icon}" is not available. Please add it to the AVAILABLE_ICONS list in src/config/icon.ts`,
    );
    return <span className="text-red-500">❌</span>;
  }

  return (
    <IconifyIcon
      width={width}
      rotate={rotate}
      hFlip={hFlip}
      icon={icon}
      className={className}
      vFlip={vFlip}
    />
  );
};

export default Icon;
