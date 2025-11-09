# WebSocket Implementation - What's Left to Do

Based on the WEBSOCKET_MESSAGING_GUIDE.md, here's what you've completed and what still needs to be done.

---

## ✅ Completed

### Backend
- ✅ **Step 1**: Installed SignalR package (`Microsoft.AspNetCore.SignalR`)
- ✅ **Step 2**: Created `ChatHub.cs` with all required methods:
  - Connection management (OnConnectedAsync, OnDisconnectedAsync)
  - Lobby methods (JoinLobby, LeaveLobby, SendLobbyMessage)
  - Direct message methods (SendDirectMessage)
  - Typing indicators (TypingInLobby, TypingDirectMessage)
  - Read receipts (MarkMessageAsRead, MarkDirectMessageAsRead)
- ✅ **Step 3 (Partial)**: Added `builder.Services.AddSignalR()` to Program.cs

### Frontend
- ✅ **Step 1**: Installed `@microsoft/signalr` package
- ✅ **Step 2**: Created `chatService.ts` with TypeScript
- ✅ **Step 2**: Created TypeScript types in `types/chat.ts`
- ✅ **Step 3**: Updated team chat page to use WebSocket
- ✅ **Step 3**: Updated direct messages page to use WebSocket

---

## ❌ Not Yet Completed

### Backend - Critical Missing Steps

#### 1. **Map ChatHub Endpoint in Program.cs** ⚠️ CRITICAL
**Location**: `backend/TeamTalkApi/Program.cs` (around line 130, after `app.MapControllers()`)

**Missing Code**:
```csharp
// Add this import at the top of Program.cs
using TeamTalkApi.Hubs;

// Add this line after app.MapControllers() (line 130)
app.MapHub<ChatHub>("/hubs/chat");
```

**Why it's needed**: Without this, the WebSocket endpoint `/hubs/chat` doesn't exist, so the frontend can't connect.

**Status**: ❌ **NOT DONE** - This is blocking WebSocket from working!

---

#### 2. **Update JWT Bearer Configuration for WebSockets** ⚠️ CRITICAL
**Location**: `backend/TeamTalkApi/Program.cs` (JWT Bearer configuration section)

**What to Update**:
Find your `.AddJwtBearer()` configuration and add the `Events` section:

```csharp
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // Your existing validation parameters...
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

    // ⚠️ ADD THIS SECTION - Required for WebSocket authentication
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

**Why it's needed**: SignalR sends the JWT token via query string (`?access_token=...`) instead of headers. Without this, authentication won't work for WebSocket connections.

**Status**: ❌ **NOT DONE** - Authentication will fail without this!

---

#### 3. **Update CORS for SignalR** ⚠️ IMPORTANT
**Location**: `backend/TeamTalkApi/Program.cs` (CORS configuration)

**What to Update**:
Make sure your CORS policy includes `.AllowCredentials()`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // ⚠️ Required for SignalR
    });
});
```

**Status**: ⚠️ **VERIFY** - Check if `.AllowCredentials()` is present

---

### Backend - Optional but Recommended

#### 4. **Create Message DTOs** (Optional)
**Location**: Create `backend/TeamTalkApi/DTOs/MessageDtos.cs`

```csharp
namespace TeamTalkApi.DTOs;

public record SendLobbyMessageDto(string LobbyId, string Content);
public record SendDirectMessageDto(string ReceiverId, string Content);
public record MarkMessageReadDto(string MessageId);
public record TypingIndicatorDto(string LobbyId, bool IsTyping);
```

**Why it's useful**: Better type safety and validation
**Status**: ❌ **NOT DONE** (but optional)

---

### Additional Features to Implement

According to the guide, these features are mentioned but not yet implemented:

#### 5. **Message History API Endpoints**
Create REST endpoints to load previous messages when users join a chat:

```csharp
// In a MessagesController or similar

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

[HttpGet("api/direct-messages/{userId}")]
public async Task<IActionResult> GetDirectMessages(Guid userId, int skip = 0, int take = 50)
{
    var currentUserId = GetCurrentUserId(); // Your auth logic

    var messages = await _context.DirectMessages
        .Where(dm =>
            (dm.SenderId == currentUserId && dm.ReceiverId == userId) ||
            (dm.SenderId == userId && dm.ReceiverId == currentUserId))
        .OrderByDescending(dm => dm.SentAt)
        .Skip(skip)
        .Take(take)
        .ToListAsync();

    return Ok(messages);
}
```

**Why it's needed**: When users open a chat, they need to see previous messages, not just new ones
**Status**: ❌ **NOT DONE** - Critical for usability!

---

#### 6. **Online/Offline Presence Tracking**
Track which users are currently online in a team or lobby.

**Status**: ❌ **NOT DONE** (mentioned in guide as "Additional Feature")

---

#### 7. **File Attachments**
Extend messages to support file attachments.

**Status**: ❌ **NOT DONE** (mentioned in guide as "Additional Feature")

---

#### 8. **Message Notifications**
Send push notifications when users receive messages while offline.

**Status**: ❌ **NOT DONE** (mentioned in guide as "Additional Feature")

---

#### 9. **Message Search**
Implement full-text search across messages.

**Status**: ❌ **NOT DONE** (mentioned in guide as "Additional Feature")

---

### Frontend - Missing Features

#### 10. **Load Message History on Chat Open**
When a user opens a team chat or direct message, fetch and display previous messages.

**Where**:
- `frontend/app/team/[id]/chat/page.tsx`
- `frontend/app/messages/direct/[userId]/page.tsx`

**What to Add**:
```typescript
useEffect(() => {
  const loadMessageHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/lobbies/${params.id}/messages`)
      const history = await response.json()
      setMessages(history.map(msg => ({
        id: msg.id,
        sender: msg.userName,
        message: msg.content,
        timestamp: new Date(msg.sentAt).toLocaleTimeString(),
        isCurrentUser: msg.userId === currentUserId
      })))
    } catch (error) {
      console.error("Failed to load message history:", error)
    }
  }

  loadMessageHistory()
}, [params.id])
```

**Status**: ❌ **NOT DONE**

---

#### 11. **Environment Variables for API URLs**
Currently hardcoded URLs in `chatService.ts` and components.

**What to Create**: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:5000/hubs/chat
```

**What to Update**: Replace hardcoded URLs with:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL
```

**Status**: ❌ **NOT DONE**

---

## Testing Not Yet Done

According to the guide, you should test:

### Backend Testing
- [ ] Verify hub endpoint at `http://localhost:5000/hubs/chat`
- [ ] Test connection with browser console SignalR client
- [ ] Test JWT authentication works for WebSocket

### Frontend Testing
- [ ] Test lobby messaging between two users
- [ ] Test direct messaging between two users
- [ ] Test typing indicators
- [ ] Test read receipts
- [ ] Test automatic reconnection

---

## Priority Order (What to Do Next)

### 🔴 Critical - Must Do Now
1. **Add `app.MapHub<ChatHub>("/hubs/chat")` to Program.cs** - WebSocket won't work without this!
2. **Add JWT Events for WebSocket authentication to Program.cs** - Auth will fail without this!
3. **Verify CORS has `.AllowCredentials()`** - SignalR requires this

### 🟡 High Priority - Do Soon
4. **Create Message History API endpoints** - Users need to see old messages
5. **Update frontend to load message history** - Currently only shows new messages
6. **Add environment variables** - Remove hardcoded URLs

### 🟢 Medium Priority - Nice to Have
7. Create Message DTOs
8. Implement presence tracking
9. Add message search
10. Add push notifications

### 🔵 Low Priority - Future Features
11. File attachments
12. Advanced features from the guide

---

## Quick Fix Summary

**The absolute minimum to get WebSocket working:**

1. Open `backend/TeamTalkApi/Program.cs`
2. Add `using TeamTalkApi.Hubs;` at the top
3. Add `app.MapHub<ChatHub>("/hubs/chat");` after line 130
4. Add JWT Events configuration to your `.AddJwtBearer()` section
5. Verify CORS has `.AllowCredentials()`
6. Restart backend
7. Test frontend - it should now connect!

**Then immediately after:**
8. Create message history API endpoints
9. Update frontend to load old messages on chat open

---

## Summary

**What Works:**
- ✅ ChatHub backend logic is complete
- ✅ Frontend WebSocket service is complete
- ✅ Chat UI is implemented

**What Doesn't Work Yet:**
- ❌ WebSocket endpoint isn't mapped (no connection possible)
- ❌ JWT auth for WebSocket isn't configured (auth will fail)
- ❌ No message history loading (users only see new messages)

**Fix these 3 issues and your WebSocket system will be functional!**
