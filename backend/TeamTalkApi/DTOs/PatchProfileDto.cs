using System.ComponentModel.DataAnnotations;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalkApi.DTOs
{
    /// <summary>
    /// DTO for partial profile updates (PATCH). All fields are optional.
    /// Only the fields provided will be updated.
    /// </summary>
    public class PatchProfileDto
    {
        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        [MaxLength(100)]
        public string? ProfilePicture { get; set; }

        public AuthProvider? Provider { get; set; }
    }
}
