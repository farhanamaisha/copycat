// apps/frontend/services/api/auth.api.ts
import { apiClient } from "./client";

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/register", data);
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", data);
}

export async function logoutUser(): Promise<void> {
  return apiClient.post<void>("/auth/logout", {});
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  return apiClient.post<{ accessToken: string }>("/auth/refresh", {});
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/verify-email", { token });
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/forgot-password", { email });
}

export async function resetPassword(data: {
  token: string;
  password: string;
}): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/reset-password", data);
}