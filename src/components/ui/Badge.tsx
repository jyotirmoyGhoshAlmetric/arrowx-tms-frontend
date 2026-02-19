import React from "react";
import Icon from "@/components/ui/Icon";
import { type AvailableIcon, isIconAvailable } from "@/config/icon";

interface BadgeProps {
  className?: string;
  label?: string;
  icon?: string;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  className = "bg-danger-500 text-white",
  label,
  icon,
  children,
}) => {
  return (
    <span className={`badge ${className}`}>
      {!children && (
        <span className="inline-flex items-center">
          {icon && (
            <span className="inline-block ltr:mr-1 rtl:ml-1">
              <Icon
                icon={
                  (isIconAvailable(icon)
                    ? icon
                    : "heroicons:star") as AvailableIcon
                }
              />
            </span>
          )}
          {label}
        </span>
      )}
      {children && <span className="inline-flex items-center">{children}</span>}
    </span>
  );
};

export default Badge;
