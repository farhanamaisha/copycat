// apps/frontend/services/api/feed.api.ts
import { apiClient } from "./client";
import type { Post, PaginatedResponse } from "@/types";

export async function getFeed(params?: {
  page?: number;
  limit?: number;
  type?: string;
  sortBy?: string;
}): Promise<PaginatedResponse<Post>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.type && params.type !== "all") query.set("type", params.type);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  const qs = query.toString();
  return apiClient.get<PaginatedResponse<Post>>(`/feed${qs ? `?${qs}` : ""}`);
}

export async function createPost(data: {
  content: string;
  type?: string;
  clowderId?: string;
  tags?: string[];
}): Promise<Post> {
  return apiClient.post<Post>("/posts", data);
}

export async function likePost(postId: string): Promise<void> {
  return apiClient.post(`/posts/${postId}/like`, {});
}

export async function unlikePost(postId: string): Promise<void> {
  return apiClient.delete(`/posts/${postId}/like`);
}

export async function repostPost(postId: string): Promise<void> {
  return apiClient.post(`/posts/${postId}/repost`, {});
}

export async function bookmarkPost(postId: string): Promise<void> {
  return apiClient.post(`/posts/${postId}/bookmark`, {});
}

export async function unbookmarkPost(postId: string): Promise<void> {
  return apiClient.delete(`/posts/${postId}/bookmark`);
}

export async function deletePost(postId: string): Promise<void> {
  return apiClient.delete(`/posts/${postId}`);
}