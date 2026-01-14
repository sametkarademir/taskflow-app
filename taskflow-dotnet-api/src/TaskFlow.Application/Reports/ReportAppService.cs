using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Contracts.Reports;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.Exceptions.Types;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.TodoComments;
using Microsoft.Extensions.Localization;
using TaskFlow.Application.Contracts.Users;

namespace TaskFlow.Application.Reports;

public class ReportAppService : IReportAppService
{
    private readonly ITodoItemRepository _todoItemRepository;
    private readonly IActivityLogRepository _activityLogRepository;
    private readonly ITodoCommentRepository _todoCommentRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;
    private readonly IStringLocalizer<ApplicationResource> _localizer;

    public ReportAppService(
        ITodoItemRepository todoItemRepository,
        IActivityLogRepository activityLogRepository,
        ITodoCommentRepository todoCommentRepository,
        IMapper mapper,
        ICurrentUser currentUser,
        IStringLocalizer<ApplicationResource> localizer)
    {
        _todoItemRepository = todoItemRepository;
        _activityLogRepository = activityLogRepository;
        _todoCommentRepository = todoCommentRepository;
        _mapper = mapper;
        _currentUser = currentUser;
        _localizer = localizer;

        if (!_currentUser.IsAuthenticated || _currentUser.Id == null)
        {
            throw new AppUnauthorizedException();
        }
    }

    public async Task<DashboardStatisticsResponseDto> GetDashboardStatisticsAsync(DashboardStatisticsRequestDto request, CancellationToken cancellationToken = default)
    {
        var (startDate, endDate) = CalculateDateRange(request);

        var baseQuery = _todoItemRepository.AsQueryable()
            .Where(ti => ti.UserId == _currentUser.Id);

        // Apply date filter if provided
        if (startDate.HasValue && endDate.HasValue)
        {
            baseQuery = baseQuery.Where(ti => ti.CreationTime >= startDate.Value && ti.CreationTime <= endDate.Value);
        }

        var allTasks = await baseQuery
            .Include(ti => ti.Category)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var now = DateTime.UtcNow;
        var today = now.Date;
        var endOfToday = today.AddDays(1).AddTicks(-1);
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7).AddTicks(-1);

        // Summary Statistics
        var summary = new SummaryStatisticsDto
        {
            TotalTasks = allTasks.Count,
            ActiveTasks = allTasks.Count(ti => !ti.IsArchived),
            CompletedTasks = allTasks.Count(ti => ti.Status == TodoStatus.Completed),
            OverdueTasks = allTasks.Count(ti => !ti.IsArchived && ti.DueDate.HasValue && ti.DueDate.Value < now && ti.Status != TodoStatus.Completed),
            BlockedTasks = allTasks.Count(ti => ti.Status == TodoStatus.Blocked),
        };

        // Status Distribution
        var statusDistribution = new StatusDistributionDto
        {
            Backlog = allTasks.Count(ti => ti.Status == TodoStatus.Backlog),
            InProgress = allTasks.Count(ti => ti.Status == TodoStatus.InProgress),
            Blocked = allTasks.Count(ti => ti.Status == TodoStatus.Blocked),
            Completed = allTasks.Count(ti => ti.Status == TodoStatus.Completed),
        };

        // Priority Distribution
        var priorityDistribution = new PriorityDistributionDto
        {
            Low = allTasks.Count(ti => ti.Priority == TodoPriority.Low),
            Medium = allTasks.Count(ti => ti.Priority == TodoPriority.Medium),
            High = allTasks.Count(ti => ti.Priority == TodoPriority.High),
        };

        // Category Distribution
        var categoryDistribution = allTasks
            .Where(ti => ti.Category != null)
            .GroupBy(ti => new { ti.CategoryId, CategoryName = ti.Category!.Name, CategoryColor = ti.Category.ColorHex })
            .Select(g => new CategoryDistributionDto
            {
                CategoryId = g.Key.CategoryId.ToString(),
                CategoryName = g.Key.CategoryName,
                CategoryColor = g.Key.CategoryColor,
                TaskCount = g.Count(),
            })
            .OrderByDescending(c => c.TaskCount)
            .ToList();

        // Trend Data (daily created/completed for selected period)
        var trendData = new List<TrendDataDto>();
        if (startDate.HasValue && endDate.HasValue)
        {
            var currentDate = startDate.Value.Date;
            var endDateOnly = endDate.Value.Date;

            while (currentDate <= endDateOnly)
            {
                var nextDate = currentDate.AddDays(1);
                var currentDateUtc = DateTime.SpecifyKind(currentDate, DateTimeKind.Utc);
                var nextDateUtc = DateTime.SpecifyKind(nextDate, DateTimeKind.Utc);
                
                var createdCount = allTasks.Count(ti => 
                    ti.CreationTime >= currentDateUtc && ti.CreationTime < nextDateUtc);
                var completedCount = allTasks.Count(ti => 
                    ti.Status == TodoStatus.Completed && 
                    ti.CreationTime <= nextDateUtc &&
                    (ti.ArchivedTime == null || ti.ArchivedTime >= currentDateUtc));

                trendData.Add(new TrendDataDto
                {
                    Date = currentDateUtc,
                    CreatedCount = createdCount,
                    CompletedCount = completedCount,
                });

                currentDate = nextDate;
            }
        }

        // Completion Rate
        var totalTasksForCompletion = allTasks.Count(ti => !ti.IsArchived);
        var completedTasksForCompletion = allTasks.Count(ti => !ti.IsArchived && ti.Status == TodoStatus.Completed);
        var overallCompletionRate = totalTasksForCompletion > 0 
            ? (double)completedTasksForCompletion / totalTasksForCompletion * 100 
            : 0;

        var monthlyStart = new DateTime(now.Year, now.Month, 1);
        var monthlyTasks = allTasks.Where(ti => !ti.IsArchived && ti.CreationTime >= monthlyStart).ToList();
        var monthlyCompleted = monthlyTasks.Count(ti => ti.Status == TodoStatus.Completed);
        var monthlyCompletionRate = monthlyTasks.Count > 0 
            ? (double)monthlyCompleted / monthlyTasks.Count * 100 
            : 0;

        var completionRate = new CompletionRateDto
        {
            OverallCompletionRate = Math.Round(overallCompletionRate, 2),
            MonthlyCompletionRate = Math.Round(monthlyCompletionRate, 2),
        };

        // Upcoming Tasks
        var todayTasks = allTasks
            .Where(ti => !ti.IsArchived && ti.DueDate.HasValue && 
                         ti.DueDate.Value.Date == today)
            .OrderBy(ti => ti.DueDate)
            .Take(10)
            .ToList();

        var thisWeekTasks = allTasks
            .Where(ti => !ti.IsArchived && ti.DueDate.HasValue && 
                         ti.DueDate.Value >= today && ti.DueDate.Value <= endOfWeek)
            .OrderBy(ti => ti.DueDate)
            .Take(10)
            .ToList();

        var upcomingTasks = new UpcomingTasksDto
        {
            TodayTasks = _mapper.Map<List<TodoItemResponseDto>>(todayTasks),
            ThisWeekTasks = _mapper.Map<List<TodoItemResponseDto>>(thisWeekTasks),
        };

        // Activity Summary
        var userTodoItemIds = allTasks.Select(ti => ti.Id).ToList();
        var totalComments = await _todoCommentRepository.GetAllAsync(
            predicate: tc => userTodoItemIds.Contains(tc.TodoItemId),
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var recentActivities = await _activityLogRepository.GetAllAsync(
            predicate: al => userTodoItemIds.Contains(al.TodoItemId) && 
                            al.CreationTime >= now.AddDays(-7),
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var mostActiveCategory = categoryDistribution.OrderByDescending(c => c.TaskCount).FirstOrDefault();

        var activitySummary = new ActivitySummaryDto
        {
            TotalComments = totalComments.Count,
            RecentActivities = recentActivities.Count,
            MostActiveCategoryName = mostActiveCategory?.CategoryName,
            MostActiveCategoryTaskCount = mostActiveCategory?.TaskCount ?? 0,
        };

        return new DashboardStatisticsResponseDto
        {
            Summary = summary,
            StatusDistribution = statusDistribution,
            PriorityDistribution = priorityDistribution,
            CategoryDistribution = categoryDistribution,
            TrendData = trendData,
            CompletionRate = completionRate,
            UpcomingTasks = upcomingTasks,
            ActivitySummary = activitySummary,
        };
    }

    private (DateTime?, DateTime?) CalculateDateRange(DashboardStatisticsRequestDto request)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;

        if (request.DateRange.HasValue)
        {
            var weekStart = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
            
            return request.DateRange.Value switch
            {
                DateRangeType.Today => (
                    DateTime.SpecifyKind(today, DateTimeKind.Utc), 
                    DateTime.SpecifyKind(today.AddDays(1).AddTicks(-1), DateTimeKind.Utc)
                ),
                DateRangeType.ThisWeek => (
                    DateTime.SpecifyKind(weekStart, DateTimeKind.Utc),
                    DateTime.SpecifyKind(weekStart.AddDays(7).AddTicks(-1), DateTimeKind.Utc)
                ),
                DateRangeType.ThisMonth => (
                    DateTime.SpecifyKind(new DateTime(today.Year, today.Month, 1), DateTimeKind.Utc),
                    DateTime.SpecifyKind(new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month)).AddDays(1).AddTicks(-1), DateTimeKind.Utc)
                ),
                DateRangeType.Last30Days => (
                    DateTime.SpecifyKind(today.AddDays(-30), DateTimeKind.Utc),
                    DateTime.SpecifyKind(today.AddDays(1).AddTicks(-1), DateTimeKind.Utc)
                ),
                DateRangeType.Custom => (
                    request.StartDate.HasValue ? DateTime.SpecifyKind(request.StartDate.Value.Date, DateTimeKind.Utc) : null,
                    request.EndDate.HasValue ? DateTime.SpecifyKind(request.EndDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc) : null
                ),
                DateRangeType.AllTime => (null, null),
                _ => (null, null),
            };
        }

        // If custom dates provided directly
        if (request.StartDate.HasValue && request.EndDate.HasValue)
        {
            return (
                DateTime.SpecifyKind(request.StartDate.Value.Date, DateTimeKind.Utc),
                DateTime.SpecifyKind(request.EndDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc)
            );
        }

        // Default: All Time
        return (null, null);
    }
}
