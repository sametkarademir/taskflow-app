import { Calendar, Clock } from "lucide-react";
import { useLocale } from "../../common/hooks/useLocale";
import type { UpcomingTasksDto } from "../types/dashboardStatisticsResponseDto";
import { Badge } from "../../../components/ui/badge";
import { getStatusLabel, getStatusBadgeVariant } from "../../todoItems/utils/statusUtils";

interface UpcomingTasksWidgetProps {
  data: UpcomingTasksDto;
  onTaskClick?: (taskId: string) => void;
}

export const UpcomingTasksWidget = ({
  data,
  onTaskClick,
}: UpcomingTasksWidgetProps) => {
  const { t, locale } = useLocale();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderTaskList = (tasks: typeof data.todayTasks, title: string) => {
    if (tasks.length === 0) {
      return (
        <div className="text-sm text-zinc-500 py-4 text-center">
          {t("pages.reports.widgets.noUpcomingTasks")}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick?.(task.id)}
            className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-zinc-100 truncate">
                  {task.title}
                </h4>
                {task.dueDate && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-xs text-zinc-500">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
              </div>
              <Badge
                variant={getStatusBadgeVariant(task.status)}
                className="text-xs shrink-0"
              >
                {getStatusLabel(task.status, t)}
              </Badge>
            </div>
          </div>
        ))}
        {tasks.length > 5 && (
          <div className="text-xs text-zinc-500 text-center pt-2">
            {t("pages.reports.widgets.andMore", { count: tasks.length - 5 })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#6366f1]" />
        <h3 className="text-lg font-semibold text-zinc-100">
          {t("pages.reports.widgets.upcomingTasks")}
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-3">
            {t("pages.reports.widgets.today")}
          </h4>
          {renderTaskList(data.todayTasks, t("pages.reports.widgets.today"))}
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-3">
            {t("pages.reports.widgets.thisWeek")}
          </h4>
          {renderTaskList(
            data.thisWeekTasks,
            t("pages.reports.widgets.thisWeek"),
          )}
        </div>
      </div>
    </div>
  );
};
