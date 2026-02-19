import React, { type ChangeEvent, type FocusEvent } from "react";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
  type UseFormRegister,
} from "react-hook-form";
import CustomSelectRadix from "./CustomSelectRadix"; // Adjust the import path as needed
import Icon from "@/components/ui/Icon";
import { type AvailableIcon, isIconAvailable } from "@/config/icons";

interface Option {
  value: string | number;
  label: string;
}

interface InputGroupProps {
  // Core props
  label?: string | React.ReactNode;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  classLabel?: string;
  id?: string;
  size?: "sm" | "md" | "lg";

  // Input props
  inputType?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  inputClassName?: string;

  // Validation & feedback
  validate?: string | boolean;
  description?: string;
  msgTooltip?: boolean;

  // Left element props (e.g., currency selector, country code)
  leftElement?: "select" | "text" | "icon" | "custom";
  leftSelectOptions?: Option[];
  leftSelectValue?: string | number;
  leftSelectName?: string;
  leftSelectPlaceholder?: string;
  leftSelectClassName?: string;
  leftSelectSearchable?: boolean;
  leftText?: string;
  leftIcon?: string;
  leftCustomContent?: React.ReactNode;

  // Right element props (e.g., unit display, action button)
  rightElement?: "select" | "text" | "icon" | "custom";
  rightSelectOptions?: Option[];
  rightSelectValue?: string | number;
  rightSelectName?: string;
  rightSelectPlaceholder?: string;
  rightSelectClassName?: string;
  rightSelectSearchable?: boolean;
  rightText?: string;
  rightIcon?: string;
  rightCustomContent?: React.ReactNode;

  // Form integration
  control?: Control<any>;
  register?: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

  // Event handlers
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onLeftSelectChange?: (value: string | number) => void;
  onRightSelectChange?: (value: string | number) => void;
  onInputFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onInputBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  // Layout
  leftElementWidth?: string;
  rightElementWidth?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  className = "",
  classLabel = "form-label",
  id,
  size = "md",

  inputType = "text",
  inputValue,
  inputPlaceholder,
  inputClassName = "",

  validate,
  description,
  msgTooltip = false,

  leftElement,
  leftSelectOptions = [],
  leftSelectValue,
  leftSelectName,
  leftSelectPlaceholder = "Select",
  leftSelectClassName = "",
  leftSelectSearchable = false,
  leftText,
  leftIcon,
  leftCustomContent,

  rightElement,
  rightSelectOptions = [],
  rightSelectValue,
  rightSelectName,
  rightSelectPlaceholder = "Select",
  rightSelectClassName = "",
  rightSelectSearchable = false,
  rightText,
  rightIcon,
  rightCustomContent,

  control,
  register,
  error,

  onInputChange,
  onInputFocus,
  onInputBlur,

  leftElementWidth = "auto",
  rightElementWidth = "auto",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      height: "h-8",
      minHeight: "32px",
      padding: "px-2 py-1",
      text: "text-xs",
    },
    md: {
      height: "h-[42px]",
      minHeight: "42px",
      padding: "px-3 py-2",
      text: "text-sm",
    },
    lg: {
      height: "h-12",
      minHeight: "48px",
      padding: "px-4 py-3",
      text: "text-base",
    },
  };

  const currentSize = sizeConfig[size];

  // Form control base classes following the same pattern as TextInput
  const baseInputClasses = `
    ${
      readOnly
        ? "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 cursor-default"
        : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300"
    }
    transition duration-300 ease-in-out 
    placeholder:text-slate-400 dark:placeholder:text-slate-400 
    placeholder:font-normal
    ${currentSize.padding} 
    ${currentSize.text}
    ${inputClassName}
  `;

  // Base element classes for left and right elements
  const baseElementClasses = `
    flex items-center
    bg-slate-50 dark:bg-slate-800 
    text-slate-600 dark:text-slate-400
    transition duration-300 ease-in-out
    border-slate-200 dark:border-slate-700
  `;

  // Custom wrapper for select elements to match the styling
  const SelectWrapper: React.FC<{
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }> = ({ children, className, style }) => (
    <div className={className} style={style}>
      <div className="w-full h-full flex items-center">{children}</div>
    </div>
  );

  const renderLeftElement = () => {
    if (!leftElement) return null;

    switch (leftElement) {
      case "select":
        return (
          <SelectWrapper
            className={`
              ${baseElementClasses}
              rounded-l-sm border-r border-slate-200 dark:border-slate-700
            `}
            style={{
              width: leftElementWidth,
              minWidth: "100px",
              height: currentSize.minHeight,
            }}
          >
            {control && leftSelectName ? (
              <Controller
                name={leftSelectName}
                control={control}
                render={() => (
                  <div className="w-full">
                    <CustomSelectRadix
                      name={leftSelectName}
                      options={leftSelectOptions}
                      control={control}
                      placeholder={leftSelectPlaceholder}
                      isSearchable={leftSelectSearchable}
                      disabled={disabled || readOnly}
                      className={`border-0 bg-transparent ${leftSelectClassName}`}
                      size={size}
                    />
                  </div>
                )}
              />
            ) : control ? (
              <div className="w-full">
                <CustomSelectRadix
                  name={`${name}_left_select`}
                  options={leftSelectOptions}
                  control={control}
                  placeholder={leftSelectPlaceholder}
                  isSearchable={leftSelectSearchable}
                  disabled={disabled || readOnly}
                  className={`border-0 bg-transparent ${leftSelectClassName}`}
                  size={size}
                  defaultValue={leftSelectValue as string}
                />
              </div>
            ) : (
              <div className="w-full p-2 text-slate-400 text-sm">
                No form control provided
              </div>
            )}
          </SelectWrapper>
        );

      case "text":
        return (
          <div
            className={`
              ${baseElementClasses}
              rounded-l-sm border-r border-slate-200 dark:border-slate-700 px-3
            `}
            style={{
              width: leftElementWidth,
              minWidth: "auto",
              height: currentSize.minHeight,
            }}
          >
            <span className={`${currentSize.text} whitespace-nowrap`}>
              {leftText}
            </span>
          </div>
        );

      case "icon":
        return (
          <div
            className={`
              ${baseElementClasses}
              rounded-l-sm border-r border-slate-200 dark:border-slate-700 px-3 justify-center
            `}
            style={{
              width: leftElementWidth,
              minWidth: "auto",
              height: currentSize.minHeight,
            }}
          >
            {leftIcon && (
              <Icon
                icon={
                  (isIconAvailable(leftIcon)
                    ? leftIcon
                    : "heroicons:magnifying-glass") as AvailableIcon
                }
                className={currentSize.text}
              />
            )}
          </div>
        );

      case "custom":
        return (
          <div
            className={`
              ${baseElementClasses}
              rounded-l-sm border-r border-slate-200 dark:border-slate-700
            `}
            style={{
              width: leftElementWidth,
              height: currentSize.minHeight,
            }}
          >
            {leftCustomContent}
          </div>
        );

      default:
        return null;
    }
  };

  const renderRightElement = () => {
    if (!rightElement) return null;

    switch (rightElement) {
      case "select":
        return (
          <SelectWrapper
            className={`
              ${baseElementClasses}
              rounded-r-sm border-l border-slate-200 dark:border-slate-700
            `}
            style={{
              width: rightElementWidth,
              minWidth: "100px",
              height: currentSize.minHeight,
            }}
          >
            {control && rightSelectName ? (
              <Controller
                name={rightSelectName}
                control={control}
                render={() => (
                  <div className="w-full">
                    <CustomSelectRadix
                      name={rightSelectName}
                      options={rightSelectOptions}
                      control={control}
                      placeholder={rightSelectPlaceholder}
                      isSearchable={rightSelectSearchable}
                      disabled={disabled || readOnly}
                      className={`border-0 bg-transparent ${rightSelectClassName}`}
                      size={size}
                    />
                  </div>
                )}
              />
            ) : control ? (
              <div className="w-full">
                <CustomSelectRadix
                  name={`${name}_right_select`}
                  options={rightSelectOptions}
                  control={control}
                  placeholder={rightSelectPlaceholder}
                  isSearchable={rightSelectSearchable}
                  disabled={disabled || readOnly}
                  className={`border-0 bg-transparent ${rightSelectClassName}`}
                  size={size}
                  defaultValue={rightSelectValue as string}
                />
              </div>
            ) : (
              <div className="w-full p-2 text-slate-400 text-sm">
                No form control provided
              </div>
            )}
          </SelectWrapper>
        );

      case "text":
        return (
          <div
            className={`
              ${baseElementClasses}
              rounded-r-sm border-l border-slate-200 dark:border-slate-700 px-3
            `}
            style={{
              width: rightElementWidth,
              minWidth: "auto",
              height: currentSize.minHeight,
            }}
          >
            <span className={`${currentSize.text} whitespace-nowrap`}>
              {rightText}
            </span>
          </div>
        );

      case "icon":
        return (
          <div
            className={`
              ${baseElementClasses}
              rounded-r-sm border-l border-slate-200 dark:border-slate-700 px-3 justify-center
            `}
            style={{
              width: rightElementWidth,
              minWidth: "auto",
              height: currentSize.minHeight,
            }}
          >
            {rightIcon && (
              <Icon
                icon={
                  (isIconAvailable(rightIcon)
                    ? rightIcon
                    : "heroicons:magnifying-glass") as AvailableIcon
                }
                className={currentSize.text}
              />
            )}
          </div>
        );

      case "custom":
        return (
          <div
            className={`
              ${baseElementClasses}
              rounded-r-sm border-l border-slate-200 dark:border-slate-700
            `}
            style={{
              width: rightElementWidth,
              height: currentSize.minHeight,
            }}
          >
            {rightCustomContent}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`formGroup ${error ? "has-error" : ""} ${validate && !error ? "is-valid" : ""} ${className}`}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className={`block capitalize ${classLabel}`}
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Group Container */}
      <div className="relative">
        <div
          className={`
          flex rounded-sm border border-slate-200 dark:border-slate-700
          focus-within:ring-1 focus-within:ring-slate-600 dark:focus-within:ring-slate-900 
          focus-within:outline-hidden transition duration-300 ease-in-out
          ${error ? "border-danger-500 focus-within:ring-danger-500/90" : ""}
          ${validate && !error ? "border-success-500 focus-within:ring-success-500/90" : ""}
        `}
        >
          {/* Left Element */}
          {renderLeftElement()}

          {/* Main Input */}
          <div className="flex-1 relative">
            <input
              type={inputType}
              id={id || name}
              name={name}
              value={inputValue}
              placeholder={inputPlaceholder || placeholder}
              disabled={disabled}
              readOnly={readOnly}
              onChange={onInputChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              {...(register && register(name))}
              className={`
                ${baseInputClasses}
                w-full border-0
                focus:ring-0 focus:outline-none
              disabled:text-slate-400 disabled:placeholder:text-slate-800/60 dark:disabled:bg-slate-600
                ${leftElement && rightElement ? "rounded-none" : ""}
                ${leftElement && !rightElement ? "rounded-r-sm" : ""}
                ${!leftElement && rightElement ? "rounded-l-sm" : ""}
                ${!leftElement && !rightElement ? "rounded-sm" : ""}
              `}
              style={{
                height: currentSize.minHeight,
              }}
            />
          </div>

          {/* Right Element */}
          {renderRightElement()}
        </div>
      </div>

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
        <div className="input-description mt-1 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </div>
      )}
    </div>
  );
};

export default InputGroup;
