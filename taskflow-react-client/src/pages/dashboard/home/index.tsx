import { useState } from "react";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Ban,
  ListTodo,
} from "lucide-react";
import { useLocale } from "../../../features/common/hooks/useLocale";
import { useGetDashboardStatistics } from "../../../features/reports/hooks/useGetDashboardStatistics";
import { DashboardDateFilter } from "../../../features/reports/components/DashboardDateFilter";
import { StatCard } from "../../../features/reports/components/StatCard";
import { StatusDistributionChart } from "../../../features/reports/components/StatusDistributionChart";
import { PriorityDistributionChart } from "../../../features/reports/components/PriorityDistributionChart";
import { CategoryDistributionChart } from "../../../features/reports/components/CategoryDistributionChart";
import { TrendChart } from "../../../features/reports/components/TrendChart";
import { CompletionRateWidget } from "../../../features/reports/components/CompletionRateWidget";
import { UpcomingTasksWidget } from "../../../features/reports/components/UpcomingTasksWidget";
import { ActivitySummaryWidget } from "../../../features/reports/components/ActivitySummaryWidget";
import type { DashboardStatisticsRequestDto } from "../../../features/reports/types/dashboardStatisticsRequestDto";
import { DateRangeType } from "../../../features/reports/types/dateRangeType";

export const HomePage = () => {
  const { t } = useLocale();
  const [dateFilter, setDateFilter] = useState<DashboardStatisticsRequestDto>({
    dateRange: DateRangeType.ThisWeek,
  });

  const { data, isLoading, error } = useGetDashboardStatistics(dateFilter, {
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-zinc-400">{t("common.loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400">
              {t("common.error") || "An error occurred"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">
              {t("pages.reports.title")}
            </h1>
            <p className="text-zinc-400 mt-1">
              {t("pages.reports.subtitle")}
            </p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
          <DashboardDateFilter value={dateFilter} onChange={setDateFilter} />
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title={t("pages.reports.summary.totalTasks")}
            value={data.summary.totalTasks}
            icon={ListTodo}
            iconColor="bg-[#6366f1]"
          />
          <StatCard
            title={t("pages.reports.summary.activeTasks")}
            value={data.summary.activeTasks}
            icon={Clock}
            iconColor="bg-blue-500"
          />
          <StatCard
            title={t("pages.reports.summary.completedTasks")}
            value={data.summary.completedTasks}
            icon={CheckSquare}
            iconColor="bg-emerald-500"
          />
          <StatCard
            title={t("pages.reports.summary.overdueTasks")}
            value={data.summary.overdueTasks}
            icon={AlertCircle}
            iconColor="bg-red-500"
          />
          <StatCard
            title={t("pages.reports.summary.blockedTasks")}
            value={data.summary.blockedTasks}
            icon={Ban}
            iconColor="bg-orange-500"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusDistributionChart data={data.statusDistribution} />
          <PriorityDistributionChart data={data.priorityDistribution} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryDistributionChart data={data.categoryDistribution} />
          <TrendChart data={data.trendData} />
        </div>

        {/* Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CompletionRateWidget data={data.completionRate} />
          <UpcomingTasksWidget data={data.upcomingTasks} />
          <ActivitySummaryWidget data={data.activitySummary} />
        </div>
      </div>
    </div>
  );
};
