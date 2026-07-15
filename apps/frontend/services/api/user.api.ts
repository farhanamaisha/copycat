// apps/frontend/services/api/user.api.ts
import { apiClient } from "./client";
import type { User } from "@/types";

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>("/users/me");
}

export async function updateProfile(data: {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<User> {
  return apiClient.patch<User>("/users/me", data);
}

export async function getUserByUsername(username: string): Promise<User> {
  return apiClient.get<User>(`/users/${username}`);
}

export async function followUser(userId: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(`/users/${userId}/follow`, {});
}

export async function unfollowUser(userId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/users/${userId}/follow`);
}

export async function getSuggestedUsers(): Promise<User[]> {
  return apiClient.get<User[]>("/users/suggested");
}

export async function getFollowers(userId: string): Promise<User[]> {
  return apiClient.get<User[]>(`/users/${userId}/followers`);
}

export async function getFollowing(userId: string): Promise<User[]> {
  return apiClient.get<User[]>(`/users/${userId}/following`);
}