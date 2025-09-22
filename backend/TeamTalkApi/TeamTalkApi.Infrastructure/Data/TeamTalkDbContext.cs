using Microsoft.EntityFrameworkCore;
using TeamTalk.Core.Entities;
using FileEntity = TeamTalk.Core.Entities.File;

namespace TeamTalkApi.Infrastructure.Data;

public class TeamTalkDbContext : DbContext
{
    public TeamTalkDbContext(DbContextOptions<TeamTalkDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<UserTeam> UserTeams { get; set; }
    public DbSet<Lobby> Lobbies { get; set; }
    public DbSet<LobbyUser> LobbyUsers { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<DirectMessage> DirectMessages { get; set; }
    public DbSet<FileEntity> Files { get; set; }
    public DbSet<Invite> Invites { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Training> Trainings { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<MessageRead> MessageReads { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
        });


        modelBuilder.Entity<UserTeam>(entity =>
        {
            entity.HasOne(ut => ut.User)
                  .WithMany(u => u.UserTeams)
                  .HasForeignKey(ut => ut.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ut => ut.Team)
                  .WithMany(t => t.UserTeams)
                  .HasForeignKey(ut => ut.TeamId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.TeamId }).IsUnique();
        });

        modelBuilder.Entity<Lobby>(entity =>
        {
            entity.HasOne(l => l.Team)
                  .WithMany(t => t.Lobbies)
                  .HasForeignKey(l => l.TeamId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LobbyUser>(entity =>
        {
            entity.HasOne(lu => lu.Lobby)
                  .WithMany(l => l.LobbyUsers)
                  .HasForeignKey(lu => lu.LobbyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(lu => lu.User)
                  .WithMany(u => u.LobbyUsers)
                  .HasForeignKey(lu => lu.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.LobbyId, e.UserId }).IsUnique();

            entity.HasOne(lu => lu.LastReadMessage)
                  .WithMany(m => m.ReadByLobbyUsers)
                  .HasForeignKey(lu => lu.LastReadMessageId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasOne(m => m.Lobby)
                  .WithMany(l => l.Messages)
                  .HasForeignKey(m => m.LobbyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.User)
                  .WithMany(u => u.Messages)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DirectMessage>(entity =>
        {
            entity.HasOne(dm => dm.Sender)
                  .WithMany(u => u.SentDirectMessages)
                  .HasForeignKey(dm => dm.SenderId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(dm => dm.Receiver)
                  .WithMany(u => u.ReceivedDirectMessages)
                  .HasForeignKey(dm => dm.ReceiverId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<FileEntity>(entity =>
        {
            entity.HasOne(f => f.Uploader)
                  .WithMany(u => u.UploadedFiles)
                  .HasForeignKey(f => f.UploaderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(f => f.Team)
                  .WithMany(t => t.Files)
                  .HasForeignKey(f => f.TeamId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Invite>(entity =>
        {
            entity.HasOne(i => i.Sender)
                  .WithMany(u => u.SentInvites)
                  .HasForeignKey(i => i.SenderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Team)
                  .WithMany(t => t.Invites)
                  .HasForeignKey(i => i.TeamId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasOne(m => m.Team)
                  .WithMany(t => t.Matches)
                  .HasForeignKey(m => m.TeamId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasOne(s => s.Team)
                  .WithMany(t => t.Schedules)
                  .HasForeignKey(s => s.TeamId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Training>(entity =>
        {
            entity.HasOne(t => t.Team)
                  .WithMany(team => team.Trainings)
                  .HasForeignKey(t => t.TeamId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(t => t.Coach)
                  .WithMany(u => u.CoachedTrainings)
                  .HasForeignKey(t => t.CoachId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasOne(al => al.User)
                  .WithMany(u => u.ActivityLogs)
                  .HasForeignKey(al => al.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MessageRead>(entity =>
        {
            entity.HasOne(mr => mr.Message)
                  .WithMany(m => m.MessageReads)
                  .HasForeignKey(mr => mr.MessageId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(mr => mr.User)
                  .WithMany(u => u.MessageReads)
                  .HasForeignKey(mr => mr.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.MessageId, e.UserId }).IsUnique();
        });
    }
}