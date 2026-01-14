import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLocale } from "../../common/hooks/useLocale";
import type { TrendDataDto } from "../types/dashboardStatisticsResponseDto";

interface TrendChartProps {
  data: TrendDataDto[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const { t } = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    created: item.createdCount,
    completed: item.completedCount,
  }));

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        {t("pages.reports.charts.trendData")}
      </h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          {t("pages.reports.charts.noData")}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="date"
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
              cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            <Legend
              wrapperStyle={{ color: "#f4f4f5" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="created"
              stroke="#6366f1"
              strokeWidth={2}
              name={t("pages.reports.charts.created")}
              dot={{ fill: "#6366f1", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              strokeWidth={2}
              name={t("pages.reports.charts.completed")}
              dot={{ fill: "#22c55e", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
