namespace TaskFlow.Application.Contracts.Email;

public interface IEmailAppService
{
    Task SendEmailAsync(SendEmailRequestDto request, CancellationToken cancellationToken = default);
}