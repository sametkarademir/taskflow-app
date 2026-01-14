using TaskFlow.Domain.Shared.Categories;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Categories;

public class UpdateCategoryRequestDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ColorHex { get; set; }
}

public class UpdateCategoryRequestDtoValidator : AbstractValidator<UpdateCategoryRequestDto>
{
    public UpdateCategoryRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Name)
            .NotEmpty().WithMessage(localizer["UpdateCategoryRequestDto:Name:NotEmpty"])
            .MaximumLength(CategoryConsts.NameMaxLength).WithMessage(localizer["UpdateCategoryRequestDto:Name:MaxLength", CategoryConsts.NameMaxLength]);
        
        RuleFor(item => item.Description)
            .MaximumLength(CategoryConsts.DescriptionMaxLength).WithMessage(localizer["UpdateCategoryRequestDto:Description:MaxLength", CategoryConsts.DescriptionMaxLength]);
        
        RuleFor(item => item.ColorHex)
            .MaximumLength(CategoryConsts.ColorHexMaxLength).WithMessage(localizer["UpdateCategoryRequestDto:ColorHex:MaxLength", CategoryConsts.ColorHexMaxLength])
            .Matches(@"^#([A-Fa-f0-9]{6})$").WithMessage(localizer["UpdateCategoryRequestDto:ColorHex:InvalidFormat"])
            .When(item => !string.IsNullOrWhiteSpace(item.ColorHex));
    }
}

