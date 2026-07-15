// apps/frontend/services/api/client.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `Server error ${response.status}: ${text.slice(0, 150)}`
    );
  }

  if (!response.ok) {
    const err = json as Record<string, unknown>;
    const msg =
      typeof err.message === "string"
        ? err.message
        : Array.isArray(err.message)
        ? (err.message as string[]).join(", ")
        : `Request failed with status ${response.status}`;
    throw new Error(msg);
  }

  return json as T;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: buildHeaders(),
    });
    return parseResponse<T>(response);
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return parseResponse<T>(response);
  },
};