using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Training
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Team")]
    public int TeamId { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    [ForeignKey("Coach")]
    public int CoachId { get; set; }

    public string? Notes { get; set; }

    // Navigation properties
    public virtual Team Team { get; set; } = null!;
    public virtual User Coach { get; set; } = null!;
}