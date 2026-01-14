import apiClient from "../../common/helpers/axios";
import type { DashboardStatisticsRequestDto } from "../types/dashboardStatisticsRequestDto";
import type { DashboardStatisticsResponseDto } from "../types/dashboardStatisticsResponseDto";

const reportRoute = "/api/v1/reports";

export async function getDashboardStatisticsAsync(
  params?: DashboardStatisticsRequestDto,
): Promise<DashboardStatisticsResponseDto> {
  const response = await apiClient.get<DashboardStatisticsResponseDto>(
    `${reportRoute}/dashboard-statistics`,
    { params },
  );
  return response.data;
}
