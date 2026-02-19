import React from "react";

interface StatusBadgeProps {
  value: string | number;
  status?: "success" | "error" | "warning" | "info" | "neutral";
  variant?: "solid" | "outline" | "soft";
  size?: "sm" | "md" | "lg";
  className?: string;
  // Auto-status based on value
  successCondition?: (value: string | number) => boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  status,
  variant = "soft",
  size = "sm",
  className = "",
  successCondition,
}) => {
  // Auto-determine status if not provided
  const getStatus = (): string => {
    if (status) return status;

    if (successCondition) {
      return successCondition(value) ? "success" : "error";
    }

    // Default: numbers > 0 are success
    if (typeof value === "number") {
      return value > 0 ? "success" : "error";
    }

    return "neutral";
  };

  const currentStatus = getStatus();

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // Status color classes
  const getStatusClasses = () => {
    const baseClasses = "inline-flex items-center font-medium rounded-full";

    const colorMap = {
      solid: {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        warning: "bg-yellow-600 text-white",
        info: "bg-blue-600 text-white",
        neutral: "bg-gray-600 text-white",
      },
      outline: {
        success: "border border-green-600 text-green-600 bg-transparent",
        error: "border border-red-600 text-red-600 bg-transparent",
        warning: "border border-yellow-600 text-yellow-600 bg-transparent",
        info: "border border-blue-600 text-blue-600 bg-transparent",
        neutral: "border border-gray-600 text-gray-600 bg-transparent",
      },
      soft: {
        success:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        neutral:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
    };

    return `${baseClasses} ${sizeClasses[size]} ${colorMap[variant][currentStatus as keyof (typeof colorMap)[typeof variant]]}`;
  };

  return <span className={`${getStatusClasses()} ${className}`}>{value}</span>;
};

export default StatusBadge;
