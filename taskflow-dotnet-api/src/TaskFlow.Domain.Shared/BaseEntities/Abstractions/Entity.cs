using TaskFlow.Domain.Shared.Attributes;
using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

namespace TaskFlow.Domain.Shared.BaseEntities.Abstractions;

[Serializable]
public abstract class Entity : IEntity
{
    protected Entity()
    {
    }
}

[Serializable]
public abstract class Entity<TKey> : Entity, IEntity<TKey>
{
    [DisableAuditLog]
    public virtual TKey Id { get; set; } = default!;

    protected Entity()
    {
    }

    protected Entity(TKey id)
    {
        Id = id;
    }
}