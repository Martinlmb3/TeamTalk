using TeamTalk.Core.DTOs.Auth;
using TeamTalk.Core.Entities;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalk.Core.Interfaces;

public interface IAuthUserService
{
    Task<AuthResponseDto?> Login(LoginRequestDto loginDto);
    Task<AuthResponseDto?> Register(SignupRequestDto signupDto);
    Task<AuthResponseDto?> Register(SignupRequestDto signupDto, AuthProvider provider);
    Task<User?> GetUserByEmail(string email);
    Task<bool> ValidatePassword(string password, string hashedPassword);
}