import type React from "react";
import { clsx } from "clsx";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  required?: boolean;
  isRequired?: boolean;
  error?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  isRequired = false,
  error = false,
  className,
  ...props
}) => {
  const showRequired = required || isRequired;

  return (
    <label
      className={clsx(
        "flex items-center gap-2 text-xs font-medium text-zinc-300 ml-1",
        {
          "text-rose-500": error,
        },
        className,
      )}
      {...props}
    >
      {children}
      {showRequired && <span className="text-rose-500">*</span>}
    </label>
  );
};

