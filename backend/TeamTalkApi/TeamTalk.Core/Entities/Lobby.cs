using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTalk.Core.Entities;

public class Lobby
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Team")]
    public int TeamId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Team Team { get; set; } = null!;
    public virtual ICollection<LobbyUser> LobbyUsers { get; set; } = new List<LobbyUser>();
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}