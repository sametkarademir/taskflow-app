import type { DateRangeType } from "./dateRangeType";

export interface DashboardStatisticsRequestDto {
  startDate?: string | null;
  endDate?: string | null;
  dateRange?: DateRangeType | null;
}
