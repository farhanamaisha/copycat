// apps/frontend/services/api/clone.api.ts

import { apiClient } from "./client";
import type { Clone } from "@/types";

// ─────────────────────────────────────────────────────────────
// Get current user's Clone
// ─────────────────────────────────────────────────────────────

export async function getMyClone(): Promise<Clone> {
  return apiClient.get<Clone>("/clones/me");
}

// ─────────────────────────────────────────────────────────────
// Create Clone
// ─────────────────────────────────────────────────────────────

export async function createClone(data: {
  name: string;
}): Promise<Clone> {
  return apiClient.post<Clone>("/clones", data);
}

// ─────────────────────────────────────────────────────────────
// Update Clone
// ─────────────────────────────────────────────────────────────

export async function updateClone(data: {
  name?: string;
  avatarUrl?: string | null;
  avatarConfig?: string | null;
}): Promise<Clone> {
  return apiClient.patch<Clone>("/clones/me", data);
}

// ─────────────────────────────────────────────────────────────
// Train Clone
// ─────────────────────────────────────────────────────────────

export async function trainClone(data: {
  message: string;
}): Promise<{
  clone: Clone;
  deltas: {
    funny: number;
    calm: number;
    intelligent: number;
  };
  pointsEarned: number;
}> {
  return apiClient.post("/clones/me/train", data);
}

// ─────────────────────────────────────────────────────────────
// Get Clone memories
// ─────────────────────────────────────────────────────────────

export async function getCloneMemory(): Promise<{
  memories: Array<{
    id: string;
    type: string;
    content: string;
    createdAt: string;
    weight: number;
  }>;
}> {
  return apiClient.get("/clones/me/memory");
}

// ─────────────────────────────────────────────────────────────
// Delete Clone memory
// ─────────────────────────────────────────────────────────────

export async function deleteMemory(
  memoryId: string,
): Promise<void> {
  return apiClient.delete(`/clones/me/memory/${memoryId}`);
}

// ─────────────────────────────────────────────────────────────
// Get Clone by User ID
// ─────────────────────────────────────────────────────────────

export async function getCloneByUserId(
  userId: string,
): Promise<Clone> {
  return apiClient.get<Clone>(
    `/clones/user/${userId}`,
  );
}

// ─────────────────────────────────────────────────────────────
// Chat with Clone
// ─────────────────────────────────────────────────────────────

export async function chatWithClone(data: {
  message: string;
}): Promise<{
  reply: string;
}> {
  return apiClient.post("/clones/chat", data);
}

// ─────────────────────────────────────────────────────────────
// Get Clone chat history
// ─────────────────────────────────────────────────────────────

export async function getChatHistory(): Promise<
  {
    from: "user" | "clone";
    text: string;
  }[]
> {
  return apiClient.get("/clones/chat/history");
}