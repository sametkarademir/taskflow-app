namespace TaskFlow.Application.Contracts.Reports;

public interface IReportAppService
{
    Task<DashboardStatisticsResponseDto> GetDashboardStatisticsAsync(DashboardStatisticsRequestDto request, CancellationToken cancellationToken = default);
}
