using TaskFlow.Application.Contracts.Common.Results;

namespace TaskFlow.Application.Contracts.Users;

public interface IPasswordValidator
{
    ValidationResult Validate(string password);
}