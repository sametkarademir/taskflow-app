using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Deletion;

public interface IMayHaveDeleter
{
    Guid? DeleterId { get; set; }
}

public interface IMayHaveDeleter<TUser> : IMayHaveDeleter
    where TUser : IEntity
{
    TUser? Deleter { get; set; }
}