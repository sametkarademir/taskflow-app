using TaskFlow.Domain.ConfirmationCodes;
using TaskFlow.Domain.Shared.ConfirmationCodes;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IConfirmationCodeRepository : IRepository<ConfirmationCode, Guid>
{
    Task<ConfirmationCode> CreateConfirmationCodeAsync(
        Guid userId,
        ConfirmationCodeTypes types,
        int expiryMinutes,
        CancellationToken cancellationToken = default
    );

    Task<ConfirmationCode?> ValidateAndUseConfirmationCodeAsync(
        Guid userId,
        ConfirmationCodeTypes types,
        string code,
        CancellationToken cancellationToken = default
    );
}