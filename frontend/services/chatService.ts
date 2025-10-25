import * as signalR from "@microsoft/signalr";
import type {
  LobbyMessage,
  DirectMessageData,
  UserJoinedEvent,
  UserLeftEvent,
  UserTypingEvent,
  UserTypingDirectEvent,
  MessageReadEvent,
  DirectMessageReadEvent,
} from "@/types/chat";

class ChatService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to the SignalR ChatHub
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("Already connected to ChatHub");
      return;
    }

    // Get access token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/chat", {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
            console.error("Max reconnection attempts reached");
            return null;
          }
          // Exponential backoff: 0, 2, 10, 30 seconds
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up connection event handlers
    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
      this.reconnectAttempts++;
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected with ID:", connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log("SignalR connection closed", error);
      this.connection = null;
    });

    try {
      await this.connection.start();
      console.log("SignalR Connected to ChatHub");
      this.reconnectAttempts = 0;
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      throw err;
    }
  }

  /**
   * Disconnect from the SignalR ChatHub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("Disconnected from ChatHub");
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // ==================== Lobby Methods ====================

  /**
   * Join a lobby (team chat room)
   */
  async joinLobby(lobbyId: string): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("JoinLobby", lobbyId);
    console.log(`Joined lobby: ${lobbyId}`);
  }

  /**
   * Leave a lobby
   */
  async leaveLobby(lobbyId: string): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("LeaveLobby", lobbyId);
    console.log(`Left lobby: ${lobbyId}`);
  }

  /**
   * Send a message to a lobby
   */
  async sendLobbyMessage(lobbyId: string, content: string): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("SendLobbyMessage", lobbyId, content);
  }

  // ==================== Direct Message Methods ====================

  /**
   * Send a direct message to another user
   */
  async sendDirectMessage(receiverId: string, content: string): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("SendDirectMessage", receiverId, content);
  }

  // ==================== Typing Indicators ====================

  /**
   * Send typing indicator in a lobby
   */
  async typingInLobby(lobbyId: string, isTyping: boolean): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("TypingInLobby", lobbyId, isTyping);
  }

  /**
   * Send typing indicator for direct message
   */
  async typingDirectMessage(receiverId: string, isTyping: boolean): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("TypingDirectMessage", receiverId, isTyping);
  }

  // ==================== Read Receipts ====================

  /**
   * Mark a lobby message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("MarkMessageAsRead", messageId);
  }

  /**
   * Mark a direct message as read
   */
  async markDirectMessageAsRead(directMessageId: string): Promise<void> {
    if (!this.connection) throw new Error("Not connected to ChatHub");
    await this.connection.invoke("MarkDirectMessageAsRead", directMessageId);
  }

  // ==================== Event Listeners ====================

  /**
   * Listen for lobby messages
   */
  onReceiveLobbyMessage(callback: (message: LobbyMessage) => void): void {
    this.connection?.on("ReceiveLobbyMessage", callback);
  }

  /**
   * Listen for direct messages
   */
  onReceiveDirectMessage(callback: (message: DirectMessageData) => void): void {
    this.connection?.on("ReceiveDirectMessage", callback);
  }

  /**
   * Listen for direct message sent confirmation
   */
  onDirectMessageSent(callback: (message: DirectMessageData) => void): void {
    this.connection?.on("DirectMessageSent", callback);
  }

  /**
   * Listen for user joined lobby
   */
  onUserJoined(callback: (event: UserJoinedEvent) => void): void {
    this.connection?.on("UserJoined", callback);
  }

  /**
   * Listen for user left lobby
   */
  onUserLeft(callback: (event: UserLeftEvent) => void): void {
    this.connection?.on("UserLeft", callback);
  }

  /**
   * Listen for typing indicators in lobby
   */
  onUserTyping(callback: (event: UserTypingEvent) => void): void {
    this.connection?.on("UserTyping", callback);
  }

  /**
   * Listen for typing indicators in direct messages
   */
  onUserTypingDirect(callback: (event: UserTypingDirectEvent) => void): void {
    this.connection?.on("UserTypingDirect", callback);
  }

  /**
   * Listen for message read receipts
   */
  onMessageRead(callback: (event: MessageReadEvent) => void): void {
    this.connection?.on("MessageRead", callback);
  }

  /**
   * Listen for direct message read receipts
   */
  onDirectMessageRead(callback: (event: DirectMessageReadEvent) => void): void {
    this.connection?.on("DirectMessageRead", callback);
  }

  /**
   * Remove a specific event listener
   */
  off(eventName: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.connection?.off(eventName, callback);
    } else {
      this.connection?.off(eventName);
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    const events = [
      "ReceiveLobbyMessage",
      "ReceiveDirectMessage",
      "DirectMessageSent",
      "UserJoined",
      "UserLeft",
      "UserTyping",
      "UserTypingDirect",
      "MessageRead",
      "DirectMessageRead",
    ];

    events.forEach((event) => {
      this.connection?.off(event);
    });
  }
}

// Export singleton instance
export default new ChatService();
