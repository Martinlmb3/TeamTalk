using System.ComponentModel.DataAnnotations;

namespace TeamTalk.Core.Entities;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ProfilePictureUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLogin { get; set; }

    // Navigation properties
    public virtual ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
    public virtual ICollection<Team> OwnedTeams { get; set; } = new List<Team>();
    public virtual ICollection<LobbyUser> LobbyUsers { get; set; } = new List<LobbyUser>();
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    public virtual ICollection<DirectMessage> SentDirectMessages { get; set; } = new List<DirectMessage>();
    public virtual ICollection<DirectMessage> ReceivedDirectMessages { get; set; } = new List<DirectMessage>();
    public virtual ICollection<File> UploadedFiles { get; set; } = new List<File>();
    public virtual ICollection<Invite> SentInvites { get; set; } = new List<Invite>();
    public virtual ICollection<Training> CoachedTrainings { get; set; } = new List<Training>();
    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
}