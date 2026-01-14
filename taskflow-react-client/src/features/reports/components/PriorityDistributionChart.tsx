import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLocale } from "../../common/hooks/useLocale";
import type { PriorityDistributionDto } from "../types/dashboardStatisticsResponseDto";

interface PriorityDistributionChartProps {
  data: PriorityDistributionDto;
}

const COLORS = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

export const PriorityDistributionChart = ({
  data,
}: PriorityDistributionChartProps) => {
  const { t } = useLocale();

  const chartData = [
    {
      name: t("pages.todoItems.priority.low"),
      value: data.low,
      color: COLORS.low,
    },
    {
      name: t("pages.todoItems.priority.medium"),
      value: data.medium,
      color: COLORS.medium,
    },
    {
      name: t("pages.todoItems.priority.high"),
      value: data.high,
      color: COLORS.high,
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        {t("pages.reports.charts.priorityDistribution")}
      </h3>
      {total === 0 ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          {t("pages.reports.charts.noData")}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="name"
              stroke="#a1a1aa"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#a1a1aa" style={{ fontSize: "12px" }} />
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
              iconType="square"
            />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
