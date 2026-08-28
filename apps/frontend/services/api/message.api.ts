import { apiClient } from "./client";

export interface MessageUser {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface Conversation {
  id: string;
  type: "direct";
  participant: MessageUser;
  lastMessage: {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  type: string;
  attachments: unknown[];
  reactions: unknown[];
  isRead: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getConversations(): Promise<Conversation[]> {
  return apiClient.get<Conversation[]>("/messages/conversations");
}

export async function getMessages(
  conversationId: string,
): Promise<DirectMessage[]> {
  return apiClient.get<DirectMessage[]>(
    `/messages/${conversationId}`,
  );
}

export async function sendMessage(
  recipientId: string,
  content: string,
): Promise<DirectMessage> {
  return apiClient.post<DirectMessage>("/messages", {
    recipientId,
    content,
  });
}