using System.ComponentModel.DataAnnotations;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalkApi.DTOs
{
    public class UpdateProfileDto
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? ProfilePicture { get; set; }

        public AuthProvider Provider { get; set; } = AuthProvider.Jwt;
    }
}
