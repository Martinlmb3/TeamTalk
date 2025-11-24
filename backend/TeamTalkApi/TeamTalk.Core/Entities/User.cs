using System.ComponentModel.DataAnnotations;
using TeamTalkApi.TeamTalk.Core.Enums;
namespace TeamTalk.Core.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    [Required]
    public AuthProvider AuthProvider { get; set; } = AuthProvider.Jwt;

    [MaxLength(100)]
    public string? City { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Country { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? ProfilePicture { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? RefreshToken { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
    public virtual ICollection<LobbyUser> LobbyUsers { get; set; } = new List<LobbyUser>();
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    public virtual ICollection<DirectMessage> SentDirectMessages { get; set; } = new List<DirectMessage>();
    public virtual ICollection<DirectMessage> ReceivedDirectMessages { get; set; } = new List<DirectMessage>();
    public virtual ICollection<File> UploadedFiles { get; set; } = new List<File>();
    public virtual ICollection<Invite> SentInvites { get; set; } = new List<Invite>();
    public virtual ICollection<Training> CoachedTrainings { get; set; } = new List<Training>();
    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
    public virtual ICollection<MessageRead> MessageReads { get; set; } = new List<MessageRead>();
}