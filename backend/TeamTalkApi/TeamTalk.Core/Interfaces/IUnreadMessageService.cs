using TeamTalk.Core.Entities;

namespace TeamTalk.Core.Interfaces;

public interface IUnreadMessageService
{
    Task<int> GetUnreadMessageCountAsync(Guid userId, Guid lobbyId);
    Task MarkMessagesAsReadAsync(Guid userId, Guid lobbyId, Guid? upToMessageId = null);
    Task<Dictionary<Guid, int>> GetUnreadCountsForUserLobbiesAsync(Guid userId);
    Task<bool> HasUnreadMessagesInTeamAsync(Guid userId, Guid teamId);
}