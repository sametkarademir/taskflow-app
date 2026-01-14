namespace TaskFlow.Application.Contracts.Reports;

public class DashboardStatisticsRequestDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateRangeType? DateRange { get; set; }
}
