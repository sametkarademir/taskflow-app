namespace TaskFlow.Domain.Shared.Exceptions.Abstractions;

public interface IHasErrorCode
{
    string? ErrorCode { get; }
}