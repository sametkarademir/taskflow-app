using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.Repositories;

public interface IUserRepository : IRepository<User, Guid>
{
    Task<bool> ExistsByEmailAsync(string email, Guid? id = null, CancellationToken cancellationToken = default);
    Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken = default);
}