import React from "react";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from "react-hook-form";
import Select from "react-select";
import styles from "./CustomSelect.module.css";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
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

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  options,
  control,
  error,
  placeholder = "Select...",
  required = false,
  disabled = false,
  isSearchable = false,
  isMulti = false,
  isClearable = false,
  className = "",
  classLabel = "form-label",
  readOnly = false,
  defaultValue,
  size = "md",
  validate,
  description,
  msgTooltip = false,
}) => {
  // Size configurations matching TextInput and InputGroup
  const sizeConfig = {
    sm: {
      minHeight: "32px",
      fontSize: "12px",
      padding: "4px 8px",
    },
    md: {
      minHeight: "42px",
      fontSize: "14px",
      padding: "8px 12px",
    },
    lg: {
      minHeight: "48px",
      fontSize: "16px",
      padding: "12px 16px",
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <div
      className={`formGroup ${error ? "has-error" : ""} ${validate && !error ? "is-valid" : ""} ${className}`}
    >
      {/* Label */}
      {label && (
        <label htmlFor={name} className={`block capitalize ${classLabel}`}>
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      {/* Select */}
      <div className={styles.customSelectWrapper}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || (isMulti ? [] : "")}
          render={({ field: { onChange, value, name: fieldName, onBlur } }) => {
            const selectedOption = isMulti
              ? options.filter(
                  (opt) =>
                    Array.isArray(value) &&
                    value.some((v: any) => v.value === opt.value),
                )
              : options.find((opt) => opt.value === value) || null;

            return (
              <Select
                id={fieldName}
                name={fieldName}
                options={options}
                placeholder={placeholder}
                value={selectedOption}
                isMulti={isMulti}
                onChange={(selectedOption: any) => {
                  if (isMulti) {
                    onChange(selectedOption || []);
                  } else {
                    onChange(selectedOption?.value || "");
                  }
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: currentSize.minHeight,
                    height: currentSize.minHeight,
                    backgroundColor: readOnly ? "#e2e8f0" : "#ffffff",
                    borderColor: error
                      ? "#ef4444"
                      : validate && !error
                        ? "#10b981"
                        : "#cbd5e1",
                    borderRadius: "0.125rem", // rounded-sm
                    borderWidth: "1px",
                    boxShadow: state.isFocused
                      ? error
                        ? "0 0 0 1px rgba(239, 68, 68, 0.9)"
                        : validate && !error
                          ? "0 0 0 1px rgba(16, 185, 129, 0.9)"
                          : "0 0 0 1px rgba(100, 116, 139, 0.9)"
                      : "none",
                    "&:hover": {
                      borderColor: error
                        ? "#ef4444"
                        : validate && !error
                          ? "#10b981"
                          : "#94a3b8",
                    },
                    fontSize: currentSize.fontSize,
                    transition: "all 300ms ease-in-out",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: currentSize.padding,
                  }),
                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#94a3b8",
                    fontWeight: "normal",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: readOnly ? "#64748b" : "#0f172a",
                  }),
                  indicatorSeparator: () => ({ display: "none" }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 99999999,
                    borderRadius: "0.125rem",
                    border: "1px solid #cbd5e1",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    backgroundColor: "#ffffff",
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 99999999,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#3b82f6"
                      : state.isFocused
                        ? "#f1f5f9"
                        : "#ffffff",
                    color: state.isSelected ? "#ffffff" : "#0f172a",
                    padding: "8px 12px",
                    fontSize: currentSize.fontSize,
                    "&:active": {
                      backgroundColor: state.isSelected ? "#3b82f6" : "#e2e8f0",
                    },
                  }),
                }}
                menuPortalTarget={document.body}
                onBlur={onBlur}
                isSearchable={isSearchable}
                isClearable={isClearable}
                isDisabled={disabled || readOnly}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            );
          }}
        />
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

export default CustomSelect;
