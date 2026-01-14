namespace TaskFlow.Domain.Shared.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, Inherited = true)]
public class DisableAuditLogAttribute : Attribute
{
    
}