using TaskFlow.Domain.Shared.Categories;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Categories;

public class CreateCategoryRequestDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ColorHex { get; set; }
}

public class CreateCategoryRequestDtoValidator : AbstractValidator<CreateCategoryRequestDto>
{
    public CreateCategoryRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Name)
            .NotEmpty().WithMessage(localizer["CreateCategoryRequestDto:Name:NotEmpty"])
            .MaximumLength(CategoryConsts.NameMaxLength).WithMessage(localizer["CreateCategoryRequestDto:Name:MaxLength", CategoryConsts.NameMaxLength]);
        
        RuleFor(item => item.Description)
            .MaximumLength(CategoryConsts.DescriptionMaxLength).WithMessage(localizer["CreateCategoryRequestDto:Description:MaxLength", CategoryConsts.DescriptionMaxLength]);
        
        RuleFor(item => item.ColorHex)
            .MaximumLength(CategoryConsts.ColorHexMaxLength).WithMessage(localizer["CreateCategoryRequestDto:ColorHex:MaxLength", CategoryConsts.ColorHexMaxLength])
            .Matches(@"^#([A-Fa-f0-9]{6})$").WithMessage(localizer["CreateCategoryRequestDto:ColorHex:InvalidFormat"])
            .When(item => !string.IsNullOrWhiteSpace(item.ColorHex));
    }
}

