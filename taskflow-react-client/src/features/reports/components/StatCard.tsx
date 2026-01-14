import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "bg-[#6366f1]",
  trend,
  className,
}: StatCardProps) => {
  return (
    <div
      className={clsx(
        "rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/70",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-zinc-100">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={clsx(
                  "text-xs font-medium",
                  trend.isPositive ? "text-emerald-400" : "text-red-400",
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-zinc-500">
                {trend.isPositive ? "↑" : "↓"}
              </span>
            </div>
          )}
        </div>
        <div
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconColor,
          )}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};
