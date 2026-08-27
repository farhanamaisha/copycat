// apps/frontend/services/api/social.api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) throw new Error('NEXT_PUBLIC_API_URL is not set.');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let json: T;
  try { json = JSON.parse(text); }
  catch { throw new Error(`Server error ${response.status}: ${text.slice(0, 150)}`); }

  if (!response.ok) {
    const err = json as { message?: string };
    throw new Error(err.message ?? `Request failed with status ${response.status}`);
  }
  return json;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchedUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  isPremium: boolean;
  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
  clone: { name: string; level: number; mood: string } | null;
  connectionStatus: {
    status: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
    connectionId: string | null;
    isSender: boolean;
  };
}

export interface Connection {
  id: string;
  connectedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
  };
}

export interface PendingRequest {
  id: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
    clone: { name: string; level: number } | null;
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchUsers(query: string): Promise<{ success: boolean; data: SearchedUser[] }> {
  return request(`/social/search?q=${encodeURIComponent(query)}`);
}

export async function getSuggestedUsers(): Promise<{ success: boolean; data: SearchedUser[] }> {
  return request('/social/suggested');
}

// ─── Follow ───────────────────────────────────────────────────────────────────

export async function followUser(userId: string): Promise<{ success: boolean; data: { following: boolean } }> {
  return request(`/social/follow/${userId}`, { method: 'POST' });
}

export async function unfollowUser(userId: string): Promise<{ success: boolean; data: { following: boolean } }> {
  return request(`/social/follow/${userId}`, { method: 'DELETE' });
}

export async function getFollowers(userId: string): Promise<{ success: boolean; data: SearchedUser[] }> {
  return request(`/social/followers/${userId}`);
}

export async function getFollowing(userId: string): Promise<{ success: boolean; data: SearchedUser[] }> {
  return request(`/social/following/${userId}`);
}

// ─── Connections ──────────────────────────────────────────────────────────────

export async function sendConnection(userId: string): Promise<{ success: boolean; data: { message: string } }> {
  return request(`/social/connections/send/${userId}`, { method: 'POST' });
}

export async function respondToConnection(
  connectionId: string,
  status: 'ACCEPTED' | 'REJECTED',
): Promise<{ success: boolean; data: { message: string } }> {
  return request(`/social/connections/${connectionId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getConnections(): Promise<{ success: boolean; data: Connection[] }> {
  return request('/social/connections');
}

export async function getPendingRequests(): Promise<{ success: boolean; data: { received: PendingRequest[]; sent: PendingRequest[] } }> {
  return request('/social/connections/pending');
}

export async function removeConnection(connectionId: string): Promise<{ success: boolean; data: { message: string } }> {
  return request(`/social/connections/${connectionId}`, { method: 'DELETE' });
}