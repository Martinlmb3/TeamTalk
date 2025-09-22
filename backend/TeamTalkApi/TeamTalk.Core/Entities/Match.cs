using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Match
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Team")]
    public Guid TeamId { get; set; }

    [Required]
    [MaxLength(100)]
    public string OpponentName { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Location { get; set; }

    public DateTime ScheduledAt { get; set; }

    [MaxLength(50)]
    public string? Result { get; set; } // e.g., "win", "loss", "draw"

    // Navigation properties
    public virtual Team Team { get; set; } = null!;
}