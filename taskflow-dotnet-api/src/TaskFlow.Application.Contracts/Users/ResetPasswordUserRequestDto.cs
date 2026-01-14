using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Users;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Users;

public class ResetPasswordUserRequestDto
{
    public string NewPassword { get; set; } = null!;
    public string ConfirmNewPassword { get; set; } = null!;
}

public class ResetPasswordUserRequestDtoValidator : AbstractValidator<ResetPasswordUserRequestDto>
{
    public ResetPasswordUserRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.NewPassword)
            .NotEmpty().WithMessage(localizer["ResetPasswordUserRequestDto:Password:IsRequired"])
            .MinimumLength(UserConsts.PasswordRequiredLength).WithMessage(localizer["ResetPasswordUserRequestDto:Password:MinLength", UserConsts.PasswordRequiredLength])
            .MaximumLength(UserConsts.PasswordMaxLength).WithMessage(localizer["ResetPasswordUserRequestDto:Password:MaxLength", UserConsts.PasswordMaxLength]);
        
        RuleFor(item => item.ConfirmNewPassword)
            .Equal(item => item.NewPassword).WithMessage(localizer["ResetPasswordUserRequestDto:ConfirmPassword:MustMatchPassword"]);
    }
}