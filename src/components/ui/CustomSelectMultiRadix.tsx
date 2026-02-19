import React, { useState } from "react";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from "react-hook-form";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDown, Info } from "lucide-react";
import { cn } from "@/utils";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectRadixProps {
  label?: string;
  name: string;
  options: Option[];
  control?: Control<any>;
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
  onChange?: (value: any) => void;
}

const CustomSelectMultiRadix: React.FC<CustomSelectRadixProps> = ({
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
  // isClearable = false,
  className = "",
  classLabel = "form-label",
  //  defaultValue,
  isMulti = false,
  size = "md",
  validate,
  description,
  msgTooltip = false,
  onChange,
}) => {
  const methods = useFormContext();
  const formControl = control || methods.control;
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

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

  const triggerClasses = cn(
    "flex w-full items-center justify-between rounded-sm border transition-all duration-300 ease-in-out",
    "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300",
    "placeholder:text-slate-400 dark:placeholder:text-slate-400",
    "disabled:bg-slate-300 disabled:text-slate-600 disabled:placeholder:text-slate-800/60 dark:disabled:bg-slate-600",

    // Size styles
    currentSize.height,
    currentSize.fontSize,
    currentSize.padding,
    "focus:outline-none focus:ring-1 focus:ring-slate-600 dark:focus:ring-slate-900",
    "border-slate-200 dark:border-slate-700",

    // Error states
    error ? "border-danger-500 focus:ring-danger-500/90" : "",

    // Success states
    validate && !error ? "border-success-500 focus:ring-success-500/90" : "",

    // ReadOnly states
    readOnly
      ? "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 cursor-default"
      : "",

    // Disabled states
    "disabled:cursor-not-allowed disabled:opacity-50",

    // Additional classes
    className,
  );

  const contentClasses = cn(
    "relative z-[9999] max-h-96 overflow-hidden rounded-sm border border-slate-200 dark:border-slate-700",
    "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300",
    "shadow-md",
    "w-[var(--radix-popover-trigger-width)]",
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

  const renderMultiSelect = (field: any) => (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className={triggerClasses} disabled={disabled}>
          <span className="truncate text-left w-full">
            {field.value?.length > 0
              ? options
                  .filter((opt) => field.value.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ")
              : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Content className={contentClasses} sideOffset={5} align="start">
        {isSearchable && (
          <div className="p-2">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full border rounded px-2 py-1 text-sm dark:bg-slate-700 dark:text-white"
            />
          </div>
        )}
        <div className="max-h-60 overflow-y-auto">
          {options
            .filter((option) =>
              option.label.toLowerCase().includes(searchValue.toLowerCase()),
            )
            .map((option) => {
              const isSelected = field.value?.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    itemClasses,
                    "cursor-pointer flex items-center gap-2",
                    isSelected && "font-medium",
                  )}
                  onClick={() => {
                    const newValue = isSelected
                      ? field.value.filter((v: any) => v !== option.value)
                      : [...field.value, option.value];
                    field.onChange(newValue);
                    onChange?.(newValue);
                  }}
                >
                  <input type="checkbox" readOnly checked={isSelected} />
                  <span>{option.label}</span>
                </div>
              );
            })}
        </div>
      </Popover.Content>
    </Popover.Root>
  );

  const renderSingleSelect = (field: any) => (
    <SelectPrimitive.Root
      value={field.value}
      onValueChange={(val) => {
        field.onChange(val);
        onChange?.(val);
      }}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger className={triggerClasses}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content className={contentClasses}>
        {options.map((option) => (
          <SelectPrimitive.Item
            key={option.value}
            value={String(option.value)}
            className={itemClasses}
          >
            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
              <CheckIcon className="h-4 w-4" />
            </SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>
        ))}
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className={cn("mb-1 flex items-center gap-1", classLabel)}>
          {label}
          {required && <span className="text-danger-500">*</span>}
          {msgTooltip && description && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Info className="h-4 w-4 text-slate-400 cursor-pointer" />
              </Tooltip.Trigger>
              <Tooltip.Content className="text-xs bg-slate-700 text-white px-2 py-1 rounded shadow">
                {description}
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={formControl}
        defaultValue={isMulti ? [] : ""}
        render={({ field }) =>
          isMulti ? renderMultiSelect(field) : renderSingleSelect(field)
        }
      />

      {description && !msgTooltip && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      {error && (
        <p className="mt-1 text-xs text-danger-500">{String(error.message)}</p>
      )}
    </div>
  );
};

export default CustomSelectMultiRadix;
