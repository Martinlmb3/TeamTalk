using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class LobbyUser
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Lobby")]
    public int LobbyId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Lobby Lobby { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}