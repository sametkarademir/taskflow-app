using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.TodoComments;

public class GetListTodoCommentsRequestDto : GetListRequestDto
{
}

public class GetListTodoCommentsRequestDtoValidator : AbstractValidator<GetListTodoCommentsRequestDto>
{
    public GetListTodoCommentsRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}

