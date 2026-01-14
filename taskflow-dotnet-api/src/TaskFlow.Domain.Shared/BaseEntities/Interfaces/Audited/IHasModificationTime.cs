namespace TaskFlow.Domain.Shared.BaseEntities.Interfaces.Audited;

public interface IHasModificationTime
{
    DateTime? LastModificationTime { get; set; }
}