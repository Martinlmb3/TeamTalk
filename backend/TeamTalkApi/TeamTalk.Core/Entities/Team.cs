using System.ComponentModel.DataAnnotations;

namespace TeamTalk.Core.Entities;

public class Team
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? Image { get; set; }

    // Navigation properties
    public virtual ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
    public virtual ICollection<Lobby> Lobbies { get; set; } = new List<Lobby>();
    public virtual ICollection<File> Files { get; set; } = new List<File>();
    public virtual ICollection<Invite> Invites { get; set; } = new List<Invite>();
    public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    public virtual ICollection<Training> Trainings { get; set; } = new List<Training>();
}