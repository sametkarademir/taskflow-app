using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Roles;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Roles;

public class UpdateRoleRequestDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}

public class UpdateRoleRequestDtoValidator : AbstractValidator<UpdateRoleRequestDto>
{
    public UpdateRoleRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Name)
            .NotEmpty().WithMessage(localizer["UpdateRoleRequestDto:Name:NotEmpty"])
            .MaximumLength(RoleConsts.NameMaxLength).WithMessage(localizer["UpdateRoleRequestDto:Name:MaxLength", RoleConsts.NameMaxLength]);
        
        RuleFor(item => item.Description)
            .MaximumLength(RoleConsts.DescriptionMaxLength).WithMessage(localizer["UpdateRoleRequestDto:Description:MaxLength", RoleConsts.DescriptionMaxLength]);
    }
}