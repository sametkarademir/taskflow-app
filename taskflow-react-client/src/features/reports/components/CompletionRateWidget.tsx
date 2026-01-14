import { Target } from "lucide-react";
import { useLocale } from "../../common/hooks/useLocale";
import type { CompletionRateDto } from "../types/dashboardStatisticsResponseDto";

interface CompletionRateWidgetProps {
  data: CompletionRateDto;
}

export const CompletionRateWidget = ({ data }: CompletionRateWidgetProps) => {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-[#6366f1]" />
        <h3 className="text-lg font-semibold text-zinc-100">
          {t("pages.reports.widgets.completionRate")}
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">
              {t("pages.reports.widgets.overallCompletionRate")}
            </span>
            <span className="text-lg font-bold text-zinc-100">
              {data.overallCompletionRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3">
            <div
              className="bg-[#6366f1] h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.overallCompletionRate, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">
              {t("pages.reports.widgets.monthlyCompletionRate")}
            </span>
            <span className="text-lg font-bold text-zinc-100">
              {data.monthlyCompletionRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.monthlyCompletionRate, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
