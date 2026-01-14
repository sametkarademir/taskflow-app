namespace TaskFlow.Domain.Shared.Exceptions.Abstractions;

public interface IHasStatusCode
{
    int StatusCode { get; }
}