import React, { type ReactNode, type MouseEvent } from "react";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router";
import { type AvailableIcon, isIconAvailable } from "@/config/icon";

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

type ButtonProps = {
  text?: string;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  icon?: string;
  loadingClass?: string;
  iconPosition?: "left" | "right";
  iconClass?: string;
  link?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  div?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  isLoading = false,
  disabled = false,
  className,
  children,
  icon,
  loadingClass = "unset-classname",
  iconPosition = "left",
  iconClass = "text-[20px]",
  link,
  onClick,
  div = false,
  variant = "primary",
  size = "md",
}) => {
  // Variant classes
  const variantClasses = {
    default:
      "bg-primary-500 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-primary-600 dark:hover:bg-gray-200 focus:ring-gray-500",
    primary:
      "bg-primary-500 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-primary-600 dark:hover:bg-gray-200 focus:ring-gray-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    link: "bg-transparent text-primary-500 hover:text-primary-600 underline-offset-4 hover:underline focus:ring-gray-500",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14",
    icon: "size-9",
  };

  // Icon size classes based on button size
  const iconSizeClasses = {
    sm: "text-[16px]",
    md: "text-[18px]",
    lg: "text-[20px]",
    xl: "text-[24px]",
    icon: "text-[20px]",
  };

  // Loading spinner size classes
  const spinnerSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
    icon: "h-4 w-4",
  };

  // Common base classes
  const baseClasses = `
    btn inline-flex items-center justify-center
    rounded-md font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    ${isLoading ? "pointer-events-none" : ""}
    ${disabled ? "opacity-40 cursor-not-allowed" : ""}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className || ""}
  `
    .trim()
    .replace(/\s+/g, " ");

  // Get icon class with size consideration
  const getIconClass = () => {
    if (iconClass !== "text-[20px]") {
      // If custom iconClass is provided, use it
      return iconClass;
    }
    // Otherwise, use size-based icon class
    return iconSizeClasses[size];
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <>
      <svg
        className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 ${spinnerSizeClasses[size]} ${loadingClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {size !== "sm" && <span>Loading...</span>}
    </>
  );

  // Button content component
  const ButtonContent = () => {
    // If has children and not loading
    if (children && !isLoading) {
      return <>{children}</>;
    }

    // If loading
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // If no children and not loading
    if (!children && !isLoading) {
      return (
        <span className="flex items-center">
          {/* Icon */}
          {icon && (
            <span
              className={`
                ${iconPosition === "right" ? "order-1 ltr:ml-2 rtl:mr-2" : ""}
                ${text && iconPosition === "left" ? "ltr:mr-2 rtl:ml-2" : ""}
                ${getIconClass()}
              `}
            >
              <Icon
                icon={
                  (icon && isIconAvailable(icon)
                    ? icon
                    : "heroicons:plus") as AvailableIcon
                }
              />
            </span>
          )}
          {text && <span>{text}</span>}
        </span>
      );
    }

    return null;
  };

  // Render as Link
  if (link && !div) {
    return (
      <Link to={link} className={baseClasses}>
        <ButtonContent />
      </Link>
    );
  }

  // Render as div
  if (div && !link) {
    return (
      <div onClick={onClick} className={baseClasses}>
        <ButtonContent />
      </div>
    );
  }

  // Render as button (default)
  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disabled}
    >
      <ButtonContent />
    </button>
  );
};

export default Button;
