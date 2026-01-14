import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getDashboardStatisticsAsync } from "../services/reportService";
import type { DashboardStatisticsRequestDto } from "../types/dashboardStatisticsRequestDto";
import type { DashboardStatisticsResponseDto } from "../types/dashboardStatisticsResponseDto";

type UseGetDashboardStatisticsOptionsType = Omit<
  UseQueryOptions<DashboardStatisticsResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetDashboardStatistics = (
  params?: DashboardStatisticsRequestDto,
  options: UseGetDashboardStatisticsOptionsType = {},
) => {
  return useQuery<DashboardStatisticsResponseDto, Error>({
    queryKey: ["reports", "dashboard-statistics", params],
    queryFn: async () => {
      return await getDashboardStatisticsAsync(params);
    },
    ...options,
  });
};
