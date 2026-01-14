namespace TaskFlow.Application.Contracts.CronJobs;

public interface IHangfireJobModule
{
    void ConfigureJobs();
    Task Execute(CancellationToken cancellationToken = default);
}