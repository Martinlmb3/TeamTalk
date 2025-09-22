using TeamTalk.Core.DTOs.Auth;
using TeamTalk.Core.Entities;

namespace TeamTalk.Core.Interfaces;

public interface IAuthUserService
{
    Task<AuthResponseDto?> Login(LoginRequestDto loginDto);
    Task<AuthResponseDto?> Register(SignupRequestDto signupDto);
    Task<User?> GetUserByEmail(string email);
    Task<bool> ValidatePassword(string password, string hashedPassword);
}