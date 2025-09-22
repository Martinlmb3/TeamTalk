using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class MessageRead
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Message")]
    public Guid MessageId { get; set; }

    [ForeignKey("User")]
    public Guid UserId { get; set; }

    public DateTime ReadAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Message Message { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}