import React, { type ReactNode } from "react";
import Icon from "./Icon";
import { type AvailableIcon, isIconAvailable } from "@/config/icons";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerSlot?: ReactNode;
  className?: string;
  bodyClass?: string;
  noBorder?: boolean;
  titleClass?: string;
  headerClass?: string;
  titleIcon?: string;
  titleIconWidth?: number;
  titleIconClass?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerSlot,
  className = " ",
  bodyClass = "p-6",
  noBorder,
  titleClass = "text-slate-900 dark:text-white",
  headerClass = "p-6",
  titleIcon,
  titleIconWidth = 28,
  titleIconClass = "font-medium text-lg text-slate-900 dark:text-white",
  ...props
}) => {
  return (
    <div
      {...props}
      className={`card rounded-md bg-white dark:bg-slate-800 shadow-base ${className}`}
    >
      {(title || subtitle) && (
        <header
          className={`card-header ${noBorder ? "no-border" : ""} ${headerClass}`}
        >
          <div>
            {title && (
              <div
                className={`card-title flex items-center gap-2 ${titleClass}`}
              >
                {titleIcon && (
                  <Icon
                    width={titleIconWidth}
                    icon={
                      (isIconAvailable(titleIcon)
                        ? titleIcon
                        : "heroicons:document") as AvailableIcon
                    }
                    className={titleIconClass}
                  />
                )}
                {title}
              </div>
            )}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {headerSlot && <div className="card-header-slot">{headerSlot}</div>}
        </header>
      )}
      <main className={`card-body ${bodyClass}`}>{children}</main>
    </div>
  );
};

export default Card;
