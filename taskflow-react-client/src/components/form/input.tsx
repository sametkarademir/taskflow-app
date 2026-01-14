import type React from "react";
import { forwardRef } from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  success?: boolean;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      success = false,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    const inputClasses = clsx(
      "block rounded-xl border-2 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200",
      "focus:outline-none focus:ring-4",
      {
        "w-full": fullWidth,
        "pl-10": leftIcon,
        "pr-10": rightIcon,
        "opacity-50 bg-zinc-800/30 border-zinc-700 text-zinc-400 cursor-not-allowed":
          disabled,
        "border-rose-700 focus:border-rose-500 focus:ring-rose-500/20":
          hasError && !disabled,
        "border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20":
          success && !disabled && !hasError,
        "border-zinc-700 focus:border-[#6366f1] focus:ring-[#6366f1]/20 hover:border-zinc-600":
          !disabled && !hasError && !success,
      },
      className,
    );

    return (
      <div className={clsx("space-y-1.5", { "w-full": fullWidth })}>
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
          <div className="pointer-events-none absolute inset-px rounded-xl border border-zinc-50/5" />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {(errorMessage || hint) && (
          <p
            className={clsx("text-xs transition-colors duration-200", {
              "text-rose-400": hasError,
              "text-emerald-400": success && !hasError,
              "text-zinc-400": !hasError && !success,
            })}
          >
            {errorMessage || hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

