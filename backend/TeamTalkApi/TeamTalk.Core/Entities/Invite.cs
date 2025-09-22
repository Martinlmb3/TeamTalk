using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TeamTalkApi.TeamTalk.Core.Enums;
namespace TeamTalk.Core.Entities;

public class Invite
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Sender")]
    public Guid SenderId { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string ReceiverEmail { get; set; } = string.Empty;

    [ForeignKey("Team")]
    public Guid TeamId { get; set; }

    [Required]
    [MaxLength(50)]
    public InviteStatus InviteStatus { get; set; } // e.g., "pending", "accepted", "declined"

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User Sender { get; set; } = null!;
    public virtual Team Team { get; set; } = null!;
}