// apps/frontend/services/api/clone.api.ts
import { apiClient } from "./client";
import type { Clone } from "@/types";

export async function getMyClone(): Promise<Clone> {
  return apiClient.get<Clone>("/clones/me");
}

export async function createClone(data: {
  name: string;
}): Promise<Clone> {
  return apiClient.post<Clone>("/clones", data);
}

export async function updateClone(data: {
  name?: string;
  avatarUrl?: string;
}): Promise<Clone> {
  return apiClient.patch<Clone>("/clones/me", data);
}

export async function trainClone(data: {
  message: string;
}): Promise<{
  clone: Clone;
  deltas: { funny: number; calm: number; intelligent: number };
  pointsEarned: number;
}> {
  return apiClient.post("/clones/me/train", data);
}

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

export async function deleteMemory(memoryId: string): Promise<void> {
  return apiClient.delete(`/clones/me/memory/${memoryId}`);
}

export async function getCloneByUserId(userId: string): Promise<Clone> {
  return apiClient.get<Clone>(`/clones/user/${userId}`);
}

export async function chatWithClone(data: {
  message: string;
  cloneId?: string;
}): Promise<{ reply: string; cloneId: string }> {
  return apiClient.post("/clones/chat", data);
}