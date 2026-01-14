using TaskFlow.Domain.Shared.BaseEntities.Interfaces.Base;

namespace TaskFlow.Domain.Shared.Repositories;

public interface IQueryableRepository<out TEntity> where TEntity : class, IEntity
{
    /// <summary>
    /// Gets a queryable instance for the entity
    /// </summary>
    /// <returns>A queryable instance of the entity</returns>
    IQueryable<TEntity> AsQueryable();
}