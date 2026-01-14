using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Audited;

public interface IMayHaveModifier
{
    Guid? LastModifierId { get; set; }
}

public interface IMayHaveModifier<TUser> : IMayHaveModifier
    where TUser : IEntity
{
    TUser? LastModifier { get; set; }
}