import React, { type ChangeEvent } from "react";

type SwitchProps = {
  id?: string;
  disabled?: boolean;
  label?: string;
  value: boolean;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  activeClass?: string;
  labelClass?: string;
  description?: string;
};

const Switch: React.FC<SwitchProps> = ({
  id,
  disabled,
  label,
  value,
  name,
  onChange,
  activeClass = "bg-slate-900 dark:bg-slate-700",
  labelClass = "text-slate-500 dark:text-slate-400 text-sm leading-6",
  description,
}) => {
  const switchId = id || name;

  return (
    <div className="flex flex-col">
      <label
        className={`flex items-center ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        htmlFor={switchId}
      >
        <input
          type="checkbox"
          className="hidden"
          name={name}
          checked={value}
          onChange={onChange}
          id={switchId}
          disabled={disabled}
        />
        <span
          className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 ${
            value
              ? `${activeClass} focus-within:ring-slate-500`
              : "bg-slate-200 dark:bg-slate-600 focus-within:ring-slate-400"
          } ${disabled ? "opacity-50" : ""}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              value ? "translate-x-5" : "translate-x-0.5"
            }`}
            style={{ marginTop: "2px" }}
          />
        </span>
        {label && (
          <span className={`ltr:ml-3 rtl:mr-3 ${labelClass}`}>{label}</span>
        )}
      </label>
      {description && (
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 ltr:ml-14 rtl:mr-14">
          {description}
        </span>
      )}
    </div>
  );
};

export default Switch;
