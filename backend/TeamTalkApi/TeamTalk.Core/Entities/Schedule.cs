using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Schedule
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Team")]
    public int TeamId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty; // e.g., "training", "match", "meeting"

    // Navigation properties
    public virtual Team Team { get; set; } = null!;
}