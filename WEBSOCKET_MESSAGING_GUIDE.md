# WebSocket Messaging Implementation Guide for TeamTalk

This guide provides step-by-step instructions for implementing a WebSocket-based real-time messaging system in your TeamTalk application.

## Table of Contents
1. [Overview](#overview)
2. [Database Structure](#database-structure)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)

---

## Overview

Your TeamTalk application already has the following messaging entities:
- **Message**: For lobby/team chat messages
- **DirectMessage**: For one-on-one private messages
- **MessageRead**: For tracking read status
- **Lobby**: Chat rooms within teams

This guide will help you implement real-time WebSocket communication to enable instant message delivery and presence tracking.

---

## Database Structure

Your existing database already supports messaging. Here's what you have:

### Message Entity
```csharp
// Located at: TeamTalk.Core/Entities/Message.cs
- Id (Guid)
- LobbyId (Guid) - The chat room
- UserId (Guid) - Sender
- Content (string)
- SentAt (DateTime)
```

### DirectMessage Entity
```csharp
// Located at: TeamTalk.Core/Entities/DirectMessage.cs
- Id (Guid)
- SenderId (Guid)
- ReceiverId (Guid)
- Content (string)
- SentAt (DateTime)
- ReadAt (DateTime?)
```

### MessageRead Entity
```csharp
// Located at: TeamTalk.Core/Entities/MessageRead.cs
- MessageId (Guid)
- UserId (Guid)
- ReadAt (DateTime)
```

---

## Backend Implementation

### Step 1: Install Required NuGet Package

```bash
cd backend/TeamTalkApi
dotnet add package Microsoft.AspNetCore.SignalR
```

### Step 2: Create WebSocket Hub

Create a new file: `backend/TeamTalkApi/Hubs/ChatHub.cs`

```csharp
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
```

### Step 3: Update Program.cs

Modify your `backend/TeamTalkApi/Program.cs` file:

```csharp
// Add this using statement at the top
using TeamTalkApi.Hubs;

// After line 96 (after builder.Services.AddControllers()), add:
builder.Services.AddSignalR();

// Update CORS configuration (replace lines 85-93):
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Add your frontend URLs
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for SignalR
    });
});

// After line 126 (after app.MapControllers()), add:
app.MapHub<ChatHub>("/hubs/chat");
```

### Step 4: Configure JWT Authentication for WebSockets

Update the JWT Bearer configuration in `Program.cs` to support WebSocket authentication:

```csharp
// Modify the JWT Bearer configuration (around line 40):
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]!)),
        ClockSkew = TimeSpan.Zero,
        NameClaimType = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email
    };

    // Enable JWT authentication for SignalR WebSockets
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
})
```

### Step 5: Create Message DTOs (Optional but Recommended)

Create `backend/TeamTalkApi/DTOs/MessageDtos.cs`:

```csharp
namespace TeamTalkApi.DTOs;

public record SendLobbyMessageDto(string LobbyId, string Content);
public record SendDirectMessageDto(string ReceiverId, string Content);
public record MarkMessageReadDto(string MessageId);
public record TypingIndicatorDto(string LobbyId, bool IsTyping);
```

---

## Frontend Integration

### Step 1: Install SignalR Client

For React/Next.js frontend:

```bash
npm install @microsoft/signalr
```

For vanilla JavaScript:
```html
<script src="https://cdn.jsdelivr.net/npm/@microsoft/signalr@latest/dist/browser/signalr.min.js"></script>
```

### Step 2: Create WebSocket Service

Create a new file: `frontend/services/chatService.js` (or `.ts` for TypeScript)

```javascript
import * as signalR from "@microsoft/signalr";

class ChatService {
  constructor() {
    this.connection = null;
    this.listeners = new Map();
  }

  async connect(accessToken) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("Already connected");
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/chat", {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up event handlers
    this.connection.onreconnecting(() => {
      console.log("Reconnecting...");
    });

    this.connection.onreconnected(() => {
      console.log("Reconnected!");
    });

    this.connection.onclose(() => {
      console.log("Connection closed");
    });

    try {
      await this.connection.start();
      console.log("SignalR Connected");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      throw err;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  // Lobby Methods
  async joinLobby(lobbyId) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("JoinLobby", lobbyId);
  }

  async leaveLobby(lobbyId) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("LeaveLobby", lobbyId);
  }

  async sendLobbyMessage(lobbyId, content) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("SendLobbyMessage", lobbyId, content);
  }

  // Direct Message Methods
  async sendDirectMessage(receiverId, content) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("SendDirectMessage", receiverId, content);
  }

  // Typing Indicators
  async typingInLobby(lobbyId, isTyping) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("TypingInLobby", lobbyId, isTyping);
  }

  async typingDirectMessage(receiverId, isTyping) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("TypingDirectMessage", receiverId, isTyping);
  }

  // Read Receipts
  async markMessageAsRead(messageId) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("MarkMessageAsRead", messageId);
  }

  async markDirectMessageAsRead(directMessageId) {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("MarkDirectMessageAsRead", directMessageId);
  }

  // Event Listeners
  onReceiveLobbyMessage(callback) {
    this.connection?.on("ReceiveLobbyMessage", callback);
  }

  onReceiveDirectMessage(callback) {
    this.connection?.on("ReceiveDirectMessage", callback);
  }

  onUserJoined(callback) {
    this.connection?.on("UserJoined", callback);
  }

  onUserLeft(callback) {
    this.connection?.on("UserLeft", callback);
  }

  onUserTyping(callback) {
    this.connection?.on("UserTyping", callback);
  }

  onUserTypingDirect(callback) {
    this.connection?.on("UserTypingDirect", callback);
  }

  onMessageRead(callback) {
    this.connection?.on("MessageRead", callback);
  }

  onDirectMessageRead(callback) {
    this.connection?.on("DirectMessageRead", callback);
  }

  onDirectMessageSent(callback) {
    this.connection?.on("DirectMessageSent", callback);
  }

  // Remove listeners
  off(eventName, callback) {
    this.connection?.off(eventName, callback);
  }
}

export default new ChatService();
```

### Step 3: React Component Example

```jsx
import { useEffect, useState } from 'react';
import chatService from '../services/chatService';

function ChatComponent({ lobbyId, userToken }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    chatService.connect(userToken);

    // Join the lobby
    chatService.joinLobby(lobbyId);

    // Set up message listener
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleUserTyping = ({ UserId, IsTyping }) => {
      if (IsTyping) {
        setTypingUsers(prev => [...prev, UserId]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== UserId));
      }
    };

    chatService.onReceiveLobbyMessage(handleNewMessage);
    chatService.onUserTyping(handleUserTyping);

    // Cleanup
    return () => {
      chatService.leaveLobby(lobbyId);
      chatService.off('ReceiveLobbyMessage', handleNewMessage);
      chatService.off('UserTyping', handleUserTyping);
    };
  }, [lobbyId, userToken]);

  const sendMessage = async () => {
    if (messageInput.trim()) {
      await chatService.sendLobbyMessage(lobbyId, messageInput);
      setMessageInput('');
    }
  };

  const handleTyping = (isTyping) => {
    chatService.typingInLobby(lobbyId, isTyping);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.UserName}</strong>: {msg.Content}
            <span className="timestamp">{new Date(msg.SentAt).toLocaleTimeString()}</span>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.length} user(s) typing...
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onFocus={() => handleTyping(true)}
          onBlur={() => handleTyping(false)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatComponent;
```

---

## Testing

### Step 1: Test Backend

1. **Start your backend**:
   ```bash
   cd backend/TeamTalkApi
   dotnet run
   ```

2. **Verify the Hub endpoint** is available at:
   ```
   http://localhost:5000/hubs/chat
   ```

### Step 2: Test with Browser Console

```javascript
// In browser console after including SignalR library
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/hubs/chat", {
    accessTokenFactory: () => "YOUR_JWT_TOKEN_HERE"
  })
  .build();

await connection.start();
console.log("Connected!");

// Listen for messages
connection.on("ReceiveLobbyMessage", (message) => {
  console.log("New message:", message);
});

// Join a lobby
await connection.invoke("JoinLobby", "LOBBY_GUID_HERE");

// Send a message
await connection.invoke("SendLobbyMessage", "LOBBY_GUID_HERE", "Hello World!");
```

### Step 3: Test Scenarios

1. **Lobby Messaging**:
   - Connect two users
   - Have both join the same lobby
   - Send messages and verify both receive them

2. **Direct Messaging**:
   - Connect two users
   - Send a direct message from User A to User B
   - Verify User B receives it

3. **Typing Indicators**:
   - Start typing in a lobby
   - Verify other users see the typing indicator

4. **Read Receipts**:
   - Send a message
   - Mark it as read
   - Verify sender receives read notification

5. **Reconnection**:
   - Disconnect the network
   - Verify automatic reconnection works

---

## Additional Features to Consider

### 1. Online/Offline Status
Add presence tracking to show who's online in a team or lobby.

### 2. Message History
Create REST API endpoints to load previous messages:
```csharp
[HttpGet("api/lobbies/{lobbyId}/messages")]
public async Task<IActionResult> GetLobbyMessages(Guid lobbyId, int skip = 0, int take = 50)
{
    var messages = await _context.Messages
        .Where(m => m.LobbyId == lobbyId)
        .OrderByDescending(m => m.SentAt)
        .Skip(skip)
        .Take(take)
        .Include(m => m.User)
        .ToListAsync();

    return Ok(messages);
}
```

### 3. File Attachments
Extend messages to support file attachments using your existing `File` entity.

### 4. Message Notifications
Send push notifications when users receive messages while offline.

### 5. Message Search
Implement full-text search across messages.

---

## Security Considerations

1. **Authentication**: Always verify JWT tokens on the hub
2. **Authorization**: Check user permissions before allowing lobby access
3. **Rate Limiting**: Implement rate limiting to prevent message spam
4. **Input Validation**: Sanitize message content to prevent XSS attacks
5. **CORS**: Configure CORS properly for your frontend domain

---

## Troubleshooting

### Connection Issues
- Verify JWT token is valid and not expired
- Check CORS configuration allows your frontend domain
- Ensure WebSocket transport is enabled on your server

### Messages Not Received
- Verify user has joined the correct lobby/group
- Check browser console for errors
- Verify the hub method names match exactly (case-sensitive)

### Authentication Errors
- Ensure `access_token` is passed in query string for WebSocket handshake
- Verify JWT configuration includes the OnMessageReceived event handler
- Check that NameIdentifier claim is present in the token

---

## Summary

This guide covers:
1. Setting up SignalR hub for real-time communication
2. Implementing lobby (team chat) and direct messaging
3. Adding typing indicators and read receipts
4. Connecting from frontend using JavaScript/React
5. Testing and troubleshooting

Your existing database structure is already well-suited for this implementation. The WebSocket layer adds real-time capabilities on top of your persistent storage.
