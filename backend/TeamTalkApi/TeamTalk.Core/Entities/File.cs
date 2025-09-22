using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class File
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Uploader")]
    public Guid UploaderId { get; set; }

    [ForeignKey("Team")]
    public Guid? TeamId { get; set; } // Optional FK

    [Required]
    [MaxLength(255)]
    public string Filename { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string FileUrl { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User Uploader { get; set; } = null!;
    public virtual Team? Team { get; set; }
}