namespace TaskFlow.Domain.Shared.Exceptions.Abstractions;

public interface IHasCorrelationId
{
    string? CorrelationId { get; }
}