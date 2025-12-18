using System.ComponentModel.DataAnnotations;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalk.Core.DTOs.Auth;

/*Result after successful login/signup*/
public class AuthResponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required Guid UserId { get; set; }
    public required string FirstName { get; set; }
    public required UserRole Role { get; set; }
    public string? ProfilePicture { get; set; }
}

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}

public class SignupRequestDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public required string FirstName { get; set; }

    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public required string LastName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }

    [Required]
    [Compare("Password")]
    public required string ConfirmPassword { get; set; }

    // Role is now optional - users will select it after registration
    public string? Role { get; set; }
}