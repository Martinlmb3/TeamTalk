using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TeamTalk.Core.Entities;
using TeamTalkApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace TeamTalkApi.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly TeamTalkDbContext _context;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(TeamTalkDbContext context, ILogger<ChatHub> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Connection Management
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.Email)?.Value;
        _logger.LogInformation($"User {userId} connected with connection ID: {Context.ConnectionId}");

        // Join user to their personal group (for direct messages)
        if (userId != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.Email)?.Value;
        _logger.LogInformation($"User {userId} disconnected");
        await base.OnDisconnectedAsync(exception);
    }

    // Lobby (Team Chat) Methods
    public async Task JoinLobby(string lobbyId)
    {
        var userId = GetUserId();

        // Verify user has access to this lobby
        var hasAccess = await _context.LobbyUsers
            .AnyAsync(lu => lu.LobbyId == Guid.Parse(lobbyId) && lu.UserId == userId);

        if (!hasAccess)
        {
            throw new HubException("Access denied to this lobby");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, $"lobby_{lobbyId}");
        _logger.LogInformation($"User {userId} joined lobby {lobbyId}");

        // Notify others in the lobby
        await Clients.OthersInGroup($"lobby_{lobbyId}").SendAsync("UserJoined", new
        {
            UserId = userId,
            Timestamp = DateTime.UtcNow
        });
    }

    public async Task LeaveLobby(string lobbyId)
    {
        var userId = GetUserId();
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"lobby_{lobbyId}");

        await Clients.OthersInGroup($"lobby_{lobbyId}").SendAsync("UserLeft", new
        {
            UserId = userId,
            Timestamp = DateTime.UtcNow
        });
    }

    public async Task SendLobbyMessage(string lobbyId, string content)
    {
        var userId = GetUserId();

        // Verify user has access
        var hasAccess = await _context.LobbyUsers
            .AnyAsync(lu => lu.LobbyId == Guid.Parse(lobbyId) && lu.UserId == userId);

        if (!hasAccess)
        {
            throw new HubException("Access denied to this lobby");
        }

        // Save message to database
        var message = new Message
        {
            Id = Guid.NewGuid(),
            LobbyId = Guid.Parse(lobbyId),
            UserId = userId,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Get user details for the message
        var user = await _context.Users.FindAsync(userId);

        // Broadcast to all users in the lobby
        await Clients.Group($"lobby_{lobbyId}").SendAsync("ReceiveLobbyMessage", new
        {
            Id = message.Id,
            LobbyId = lobbyId,
            UserId = userId,
            UserName = $"{user?.FirstName} {user?.LastName}",
            Content = content,
            SentAt = message.SentAt
        });
    }

    // Direct Message Methods
    public async Task SendDirectMessage(string receiverIdString, string content)
    {
        var senderId = GetUserId();
        var receiverId = Guid.Parse(receiverIdString);

        // Verify both users exist
        var receiverExists = await _context.Users.AnyAsync(u => u.Id == receiverId);
        if (!receiverExists)
        {
            throw new HubException("Receiver not found");
        }

        // Save direct message to database
        var directMessage = new DirectMessage
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = receiverId,
            Content = content,
            SentAt = DateTime.UtcNow,
            ReadAt = null
        };

        _context.DirectMessages.Add(directMessage);
        await _context.SaveChangesAsync();

        // Get sender details
        var sender = await _context.Users.FindAsync(senderId);

        var messageData = new
        {
            Id = directMessage.Id,
            SenderId = senderId,
            SenderName = $"{sender?.FirstName} {sender?.LastName}",
            ReceiverId = receiverId,
            Content = content,
            SentAt = directMessage.SentAt,
            ReadAt = (DateTime?)null
        };

        // Send to receiver
        await Clients.Group($"user_{receiverIdString}").SendAsync("ReceiveDirectMessage", messageData);

        // Send confirmation to sender
        await Clients.Caller.SendAsync("DirectMessageSent", messageData);
    }

    // Typing Indicators
    public async Task TypingInLobby(string lobbyId, bool isTyping)
    {
        var userId = GetUserId();

        await Clients.OthersInGroup($"lobby_{lobbyId}").SendAsync("UserTyping", new
        {
            UserId = userId,
            LobbyId = lobbyId,
            IsTyping = isTyping
        });
    }

    public async Task TypingDirectMessage(string receiverIdString, bool isTyping)
    {
        var userId = GetUserId();

        await Clients.Group($"user_{receiverIdString}").SendAsync("UserTypingDirect", new
        {
            UserId = userId,
            IsTyping = isTyping
        });
    }

    // Read Receipts
    public async Task MarkMessageAsRead(string messageId)
    {
        var userId = GetUserId();
        var msgId = Guid.Parse(messageId);

        // Check if it's a lobby message
        var message = await _context.Messages
            .Include(m => m.Lobby)
            .FirstOrDefaultAsync(m => m.Id == msgId);

        if (message != null)
        {
            // Create read receipt if doesn't exist
            var existingRead = await _context.MessageReads
                .FirstOrDefaultAsync(mr => mr.MessageId == msgId && mr.UserId == userId);

            if (existingRead == null)
            {
                var messageRead = new MessageRead
                {
                    MessageId = msgId,
                    UserId = userId,
                    ReadAt = DateTime.UtcNow
                };

                _context.MessageReads.Add(messageRead);
                await _context.SaveChangesAsync();

                // Notify the sender
                await Clients.Group($"user_{message.UserId}").SendAsync("MessageRead", new
                {
                    MessageId = messageId,
                    ReadByUserId = userId,
                    ReadAt = messageRead.ReadAt
                });
            }
        }
    }

    public async Task MarkDirectMessageAsRead(string directMessageId)
    {
        var userId = GetUserId();
        var dmId = Guid.Parse(directMessageId);

        var directMessage = await _context.DirectMessages.FindAsync(dmId);

        if (directMessage != null && directMessage.ReceiverId == userId && directMessage.ReadAt == null)
        {
            directMessage.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Notify the sender
            await Clients.Group($"user_{directMessage.SenderId}").SendAsync("DirectMessageRead", new
            {
                MessageId = directMessageId,
                ReadAt = directMessage.ReadAt
            });
        }
    }

    // Helper Methods
    private Guid GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new HubException("User not authenticated");
        }

        return Guid.Parse(userIdClaim);
    }
}
