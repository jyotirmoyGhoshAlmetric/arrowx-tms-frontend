import React, {
  useState,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from "react";
import Icon from "@/components/ui/Icon";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
} from "react-hook-form";

// Type for Cleave.js options
type CleaveOptions = {
  phone?: boolean;
  phoneRegionCode?: string;
  creditCard?: boolean;
  date?: boolean;
  datePattern?: string[];
  delimiter?: string;
  blocks?: number[];
  uppercase?: boolean;
  lowercase?: boolean;
  prefix?: string;
  numericOnly?: boolean;
  [key: string]: any;
};

// Type for Cleave.js component events
type CleaveChangeEvent = {
  target: {
    value: string;
    rawValue: string;
  };
};

// Type for register props to ensure proper typing
type RegisterProps = {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  name?: string;
  ref?: (instance: HTMLInputElement | null) => void;
};

// Flexible register function type that accepts any form type
export type FlexibleRegisterFunction = (name: string) => RegisterProps;

// Generic TextInput props that work with any form schema
type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onFocus" | "name"
> & {
  // Core props
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;

  // Styling
  className?: string;
  classLabel?: string;

  // React Hook Form integration
  register?: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

  // Form value for controlled components
  value?: string;

  // Layout
  horizontal?: boolean;

  // Validation & feedback
  validate?: string | boolean;
  description?: string;
  msgTooltip?: boolean;

  // Mask functionality
  isMask?: boolean;
  options?: CleaveOptions;

  // Password functionality
  hasicon?: boolean;

  // Event handlers
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
};

const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  label,
  placeholder = "Add placeholder",
  classLabel = "form-label",
  className = "",
  register,
  name,
  readOnly,
  error,
  disabled,
  id,
  horizontal,
  validate,
  isMask = false,
  msgTooltip = false,
  description,
  hasicon = false,
  onChange,
  options,
  onFocus,
  defaultValue,
  value,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Memoize register props to avoid unnecessary re-renders
  const registerProps: RegisterProps = useMemo(() => {
    if (!register || !name) {
      return {
        onChange: undefined,
        onBlur: undefined,
        name: undefined,
        ref: undefined,
      };
    }
    return register(name);
  }, [register, name]);

  // Handle password visibility toggle
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  // Determine actual input type
  const inputType = type === "password" && showPassword ? "text" : type;

  // Common class names
  const inputClassName = `form-control py-2.5 ${className} ${error ? "has-error" : ""}`;

  // Convert Cleave event to standard React event
  const createSyntheticEvent = (
    cleaveEvent: CleaveChangeEvent,
  ): ChangeEvent<HTMLInputElement> => {
    return {
      target: {
        value: cleaveEvent.target.value,
        name: name || "",
      },
      currentTarget: {
        value: cleaveEvent.target.value,
        name: name || "",
      },
    } as ChangeEvent<HTMLInputElement>;
  };

  // Handle Cleave onChange
  const handleCleaveChange = (e: CleaveChangeEvent) => {
    const syntheticEvent = createSyntheticEvent(e);

    // Call register's onChange if available
    if (registerProps?.onChange) {
      registerProps.onChange(syntheticEvent);
    }

    // Call custom onChange if provided
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  // Handle Cleave onBlur
  const handleCleaveBlur = (e: any) => {
    const syntheticEvent = {
      target: { value: e.target.value, name: name || "" },
      currentTarget: { value: e.target.value, name: name || "" },
    } as FocusEvent<HTMLInputElement>;

    // Call register's onBlur if available
    if (registerProps?.onBlur) {
      registerProps.onBlur(syntheticEvent);
    }
  };

  // Handle regular input onChange
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Call register's onChange if available
    if (registerProps?.onChange) {
      registerProps.onChange(e);
    }

    // Call custom onChange if provided
    if (onChange) {
      onChange(e);
    }
  };

  // Render input or Cleave component
  const renderInput = () => {
    const commonProps = {
      placeholder,
      readOnly,
      disabled,
      id,
      className: inputClassName,
    };

    if (isMask) {
      return (
        <Cleave
          {...commonProps}
          value={value || defaultValue || ""} // Explicitly pass the value for controlled behavior
          options={options || {}}
          onFocus={onFocus}
          onChange={handleCleaveChange}
          onBlur={handleCleaveBlur}
          {...rest}
        />
      );
    }

    return (
      <input
        {...commonProps}
        {...(register && name ? registerProps : {})}
        type={inputType}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={handleInputChange}
        onFocus={onFocus}
        {...rest}
      />
    );
  };

  // Render icon section
  const renderIcons = () => (
    <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
      {/* Password visibility toggle */}
      {hasicon && type === "password" && (
        <span
          className="cursor-pointer text-secondary-500 hover:text-secondary-700 transition-colors"
          onClick={togglePasswordVisibility}
          role="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <Icon
            icon={
              showPassword
                ? "heroicons-outline:eye"
                : "heroicons-outline:eye-off"
            }
          />
        </span>
      )}

      {/* Error icon */}
      {error && (
        <span className="text-danger-500" title={error.message as string}>
          {/* <Icon icon="heroicons-outline:information-circle" /> */}
        </span>
      )}

      {/* Success icon */}
      {validate && !error && (
        <span className="text-success-500" title="Valid">
          <Icon icon="bi:check-lg" />
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`formGroup ${error ? "has-error" : ""} ${horizontal ? "flex" : ""} ${
        validate && !error ? "is-valid" : ""
      }`}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel} ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
          }`}
        >
          {label}
          {/* Optional required indicator */}
          {rest.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        {renderInput()}
        {(hasicon || error || validate) && renderIcons()}
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

export default TextInput;
