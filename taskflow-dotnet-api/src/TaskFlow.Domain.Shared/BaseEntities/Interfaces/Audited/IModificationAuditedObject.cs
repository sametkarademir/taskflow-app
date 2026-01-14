using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Audited;

public interface IModificationAuditedObject : 
    IHasModificationTime,
    IMayHaveModifier
{
}

public interface IModificationAuditedObject<TUser> : 
    IModificationAuditedObject,
    IMayHaveModifier<TUser>
    where TUser : IEntity
{
}