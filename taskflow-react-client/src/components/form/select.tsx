import type React from "react";

import { forwardRef } from "react";

import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  success?: boolean;
  error?: boolean;
  value?: string | number;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // React Hook Form props
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      disabled = false,
      className = "",
      success = false,
      error = false,
      value,
      hint,
      placeholder,
      options,
      onChange,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const selectClasses = clsx(
      "w-full appearance-none px-4 pr-10 py-3 text-sm rounded-xl border-2 transition-all duration-200",
      "bg-zinc-800/50",
      "text-zinc-100",
      "focus:outline-none focus:ring-4",
      "disabled:cursor-not-allowed",
      "cursor-pointer",
      {
        "opacity-50 bg-zinc-800/30 border-zinc-700 text-zinc-400":
          disabled,
        "border-red-700 focus:border-red-500 focus:ring-red-500/20":
          error && !disabled,
        "border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20":
          success && !disabled,
        "border-zinc-700 focus:border-[#6366f1] focus:ring-[#6366f1]/20 hover:border-zinc-600":
          !disabled && !error && !success,
      },
      className,
    );

    const hintClasses = clsx("mt-2 text-xs transition-colors duration-200", {
      "text-red-400": error,
      "text-emerald-400": success && !error,
      "text-zinc-400": !error && !success,
    });

    const iconClasses = clsx(
      "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors",
      {
        "text-zinc-400": !error && !success,
        "text-red-400": error,
        "text-emerald-400": success && !error,
        "opacity-50": disabled,
      },
    );

    return (
      <div className="relative">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={selectClasses}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={iconClasses} />
        {hint && <p className={hintClasses}>{hint}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
