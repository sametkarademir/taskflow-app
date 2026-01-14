using TaskFlow.Application.BackgroundJobs.InvalidateAllSessions;
using TaskFlow.Application.Contracts.BackgroundJobs;
using TaskFlow.Application.Contracts.BackgroundJobs.InvalidateAllSessions;
using TaskFlow.Application.Contracts.Profiles;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.Exceptions.Types;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using TaskFlow.Application.Contracts.Roles;

namespace TaskFlow.Application.Profiles;

public class ProfileAppService : IProfileAppService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IPasswordValidator _passwordValidator;
    private readonly ICurrentUser _currentUser;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IBackgroundJobExecutor _backgroundJobExecutor;
    private readonly IStringLocalizer<ApplicationResource> _localizer;


    public ProfileAppService(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher<User> passwordHasher,
        IPasswordValidator passwordValidator,
        ICurrentUser currentUser,
        IHttpContextAccessor httpContextAccessor,
        IBackgroundJobExecutor backgroundJobExecutor,
        IStringLocalizer<ApplicationResource> localizer)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _passwordValidator = passwordValidator;
        _currentUser = currentUser;
        _httpContextAccessor = httpContextAccessor;
        _backgroundJobExecutor = backgroundJobExecutor;
        _localizer = localizer;
        
        if (!_currentUser.IsAuthenticated)
        {
            throw new AppUnauthorizedException();
        }
    }

    public async Task<ProfileResponseDto> GetProfileAsync(CancellationToken cancellationToken = default)
    {
        var matchedUser = await _userRepository.GetAsync(
            predicate: u => u.Id == _currentUser.Id,
            include: q => q
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)!,
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        return new ProfileResponseDto
        {
            Id = matchedUser.Id,
            Email = matchedUser.Email,
            PhoneNumber = matchedUser.PhoneNumber,
            EmailConfirmed = matchedUser.EmailConfirmed,
            PhoneNumberConfirmed = matchedUser.PhoneNumberConfirmed,
            TwoFactorEnabled = matchedUser.TwoFactorEnabled,
            IsActive = matchedUser.IsActive,
            FirstName = matchedUser.FirstName,
            LastName = matchedUser.LastName,
            PasswordChangedTime = matchedUser.PasswordChangedTime,
            Roles = matchedUser.UserRoles.Select(ur => ur.Role!.Name).ToList(),
        };
    }

    public async Task ChangePasswordAsync(ChangePasswordUserRequestDto request, CancellationToken cancellationToken = default)
    {
        var matchedUser = await _userRepository.GetAsync(
            predicate: u => u.Id == _currentUser.Id,
            enableTracking: true,
            cancellationToken: cancellationToken
        );
        
        var verificationResult = _passwordHasher.VerifyHashedPassword(
            matchedUser,
            matchedUser.PasswordHash,
            request.OldPassword
        );
        
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            throw new AppValidationException(_localizer["ProfileAppService:ChangePasswordAsync:InvalidOldPassword"]);
        }
        
        var passwordValidationResult = _passwordValidator.Validate(request.NewPassword);
        if (!passwordValidationResult.Succeeded)
        {
            throw new AppValidationException(passwordValidationResult.Errors);
        }
        
        matchedUser.PasswordHash = _passwordHasher.HashPassword(matchedUser, request.NewPassword);
        matchedUser.PasswordChangedTime = DateTime.UtcNow;
        
        await _userRepository.UpdateAsync(matchedUser, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _backgroundJobExecutor.Enqueue<InvalidateAllSessionsBackgroundJob, InvalidateAllSessionsBackgroundJobArgs>(
            new InvalidateAllSessionsBackgroundJobArgs
            {
                UserId = matchedUser.Id,
                Reason = "Password changed by user",
                CorrelationId = _httpContextAccessor.HttpContext?.GetCorrelationId() ?? Guid.NewGuid()
            }
        );
    }
}