// apps/frontend/services/api/clowder.api.ts
import { apiClient } from "./client";
import type { Clowder, PaginatedResponse } from "@/types";

export async function getMyClowders(): Promise<Clowder[]> {
  return apiClient.get<Clowder[]>("/clowders/me");
}

export async function getSuggestedClowders(): Promise<Clowder[]> {
  return apiClient.get<Clowder[]>("/clowders/suggested");
}

export async function getClowder(slug: string): Promise<Clowder> {
  return apiClient.get<Clowder>(`/clowders/${slug}`);
}

export async function createClowder(data: {
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  tags: string[];
}): Promise<Clowder> {
  return apiClient.post<Clowder>("/clowders", data);
}

export async function joinClowder(clowderId: string): Promise<void> {
  return apiClient.post(`/clowders/${clowderId}/join`, {});
}

export async function leaveClowder(clowderId: string): Promise<void> {
  return apiClient.post(`/clowders/${clowderId}/leave`, {});
}

export async function searchClowders(
  query: string
): Promise<PaginatedResponse<Clowder>> {
  return apiClient.get<PaginatedResponse<Clowder>>(
    `/clowders/search?q=${encodeURIComponent(query)}`
  );
}

// ── Messages ────────────────────────────────────────────────────────────────

import type { Conversation, Message } from "@/types";

export async function getConversations(): Promise<Conversation[]> {
  return apiClient.get<Conversation[]>("/messages/conversations");
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return apiClient.get<Message[]>(`/messages/${conversationId}`);
}

export async function sendMessage(data: {
  recipientId: string;
  content: string;
}): Promise<Message> {
  return apiClient.post<Message>("/messages", data);
}

// ── Notifications ────────────────────────────────────────────────────────────

import type { Notification } from "@/types";

export async function getNotifications(): Promise<Notification[]> {
  return apiClient.get<Notification[]>("/notifications");
}

export async function markNotificationRead(id: string): Promise<void> {
  return apiClient.patch(`/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
  return apiClient.post("/notifications/read-all", {});
}

// ── Search ───────────────────────────────────────────────────────────────────

import type { User, Post } from "@/types";

export async function globalSearch(query: string): Promise<{
  users: User[];
  posts: Post[];
  clowders: Clowder[];
}> {
  return apiClient.get(`/search?q=${encodeURIComponent(query)}`);
}