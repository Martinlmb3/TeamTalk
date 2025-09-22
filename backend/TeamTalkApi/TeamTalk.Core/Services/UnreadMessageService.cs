using Microsoft.EntityFrameworkCore;
using TeamTalk.Core.Entities;
using TeamTalk.Core.Interfaces;
using TeamTalkApi.Infrastructure.Data;

namespace TeamTalk.Core.Services;

public class UnreadMessageService : IUnreadMessageService
{
    private readonly TeamTalkDbContext _context;

    public UnreadMessageService(TeamTalkDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetUnreadMessageCountAsync(Guid userId, Guid lobbyId)
    {
        var lobbyUser = await _context.LobbyUsers
            .FirstOrDefaultAsync(lu => lu.UserId == userId && lu.LobbyId == lobbyId);

        if (lobbyUser == null)
            return 0;

        var query = _context.Messages.Where(m => m.LobbyId == lobbyId);

        if (lobbyUser.LastReadMessageId.HasValue)
        {
            query = query.Where(m => m.Id > lobbyUser.LastReadMessageId.Value);
        }

        return await query.CountAsync();
    }

    public async Task MarkMessagesAsReadAsync(Guid userId, Guid lobbyId, Guid? upToMessageId = null)
    {
        var lobbyUser = await _context.LobbyUsers
            .FirstOrDefaultAsync(lu => lu.UserId == userId && lu.LobbyId == lobbyId);

        if (lobbyUser == null)
            return;

        Guid lastMessageId;
        if (upToMessageId.HasValue)
        {
            lastMessageId = upToMessageId.Value;
        }
        else
        {
            var lastMessage = await _context.Messages
                .Where(m => m.LobbyId == lobbyId)
                .OrderByDescending(m => m.Id)
                .FirstOrDefaultAsync();

            if (lastMessage == null)
                return;

            lastMessageId = lastMessage.Id;
        }

        lobbyUser.LastReadMessageId = lastMessageId;
        await _context.SaveChangesAsync();
    }

    public async Task<Dictionary<Guid, int>> GetUnreadCountsForUserLobbiesAsync(Guid userId)
    {
        var lobbyUsers = await _context.LobbyUsers
            .Where(lu => lu.UserId == userId)
            .ToListAsync();

        var unreadCounts = new Dictionary<Guid, int>();

        foreach (var lobbyUser in lobbyUsers)
        {
            var query = _context.Messages.Where(m => m.LobbyId == lobbyUser.LobbyId);

            if (lobbyUser.LastReadMessageId.HasValue)
            {
                query = query.Where(m => m.Id > lobbyUser.LastReadMessageId.Value);
            }

            var count = await query.CountAsync();
            unreadCounts[lobbyUser.LobbyId] = count;
        }

        return unreadCounts;
    }

    public async Task<bool> HasUnreadMessagesInTeamAsync(Guid userId, Guid teamId)
    {
        var userLobbyIds = await _context.LobbyUsers
            .Where(lu => lu.UserId == userId)
            .Join(_context.Lobbies, 
                  lu => lu.LobbyId, 
                  l => l.Id, 
                  (lu, l) => new { LobbyUser = lu, Lobby = l })
            .Where(x => x.Lobby.TeamId == teamId)
            .Select(x => new { x.LobbyUser.LobbyId, x.LobbyUser.LastReadMessageId })
            .ToListAsync();

        foreach (var lobbyInfo in userLobbyIds)
        {
            var hasUnread = await _context.Messages
                .Where(m => m.LobbyId == lobbyInfo.LobbyId)
                .Where(m => !lobbyInfo.LastReadMessageId.HasValue || m.Id > lobbyInfo.LastReadMessageId.Value)
                .AnyAsync();

            if (hasUnread)
                return true;
        }

        return false;
    }
}