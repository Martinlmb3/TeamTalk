using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Message
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Lobby")]
    public Guid LobbyId { get; set; }

    [ForeignKey("User")]
    public Guid UserId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Lobby Lobby { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual ICollection<MessageRead> MessageReads { get; set; } = new List<MessageRead>();
    public virtual ICollection<LobbyUser> ReadByLobbyUsers { get; set; } = new List<LobbyUser>();
}