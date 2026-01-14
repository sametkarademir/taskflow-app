namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Creation;

public interface IHasCreationTime
{
    DateTime CreationTime { get; set; }
}