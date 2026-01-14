namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

public interface IEntity
{
}

public interface IEntity<out TKey> : IEntity
{
    TKey Id { get; }
}