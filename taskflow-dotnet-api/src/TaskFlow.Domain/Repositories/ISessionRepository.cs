using TaskFlow.Domain.Sessions;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface ISessionRepository : IRepository<Session, Guid>
{
    Task<List<Guid>> GetExcessSessionIdsAsync(
        Guid userId,
        int skipCount = 5,
        CancellationToken cancellationToken = default
    );
    
    Task<Session?> RevokeSessionByUserAsync(
        Guid sessionId,
        Guid userId,
        CancellationToken cancellationToken = default
    );
    
    Task RevokeSessionsByUserAsync(
        List<Guid> sessionId,
        Guid userId,
        CancellationToken cancellationToken = default
    );
}