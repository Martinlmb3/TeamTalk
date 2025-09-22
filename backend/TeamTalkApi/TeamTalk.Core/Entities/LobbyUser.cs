using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class LobbyUser
{
    [Key]
    public Guid Id { get; set; }

    [ForeignKey("Lobby")]
    public Guid LobbyId { get; set; }

    [ForeignKey("User")]
    public Guid UserId { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("LastReadMessage")]
    public Guid? LastReadMessageId { get; set; }

    // Navigation properties
    public virtual Lobby Lobby { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual Message? LastReadMessage { get; set; }
}