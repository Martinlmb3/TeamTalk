using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class UserTeam
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [ForeignKey("Team")]
    public int TeamId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "member"; // e.g., "member", "coach", "admin"

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Team Team { get; set; } = null!;
}