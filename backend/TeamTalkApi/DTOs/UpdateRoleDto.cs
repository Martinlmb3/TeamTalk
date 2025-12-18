using System.ComponentModel.DataAnnotations;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalkApi.DTOs
{
    /// <summary>
    /// DTO for updating user role after registration
    /// </summary>
    public class UpdateRoleDto
    {
        [Required(ErrorMessage = "Role is required")]
        public required UserRole Role { get; set; }
    }
}
