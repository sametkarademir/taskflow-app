import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useLocale } from "../../common/hooks/useLocale";
import type { StatusDistributionDto } from "../types/dashboardStatisticsResponseDto";

interface StatusDistributionChartProps {
  data: StatusDistributionDto;
}

const COLORS = {
  backlog: "#71717a",
  inProgress: "#6366f1",
  blocked: "#ef4444",
  completed: "#22c55e",
};

export const StatusDistributionChart = ({
  data,
}: StatusDistributionChartProps) => {
  const { t } = useLocale();

  const chartData = [
    {
      name: t("pages.todoItems.columns.backlog"),
      value: data.backlog,
      color: COLORS.backlog,
    },
    {
      name: t("pages.todoItems.columns.inProgress"),
      value: data.inProgress,
      color: COLORS.inProgress,
    },
    {
      name: t("pages.todoItems.columns.blocked"),
      value: data.blocked,
      color: COLORS.blocked,
    },
    {
      name: t("pages.todoItems.columns.completed"),
      value: data.completed,
      color: COLORS.completed,
    },
  ].filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        {t("pages.reports.charts.statusDistribution")}
      </h3>
      {total === 0 ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          {t("pages.reports.charts.noData")}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                color: "#f4f4f5",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "#f4f4f5",
              }}
              labelStyle={{
                color: "#a1a1aa",
                marginBottom: "4px",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            />
            <Legend
              wrapperStyle={{ color: "#f4f4f5" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
