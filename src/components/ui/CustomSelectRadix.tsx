import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from "react-hook-form";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectRadixProps {
  label?: string;
  name: string;
  options: Option[];
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  className?: string;
  classLabel?: string;
  defaultValue?: string;
  isMulti?: boolean;
  size?: "sm" | "md" | "lg";
  validate?: string | boolean;
  description?: string;
  msgTooltip?: boolean;
}

const CustomSelectRadix: React.FC<CustomSelectRadixProps> = ({
  label,
  name,
  options,
  control,
  error,
  placeholder = "Select...",
  required = false,
  disabled = false,
  readOnly = false,
  isSearchable = false,
  isClearable = false,
  className = "",
  classLabel = "form-label",
  defaultValue,
  isMulti = false,
  size = "md",
  validate,
  description,
  msgTooltip = false,
}) => {
  // Size configurations matching the original CustomSelect
  const sizeConfig = {
    sm: {
      height: "h-8",
      minHeight: "32px",
      fontSize: "text-xs",
      padding: "px-2 py-1",
    },
    md: {
      height: "h-[42px]",
      minHeight: "42px",
      fontSize: "text-sm",
      padding: "px-3 py-2",
    },
    lg: {
      height: "h-12",
      minHeight: "48px",
      fontSize: "text-base",
      padding: "px-4 py-3",
    },
  };

  const currentSize = sizeConfig[size];

  // Base control classes following form-control patterns
  const triggerClasses = cn(
    // Base styles
    "flex w-full items-center justify-between rounded-sm border transition-all duration-300 ease-in-out",
    "bg-white dark:bg-slate-900 text-slate-900 dark:text-white",
    "placeholder:text-slate-400 dark:placeholder:text-slate-400",
    "disabled:bg-slate-300 disabled:text-slate-600 disabled:placeholder:text-slate-800/60 dark:disabled:bg-slate-500 dark:disabled:text-white",
    // Size styles
    currentSize.height,
    currentSize.fontSize,
    currentSize.padding,

    // Focus and border styles
    "focus:outline-none focus:ring-1 focus:ring-slate-600 dark:focus:ring-slate-900",
    "border-slate-200 dark:border-slate-700",

    // Error states
    error ? "border-danger-500 focus:ring-danger-500/90" : "",

    // Success states
    validate && !error ? "border-success-500 focus:ring-success-500/90" : "",

    // ReadOnly states
    readOnly
      ? "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-white cursor-default"
      : "",

    // Disabled states
    "disabled:cursor-not-allowed disabled:opacity-50",

    // Additional classes
    className,
  );

  const contentClasses = cn(
    "relative z-[9999] max-h-96 overflow-hidden rounded-sm border border-slate-200 dark:border-slate-700",
    "bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
    "shadow-md",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  );

  const itemClasses = cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-6 pr-2",
    "text-sm outline-none",
    "focus:bg-slate-100 dark:focus:bg-slate-700",
    "focus:text-slate-900 dark:focus:text-slate-300",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    currentSize.fontSize,
  );

  // State management moved outside of Controller render
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle clear functionality
  const handleClear = (onChange: (value: any) => void) => {
    if (isClearable && !disabled && !readOnly) {
      onChange(isMulti ? [] : "");
    }
  };

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, isSearchable]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue, isSearchable]);

  // Maintain focus on search input during filtering
  useEffect(() => {
    if (
      isOpen &&
      isSearchable &&
      document.activeElement !== searchInputRef.current
    ) {
      searchInputRef.current?.focus();
    }
  }, [filteredOptions, isOpen, isSearchable]);

  return (
    <div
      className={`formGroup ${error ? "has-error" : ""} ${validate && !error ? "is-valid" : ""} ${className}`}
    >
      {/* Label */}
      {label && (
        <label htmlFor={name} className={`block capitalize ${classLabel} mb-2`}>
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      {/* Select */}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || (isMulti ? [] : "")}
        render={({ field: { onChange, value, onBlur } }) => {
          const currentValue =
            value !== undefined && value !== null
              ? value
              : defaultValue || (isMulti ? [] : "");
          const selectedOptions = isMulti
            ? options.filter(
                (opt) =>
                  Array.isArray(currentValue) &&
                  currentValue.some((v: any) => v === opt.value),
              )
            : options.find((opt) => opt.value === currentValue);

          const isPlaceholder = isMulti
            ? !Array.isArray(currentValue) || currentValue.length === 0
            : !selectedOptions;

          return (
            <SelectPrimitive.Root
              value={
                isMulti
                  ? undefined
                  : currentValue !== undefined &&
                      currentValue !== null &&
                      currentValue !== ""
                    ? String(currentValue)
                    : ""
              }
              onValueChange={(newValue) => {
                if (isMulti) {
                  // Multi-select logic
                  const currentValues = Array.isArray(currentValue)
                    ? currentValue
                    : [];
                  const isSelected = currentValues.includes(newValue);
                  const newValues = isSelected
                    ? currentValues.filter((v) => v !== newValue)
                    : [...currentValues, newValue];
                  onChange(newValues);
                } else {
                  // Convert back to the original type (number if it was a number)
                  const originalOption = options.find(
                    (opt) => String(opt.value) === newValue,
                  );
                  onChange(originalOption ? originalOption.value : newValue);
                  setIsOpen(false);
                }
                setSearchValue("");
              }}
              disabled={disabled || readOnly}
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SelectPrimitive.Trigger
                className={triggerClasses}
                onBlur={onBlur}
              >
                {/* <SelectPrimitive.Value
                  placeholder={placeholder}
                  className={cn(
                    "truncate",
                    isPlaceholder ? "text-slate-400 dark:text-slate-500" : "",
                  )}
                >
                  {displayValue}
                </SelectPrimitive.Value> */}

                {isMulti ? (
                  <span
                    className={cn(
                      "truncate",
                      !currentValue || currentValue.length === 0
                        ? "text-slate-400 dark:text-white"
                        : "",
                    )}
                  >
                    {Array.isArray(currentValue) && currentValue.length > 0
                      ? `${currentValue.length} selected`
                      : placeholder}
                  </span>
                ) : (
                  <SelectPrimitive.Value
                    placeholder={placeholder}
                    className={cn(
                      "truncate",
                      isPlaceholder ? "text-slate-400 dark:text-white" : "",
                    )}
                  />
                )}

                <div className="flex items-center gap-1">
                  {/* Clear button */}
                  {isClearable && !isPlaceholder && !disabled && !readOnly && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear(onChange);
                      }}
                      className="flex h-4 w-4 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      <XIcon className="h-3 w-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                    </button>
                  )}

                  {/* Dropdown icon */}
                  <SelectPrimitive.Icon asChild>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </div>
              </SelectPrimitive.Trigger>

              <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                  className={contentClasses}
                  position="popper"
                  style={{
                    zIndex: 999999999,
                    width: "var(--radix-select-trigger-width)",
                  }}
                >
                  <SelectPrimitive.Viewport className="p-1">
                    {/* Search input */}
                    {isSearchable && (
                      <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm bg-transparent border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-slate-600 dark:focus:ring-slate-400"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            // Prevent closing dropdown when typing
                            if (e.key === "Escape") {
                              setIsOpen(false);
                              setSearchValue("");
                            }
                            // Stop propagation to prevent Radix from handling these keys
                            e.stopPropagation();
                          }}
                          autoFocus
                        />
                      </div>
                    )}

                    {/* Options */}
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => {
                        const isSelected = isMulti
                          ? Array.isArray(currentValue) &&
                            currentValue.includes(option.value)
                          : currentValue === option.value;

                        return (
                          <SelectPrimitive.Item
                            key={option.value}
                            value={String(option.value)}
                            className={cn(
                              itemClasses,
                              isSelected && isMulti
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : "",
                            )}
                          >
                            <span className="absolute left-1.5 flex h-3.5 w-3.5 items-center justify-center">
                              {isSelected && (
                                <CheckIcon className="h-4 w-4 text-blue-600" />
                              )}
                            </span>
                            <SelectPrimitive.ItemText>
                              {option.label}
                            </SelectPrimitive.ItemText>
                          </SelectPrimitive.Item>
                        );
                      })
                    ) : (
                      <div className="px-8 py-2 text-sm text-slate-500 dark:text-white">
                        No options found
                      </div>
                    )}
                  </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          );
        }}
      />

      {/* Error message */}
      {error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? "inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded-sm"
              : "text-danger-500 block text-sm"
          }`}
          role="alert"
        >
          {error.message as string}
        </div>
      )}

      {/* Success message */}
      {validate && typeof validate === "string" && !error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? "inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded-sm"
              : "text-success-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="input-description mt-1 text-sm text-slate-600 dark:text-white">
          {description}
        </div>
      )}
    </div>
  );
};

export default CustomSelectRadix;
