using TaskFlow.Domain.RefreshTokens;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IRefreshTokenRepository : IRepository<RefreshToken, Guid>
{
    Task RevokeRefreshTokensBySessionAsync(
        Guid sessionId,
        Guid userId,
        CancellationToken cancellationToken = default
    );
    
    Task RevokeRefreshTokensBySessionsAsync(
        List<Guid> sessionIds,
        Guid userId,
        CancellationToken cancellationToken = default
    );
    
    Task<RefreshToken?> ValidateAndUseRefreshTokenAsync(
        string token,
        CancellationToken cancellationToken = default
    );
}