using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;
using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Creation;

namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Audited;

public interface IAuditedObject :
    ICreationAuditedObject,
    IModificationAuditedObject
{
}

public interface IAuditedObject<TUser> : 
    ICreationAuditedObject<TUser>, 
    IModificationAuditedObject<TUser>
    where TUser : IEntity
{
}