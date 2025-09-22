using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TeamTalkApi.TeamTalk.Core.Enums;
namespace TeamTalk.Core.Entities;

public class ActivityLog
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("User")]
    public Guid UserId { get; set; }

    [Required]
    public ActivityLogAction Action { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public string? Metadata { get; set; } // JSON data

    // Navigation properties
    public virtual User User { get; set; } = null!;
}