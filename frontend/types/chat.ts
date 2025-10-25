export interface LobbyMessage {
  Id: string;
  LobbyId: string;
  UserId: string;
  UserName: string;
  Content: string;
  SentAt: string;
}

export interface DirectMessageData {
  Id: string;
  SenderId: string;
  SenderName: string;
  ReceiverId: string;
  Content: string;
  SentAt: string;
  ReadAt: string | null;
}

export interface UserJoinedEvent {
  UserId: string;
  Timestamp: string;
}

export interface UserLeftEvent {
  UserId: string;
  Timestamp: string;
}

export interface UserTypingEvent {
  UserId: string;
  LobbyId: string;
  IsTyping: boolean;
}

export interface UserTypingDirectEvent {
  UserId: string;
  IsTyping: boolean;
}

export interface MessageReadEvent {
  MessageId: string;
  ReadByUserId: string;
  ReadAt: string;
}

export interface DirectMessageReadEvent {
  MessageId: string;
  ReadAt: string;
}
