// apps/frontend/services/api/training.api.ts

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
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server error ${response.status}: ${text.slice(0, 150)}`);
  }

 if (!response.ok) {
  const err = json as {
    message?: string | string[] | Record<string, unknown>;
    error?: string;
  };

  console.error('❌ TRAINING API ERROR:', {
    status: response.status,
    response: json,
  });

  let message = `Request failed with status ${response.status}`;

  if (typeof err.message === 'string') {
    message = err.message;
  } else if (Array.isArray(err.message)) {
    message = err.message.join(', ');
  } else if (err.message) {
    message = JSON.stringify(err.message);
  } else if (err.error) {
    message = err.error;
  }

  throw new Error(message);
}
  return json;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrainingSession {
  id: string;
  prompt: string;
  userResponse: string;
  aiAnalysis: string;
  traitDeltas: Record<string, number>;
  pointsEarned: number;
  quality: 'low' | 'medium' | 'high' | 'excellent';
  createdAt: string;
}

export interface CloneData {
  id: string;
  name: string;
  personalityProgress: number;
  intelligenceScore: number;
  level: number;
  accuracyPercent: number;
  mood: string;
  trainingCount: number;
  traits: { id: string; name: string; value: number }[];
}

export interface SubmitTrainingResult {
  session: TrainingSession;
  clone: CloneData;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Submit a training session to the backend.
 * Gemini analyzes it, trait scores update, results returned.
 */
export async function submitTraining(
  prompt: string,
  response: string,
): Promise<{ success: boolean; data: SubmitTrainingResult }> {
  return request('/training/submit', {
    method: 'POST',
    body: JSON.stringify({ prompt, response }),
  });
}

/**
 * Get training history for the current user.
 */
export async function getTrainingSessions(): Promise<{
  success: boolean;
  data: TrainingSession[];
}> {
  return request('/training/sessions');
}

/**
 * Get the current user's Clone with all trait scores.
 */
export async function getMyClone(): Promise<{
  success: boolean;
  data: CloneData;
}> {
  return request('/training/clone');
}