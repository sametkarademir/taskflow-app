import type React from "react";
import { forwardRef } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      checked = false,
      disabled = false,
      className = "",
      label,
      error,
      hint,
      fullWidth = false,
      onChange,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={clsx("space-y-1.5", { "w-full": fullWidth })}>
        <label
          className={clsx(
            "flex items-center gap-3 cursor-pointer group",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <div className="relative flex items-center">
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
                "w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center",
                "peer-focus:ring-4 peer-focus:ring-[#6366f1]/20",
                {
                  "bg-[#6366f1] border-[#6366f1]": checked && !disabled && !error,
                  "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600":
                    !checked && !disabled,
                  "bg-zinc-800/30 border-zinc-700": disabled,
                  "border-rose-500": error,
                },
              )}
            >
              {checked && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
          {label && (
            <span
              className={clsx(
                "text-sm transition-colors duration-200",
                checked ? "text-zinc-200 font-medium" : "text-zinc-400",
                !disabled && "group-hover:text-zinc-300",
                error && "text-rose-500",
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="text-[11px] text-rose-500 font-medium ml-8">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-zinc-500 ml-8">{hint}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

