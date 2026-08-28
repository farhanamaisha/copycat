
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set.');
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('accessToken');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export interface CloneMemory {
  id: string;
  cloneId: string;
  memory: string;
  importance: number;
  createdAt: string;
}

export async function getMemories(): Promise<CloneMemory[]> {
  return request<CloneMemory[]>('/clones/me/memories');
}

export async function createMemory(
  memory: string,
  importance = 1,
): Promise<CloneMemory> {
  return request<CloneMemory>('/clones/me/memories', {
    method: 'POST',
    body: JSON.stringify({
      memory,
      importance,
    }),
  });
}

export async function deleteMemory(
  memoryId: string,
): Promise<CloneMemory> {
  return request<CloneMemory>(
    `/clones/me/memories/${memoryId}`,
    {
      method: 'DELETE',
    },
  );
}
