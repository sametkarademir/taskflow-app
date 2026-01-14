using TaskFlow.Domain.RefreshTokens;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class RefreshTokenRepository(ApplicationDbContext context)
    : EfRepositoryBase<RefreshToken, Guid, ApplicationDbContext>(context), IRefreshTokenRepository
{
    public async Task RevokeRefreshTokensBySessionAsync(Guid sessionId, Guid userId, CancellationToken cancellationToken = default)
    {
        var matchedRefreshTokens = await GetAllAsync(
            predicate: rt => 
                rt.SessionId == sessionId &&
                rt.UserId == userId &&
                rt.IsRevoked == false &&
                rt.IsUsed == false,
            cancellationToken: cancellationToken
        );

        if (matchedRefreshTokens.Count == 0)
        {
            return;
        }

        var updatedRefreshTokens = matchedRefreshTokens.Select(rt =>
        {
            rt.IsRevoked = true;
            rt.RevokedTime = DateTime.UtcNow;

            return rt;
        }).ToList();

        await UpdateRangeAsync(updatedRefreshTokens, cancellationToken);
    }

    public async Task RevokeRefreshTokensBySessionsAsync(
        List<Guid> sessionIds, 
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var matchedRefreshTokens = await GetAllAsync(
            predicate: rt => 
                sessionIds.Contains(rt.SessionId) &&
                rt.UserId == userId &&
                rt.IsRevoked == false &&
                rt.IsUsed == false,
            cancellationToken: cancellationToken
        );

        if (matchedRefreshTokens.Count == 0)
        {
            return;
        }

        var updatedRefreshTokens = matchedRefreshTokens.Select(rt =>
        {
            rt.IsRevoked = true;
            rt.RevokedTime = DateTime.UtcNow;

            return rt;
        }).ToList();

        await UpdateRangeAsync(updatedRefreshTokens, cancellationToken);
    }

    public async Task<RefreshToken?> ValidateAndUseRefreshTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        var matchedRefreshToken = await FirstOrDefaultAsync(
            predicate: rt =>
                rt.Token == token &&
                rt.ExpiryTime > DateTime.UtcNow &&
                !rt.IsRevoked &&
                !rt.IsUsed,
            cancellationToken: cancellationToken
        );
        
        if (matchedRefreshToken == null)
        {
            return null;
        }
        
        matchedRefreshToken.IsUsed = true;
        matchedRefreshToken.RevokedTime = DateTime.UtcNow;
        await UpdateAsync(matchedRefreshToken, cancellationToken);
        
        return matchedRefreshToken;
    }
}