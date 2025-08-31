using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class ActivityLog
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty; // e.g., "sent message", "joined team", "uploaded file"

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public string? Metadata { get; set; } // JSON data

    // Navigation properties
    public virtual User User { get; set; } = null!;
}