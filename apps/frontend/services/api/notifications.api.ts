import { apiClient } from "./client";

export interface NotificationActor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Notification {
  id: string;
  type:
    | "LIKE"
    | "COMMENT"
    | "FOLLOW"
    | "MESSAGE"
    | "CLONE_UPDATE"
    | "TRAINING_COMPLETE"
    | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  actor: NotificationActor | null;
  actorId: string | null;
  referenceId: string | null;
  createdAt: string;
}

export async function getNotifications(
  unreadOnly = false,
): Promise<{
  success: boolean;
  data: Notification[];
}> {
  return apiClient.get<{
    success: boolean;
    data: Notification[];
  }>(
    `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`,
  );
}

export async function getUnreadCount(): Promise<{
  success: boolean;
  data: { count: number };
}> {
  return apiClient.get<{
    success: boolean;
    data: { count: number };
  }>("/notifications/unread-count");
}

export async function markNotificationRead(
  id: string,
): Promise<{
  success: boolean;
  data: Notification;
}> {
  return apiClient.patch<{
    success: boolean;
    data: Notification;
  }>(`/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<{
  success: boolean;
  data: { message: string };
}> {
  return apiClient.patch<{
    success: boolean;
    data: { message: string };
  }>("/notifications/read-all", {});
}

export async function deleteNotification(
  id: string,
): Promise<{
  success: boolean;
  data: { message: string };
}> {
  return apiClient.delete<{
    success: boolean;
    data: { message: string };
  }>(`/notifications/${id}`);
}