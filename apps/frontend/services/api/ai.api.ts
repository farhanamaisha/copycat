// apps/frontend/services/api/ai.api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set.');
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export interface CloneChatResponse {
  success: boolean;
  data: {
    reply: string;
    cloneId: string;
  };
}

/**
 * Send a message to the user's Clone and get an AI-generated reply.
 * Requires the user to be logged in (reads JWT from localStorage).
 */
export async function chatWithClone(message: string): Promise<CloneChatResponse> {
  const token = getToken();

  if (!token) {
    throw new Error('You must be logged in to chat with your Clone.');
  }

  const response = await fetch(`${BASE_URL}/ai/clone/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  const text = await response.text();

  let json: CloneChatResponse;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server error ${response.status}: ${text.slice(0, 150)}`);
  }

  if (!response.ok) {
    const err = json as unknown as { message?: string };
    throw new Error(err.message ?? `Request failed with status ${response.status}`);
  }

  return json;
}