import type { TodoItemResponseDto } from "../../todoItems/types/todoItemResponseDto";

export interface DashboardStatisticsResponseDto {
  summary: SummaryStatisticsDto;
  statusDistribution: StatusDistributionDto;
  priorityDistribution: PriorityDistributionDto;
  categoryDistribution: CategoryDistributionDto[];
  trendData: TrendDataDto[];
  completionRate: CompletionRateDto;
  upcomingTasks: UpcomingTasksDto;
  activitySummary: ActivitySummaryDto;
}

export interface SummaryStatisticsDto {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
  blockedTasks: number;
}

export interface StatusDistributionDto {
  backlog: number;
  inProgress: number;
  blocked: number;
  completed: number;
}

export interface PriorityDistributionDto {
  low: number;
  medium: number;
  high: number;
}

export interface CategoryDistributionDto {
  categoryId: string;
  categoryName: string;
  categoryColor?: string | null;
  taskCount: number;
}

export interface TrendDataDto {
  date: string;
  createdCount: number;
  completedCount: number;
}

export interface CompletionRateDto {
  overallCompletionRate: number;
  monthlyCompletionRate: number;
}

export interface UpcomingTasksDto {
  todayTasks: TodoItemResponseDto[];
  thisWeekTasks: TodoItemResponseDto[];
}

export interface ActivitySummaryDto {
  totalComments: number;
  recentActivities: number;
  mostActiveCategoryName?: string | null;
  mostActiveCategoryTaskCount: number;
}
