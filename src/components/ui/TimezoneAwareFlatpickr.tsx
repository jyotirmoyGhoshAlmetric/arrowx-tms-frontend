import React, { useRef } from "react";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { BaseOptions } from "flatpickr/dist/types/options";
import flatpickr from "flatpickr";

interface TimezoneAwareFlatpickrProps {
  value?: string | Date;
  onChange: (date: string, dateObject: Date) => void;
  timezone: string;
  className?: string;
  options?: Partial<BaseOptions>;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date | string;
  minDate?: Date | string;
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  iconClassName?: string;
}

const TimezoneAwareFlatpickr: React.FC<TimezoneAwareFlatpickrProps> = ({
  value,
  onChange,
  timezone,
  className = "",
  options = {},
  placeholder,
  disabled = false,
  maxDate,
  minDate,
  showIcon = true,
  iconPosition = "right",
  iconClassName = "",
}) => {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  // Convert value to timezone-aware date
  const getDisplayDate = (): string => {
    // if (!value) return toZonedTime(new Date(), timezone);

    // const dateValue = typeof value === "string" ? new Date(value) : value;
    return value as string;
  };

  // Convert max/min dates to timezone
  const getTimezoneDate = (date?: Date | string): Date | undefined => {
    if (!date) return undefined;
    const dateValue = typeof date === "string" ? new Date(date) : date;
    return toZonedTime(dateValue, timezone);
  };

  // Handle date change with timezone conversion
  const handleDateChange = (dates: Date[]) => {
    if (dates[0]) {
      const selectedDate = dates[0];
      // Simply format the selected date as YYYY-MM-DD without timezone conversion
      // This prevents date shifting issues
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      onChange(formattedDate, selectedDate);
    }
  };

  // Handle icon click to open calendar
  const handleIconClick = () => {
    if (!disabled && flatpickrRef.current) {
      flatpickrRef.current.open();
    }
  };

  // Merge default options with provided options
  const flatpickrOptions: Partial<BaseOptions> = {
    dateFormat: "Y-m-d",
    defaultDate: getDisplayDate(),
    maxDate: getTimezoneDate(maxDate),
    minDate: minDate ? new Date(minDate as string) : undefined,
    clickOpens: !disabled,
    allowInput: !disabled,
    onReady: (selectedDates, dateStr, instance) => {
      flatpickrRef.current = instance;
      // Call user's onReady if provided
      if (options.onReady) {
        if (Array.isArray(options.onReady)) {
          options.onReady.forEach((hook) =>
            hook(selectedDates, dateStr, instance),
          );
        } else {
          options.onReady(selectedDates, dateStr, instance);
        }
      }
    },
    ...options,
  };

  console.log("flatpickrOptions", flatpickrOptions);

  // Calendar icon SVG
  const CalendarIcon = () => (
    <svg
      className={`w-5 h-5 text-gray-400 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${iconClassName}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleIconClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const inputPaddingClass = showIcon
    ? iconPosition === "left"
      ? "pl-10"
      : "pr-10"
    : "";

  return (
    <div className="relative">
      <Flatpickr
        className={`form-control ${inputPaddingClass} ${className}`}
        options={flatpickrOptions}
        value={getDisplayDate()}
        onChange={handleDateChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showIcon && (
        <div
          className={`absolute inset-y-0 ${
            iconPosition === "left" ? "left-0 pl-3" : "right-0 pr-3"
          } flex items-center pointer-events-none`}
        >
          <div className="pointer-events-auto">
            <CalendarIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneAwareFlatpickr;
