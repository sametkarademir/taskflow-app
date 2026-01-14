import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useLocale } from "../../common/hooks/useLocale";
import type { CategoryDistributionDto } from "../types/dashboardStatisticsResponseDto";

interface CategoryDistributionChartProps {
  data: CategoryDistributionDto[];
}

export const CategoryDistributionChart = ({
  data,
}: CategoryDistributionChartProps) => {
  const { t } = useLocale();

  const chartData = data.slice(0, 10).map((item) => ({
    name: item.categoryName,
    value: item.taskCount,
    color: item.categoryColor || "#6366f1",
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        {t("pages.reports.charts.categoryDistribution")}
      </h3>
      {total === 0 ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          {t("pages.reports.charts.noData")}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis type="number" stroke="#a1a1aa" style={{ fontSize: "12px" }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#a1a1aa"
              style={{ fontSize: "12px" }}
              width={120}
            />
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
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
