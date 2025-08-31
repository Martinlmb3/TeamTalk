using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Message
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Lobby")]
    public int LobbyId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Lobby Lobby { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}