namespace TaskFlow.Application.Contracts.SnapshotLogs;

public interface ISnapshotLogAppService
{
    Task TakeSnapshotLogAsync();
}