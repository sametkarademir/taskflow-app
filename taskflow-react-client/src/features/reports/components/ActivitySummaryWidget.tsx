import { MessageSquare, Activity, FolderOpen } from "lucide-react";
import { useLocale } from "../../common/hooks/useLocale";
import type { ActivitySummaryDto } from "../types/dashboardStatisticsResponseDto";

interface ActivitySummaryWidgetProps {
  data: ActivitySummaryDto;
}

export const ActivitySummaryWidget = ({
  data,
}: ActivitySummaryWidgetProps) => {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#6366f1]" />
        <h3 className="text-lg font-semibold text-zinc-100">
          {t("pages.reports.widgets.activitySummary")}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">
                {t("pages.reports.widgets.totalComments")}
              </p>
              <p className="text-xl font-bold text-zinc-100">
                {data.totalComments}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">
                {t("pages.reports.widgets.recentActivities")}
              </p>
              <p className="text-xl font-bold text-zinc-100">
                {data.recentActivities}
              </p>
            </div>
          </div>
        </div>

        {data.mostActiveCategoryName && (
          <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#6366f1]/20">
                <FolderOpen className="w-5 h-5 text-[#6366f1]" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("pages.reports.widgets.mostActiveCategory")}
                </p>
                <p className="text-lg font-semibold text-zinc-100">
                  {data.mostActiveCategoryName}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {data.mostActiveCategoryTaskCount}{" "}
                  {t("pages.reports.widgets.tasks")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
