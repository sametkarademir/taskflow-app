using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Audited;
using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;
using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Deletion;

namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces;

public interface IFullAuditedObject : 
    IAuditedObject,
    IDeletionAuditedObject
{
}

public interface IFullAuditedObject<TUser> : 
    IAuditedObject<TUser>, 
    IDeletionAuditedObject<TUser> 
    where TUser : IEntity
{
}