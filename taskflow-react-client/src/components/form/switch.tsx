import type React from "react";
import { forwardRef } from "react";
import { clsx } from "clsx";

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange" | "size"
  > {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      name,
      checked = false,
      disabled = false,
      className = "",
      onChange,
      onBlur,
      label,
      error,
      hint,
      size = "md",
      ...rest
    },
    ref,
  ) => {
    const labelSizeClasses = clsx({
      "text-xs": size === "sm",
      "text-sm": size === "md",
      "text-base": size === "lg",
    });

    return (
      <div className={clsx("space-y-1.5", className)}>
        <label
          htmlFor={id}
          className={clsx(
            "relative inline-flex items-center cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className="sr-only peer"
            {...rest}
          />
          <div
            className={clsx(
              "relative w-11 h-6 rounded-full transition-all duration-200",
              "peer-focus:outline-none peer-focus:ring-4",
              "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
              "after:bg-white after:rounded-full after:h-5 after:w-5",
              "after:transition-all after:duration-200 after:shadow-md",
              {
                "bg-zinc-700 peer-focus:ring-zinc-500/20": !checked && !disabled,
                "bg-gradient-to-r from-[#6366f1] to-[#8183ff] peer-focus:ring-[#6366f1]/20 after:translate-x-full":
                  checked && !disabled,
                "bg-zinc-800": disabled,
                "border-2 border-rose-500": error,
              },
            )}
          />
          {label && (
            <span
              className={clsx(
                "ml-3 font-medium",
                labelSizeClasses,
                {
                  "text-zinc-300": !error && !disabled,
                  "text-rose-500": error,
                  "text-zinc-500": disabled,
                },
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="text-[11px] text-rose-500 font-medium ml-2">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-zinc-500 ml-2">{hint}</p>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

