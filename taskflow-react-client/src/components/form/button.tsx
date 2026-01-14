import type React from "react";
import { clsx } from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "warning" | "success" | "info" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  type = "button",
  onClick,
  leftIcon,
  rightIcon,
}) => {
  const baseClasses = clsx(
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "w-full": fullWidth,
      "px-3 py-1.5 text-xs": size === "sm",
      "px-4 py-2.5 text-sm": size === "md",
      "px-5 py-3 text-base": size === "lg",
      "px-6 py-3.5 text-lg": size === "xl",
    },
  );

  const variantClasses = clsx({
    "bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-[0_18px_40px_rgba(37,41,122,0.9)] hover:shadow-[0_18px_45px_rgba(37,41,122,0.95)] focus:ring-[#6366f1]/70":
      variant === "primary",
    "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-100 border border-zinc-700/80 focus:ring-zinc-500":
      variant === "secondary",
    "bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg focus:ring-amber-500":
      variant === "warning",
    "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg focus:ring-emerald-500":
      variant === "success",
    "bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg focus:ring-teal-500":
      variant === "info",
    "bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg focus:ring-rose-500":
      variant === "danger",
  });

  const iconSpacing = clsx({
    "gap-1.5": size === "sm",
    "gap-2": size === "md",
    "gap-2.5": size === "lg",
    "gap-3": size === "xl",
  });

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(baseClasses, variantClasses, iconSpacing, className)}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

