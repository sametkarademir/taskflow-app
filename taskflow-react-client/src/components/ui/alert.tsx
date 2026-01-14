import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { clsx } from "clsx";

interface AlertProps {
  variant?: "success" | "warning" | "error" | "info";
  message: string;
  className?: string;
  onClose?: () => void;
}

export const Alert = ({
  variant = "info",
  message,
  className,
  onClose,
}: AlertProps) => {
  const variantStyles = {
    success: {
      container:
        "border-emerald-900/30 bg-emerald-950/20",
      icon: "text-emerald-500/70",
      text: "text-emerald-400/80",
    },
    warning: {
      container:
        "border-amber-900/30 bg-amber-950/20",
      icon: "text-amber-500/70",
      text: "text-amber-400/80",
    },
    error: {
      container: "border-red-900/30 bg-red-950/20",
      icon: "text-red-500/70",
      text: "text-red-400/80",
    },
    info: {
      container: "border-blue-900/30 bg-blue-950/20",
      icon: "text-blue-500/70",
      text: "text-blue-400/80",
    },
  };

  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant];
  const styles = variantStyles[variant];

  return (
    <div
      className={clsx(
        "my-4 flex items-start gap-3 rounded-xl border p-4",
        styles.container,
        className,
      )}
    >
      <Icon className={clsx("h-5 w-5 flex-shrink-0 mt-0.5", styles.icon)} />
      <p className={clsx("flex-1 text-sm font-medium", styles.text)}>
        {message}
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            "flex-shrink-0 text-sm transition-colors hover:opacity-70",
            styles.text,
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

