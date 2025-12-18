using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mapster;
using TeamTalk.Core.DTOs.Auth;
using TeamTalk.Core.Entities;
using TeamTalk.Core.Interfaces;
using TeamTalkApi.Infrastructure.Data;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalk.Core.Services;

public class AuthService : IAuthUserService
{
    private readonly TeamTalkDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        TeamTalkDbContext context, 
        IPasswordHasher<User> passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResponseDto?> Login(LoginRequestDto loginDto)
    {
        var user = await GetUserByEmail(loginDto.Email);
        if (user == null)
        {
            return null;
        }

        var passwordValid = await ValidatePassword(loginDto.Password, user.PasswordHash);
        if (!passwordValid)
        {
            return null;
        }

        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        
        await _context.SaveChangesAsync();

        var accessToken = _jwtTokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.Id,
            FirstName = user.FirstName,
            Role = user.Role,
            ProfilePicture = user.ProfilePicture
        };
    }

    public async Task<AuthResponseDto?> Register(SignupRequestDto signupDto)
    {
        return await Register(signupDto, AuthProvider.Jwt);
    }

    public async Task<AuthResponseDto?> Register(SignupRequestDto signupDto, AuthProvider provider)
    {
        var existingUser = await GetUserByEmail(signupDto.Email);
        if (existingUser != null)
        {
            return null;
        }

        // Parse role from string to enum, default to Player if invalid or not provided
        var userRole = !string.IsNullOrEmpty(signupDto.Role) && Enum.TryParse<UserRole>(signupDto.Role, true, out var parsedRole)
            ? parsedRole
            : UserRole.Player;

        // Create user explicitly instead of using Adapt
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = signupDto.FirstName,
            LastName = signupDto.LastName,
            Email = signupDto.Email,
            Role = userRole,
            AuthProvider = provider,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, signupDto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        await _context.SaveChangesAsync();

        var accessToken = _jwtTokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.Id,
            FirstName = user.FirstName,
            Role = user.Role,
            ProfilePicture = user.ProfilePicture
        };
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public Task<bool> ValidatePassword(string password, string hashedPassword)
    {
        var user = new User(); // Temporary user for password verification
        var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, password);
        return Task.FromResult(result == PasswordVerificationResult.Success);
    }
}
