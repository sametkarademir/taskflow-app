using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

namespace TaskFlow.Application.Contracts.BaseEntities;

[Serializable]
public abstract class EntityDto : IEntityDto
{
}

[Serializable]
public abstract class EntityDto<TKey> : EntityDto, IEntityDto<TKey>
{
    public TKey Id { get; set; } = default!;
}