using TaskFlow.Application.Contracts.TodoItems;

namespace TaskFlow.Application.Contracts.Reports;

public class DashboardStatisticsResponseDto
{
    public SummaryStatisticsDto Summary { get; set; } = null!;
    public StatusDistributionDto StatusDistribution { get; set; } = null!;
    public PriorityDistributionDto PriorityDistribution { get; set; } = null!;
    public List<CategoryDistributionDto> CategoryDistribution { get; set; } = [];
    public List<TrendDataDto> TrendData { get; set; } = [];
    public CompletionRateDto CompletionRate { get; set; } = null!;
    public UpcomingTasksDto UpcomingTasks { get; set; } = null!;
    public ActivitySummaryDto ActivitySummary { get; set; } = null!;
}

public class SummaryStatisticsDto
{
    public int TotalTasks { get; set; }
    public int ActiveTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int OverdueTasks { get; set; }
    public int BlockedTasks { get; set; }
}

public class StatusDistributionDto
{
    public int Backlog { get; set; }
    public int InProgress { get; set; }
    public int Blocked { get; set; }
    public int Completed { get; set; }
}

public class PriorityDistributionDto
{
    public int Low { get; set; }
    public int Medium { get; set; }
    public int High { get; set; }
}

public class CategoryDistributionDto
{
    public string CategoryId { get; set; } = null!;
    public string CategoryName { get; set; } = null!;
    public string? CategoryColor { get; set; }
    public int TaskCount { get; set; }
}

public class TrendDataDto
{
    public DateTime Date { get; set; }
    public int CreatedCount { get; set; }
    public int CompletedCount { get; set; }
}

public class CompletionRateDto
{
    public double OverallCompletionRate { get; set; }
    public double MonthlyCompletionRate { get; set; }
}

public class UpcomingTasksDto
{
    public List<TodoItemResponseDto> TodayTasks { get; set; } = [];
    public List<TodoItemResponseDto> ThisWeekTasks { get; set; } = [];
}

public class ActivitySummaryDto
{
    public int TotalComments { get; set; }
    public int RecentActivities { get; set; }
    public string? MostActiveCategoryName { get; set; }
    public int MostActiveCategoryTaskCount { get; set; }
}
