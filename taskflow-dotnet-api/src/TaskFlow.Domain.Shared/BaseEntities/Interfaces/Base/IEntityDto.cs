namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

public interface IEntityDto
{
}

public interface IEntityDto<TKey> : IEntityDto
{
    TKey Id { get; set; }
}