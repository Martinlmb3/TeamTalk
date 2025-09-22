using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class DirectMessage
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Sender")]
    public Guid SenderId { get; set; }

    [ForeignKey("Receiver")]
    public Guid ReceiverId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReadAt { get; set; }

    // Navigation properties
    public virtual User Sender { get; set; } = null!;
    public virtual User Receiver { get; set; } = null!;
}