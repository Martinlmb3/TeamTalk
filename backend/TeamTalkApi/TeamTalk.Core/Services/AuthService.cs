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
            UserId = user.Id,
            FirstName = user.FirstName,
            Role = user.Role,
            ProfilePicture = user.ProfilePicture
        };
    }

    public async Task<AuthResponseDto?> Register(SignupRequestDto signupDto)
    {
        var existingUser = await GetUserByEmail(signupDto.Email);
        if (existingUser != null)
        {
            return null;
        }

        var user = signupDto.Adapt<User>();
        user.Id = Guid.NewGuid();
        user.PasswordHash = _passwordHasher.HashPassword(user, signupDto.Password);
        user.Role = UserRole.User;
        user.CreatedAt = DateTime.UtcNow;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        await _context.SaveChangesAsync();

        var accessToken = _jwtTokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
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
