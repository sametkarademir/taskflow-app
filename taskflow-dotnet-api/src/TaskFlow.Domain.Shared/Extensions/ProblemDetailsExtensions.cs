using System.Text.Json;
using TaskFlow.Domain.Shared.Exceptions.Abstractions;

namespace TaskFlow.Domain.Shared.Extensions;

public static class ProblemDetailsExtensions
{
    public static string ToJson<TProblemDetail>(this TProblemDetail details)
        where TProblemDetail : AppProblemDetails
    {
        return JsonSerializer.Serialize(details);
    }
}