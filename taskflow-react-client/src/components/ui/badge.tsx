import { clsx } from "clsx";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "emerald" | "rose" | "orange" | "blue" | "purple";
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  className,
}: BadgeProps) => {
  const variantClasses = {
    default: "bg-zinc-700/50 text-zinc-300 border-zinc-600/50",
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
