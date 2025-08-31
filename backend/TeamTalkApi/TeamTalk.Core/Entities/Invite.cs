using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Invite
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Sender")]
    public int SenderId { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string ReceiverEmail { get; set; } = string.Empty;

    [ForeignKey("Team")]
    public int TeamId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "pending"; // e.g., "pending", "accepted", "declined"

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User Sender { get; set; } = null!;
    public virtual Team Team { get; set; } = null!;
}