using Hangfire;

namespace TaskFlow.Application.Contracts.BackgroundJobs;

public interface IBackgroundJob<in TParameter> where TParameter : class
{
    Task Execute(TParameter args, IJobCancellationToken cancellationToken);
}