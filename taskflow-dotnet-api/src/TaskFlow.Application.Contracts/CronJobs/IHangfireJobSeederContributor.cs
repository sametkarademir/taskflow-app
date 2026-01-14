namespace TaskFlow.Application.Contracts.CronJobs;

public interface IHangfireJobSeederContributor
{
    Task SeedAsync();
}