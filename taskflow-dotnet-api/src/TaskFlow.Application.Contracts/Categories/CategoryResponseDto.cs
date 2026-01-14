using TaskFlow.Application.Contracts.BaseEntities;

namespace TaskFlow.Application.Contracts.Categories;

public class CategoryResponseDto : EntityDto<Guid>
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ColorHex { get; set; }
}

