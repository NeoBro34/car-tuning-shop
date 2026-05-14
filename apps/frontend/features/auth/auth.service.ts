import { apiClient } from "@/services/api-client";
import type {
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  User,
} from "@/features/auth/auth.types";

export async function registerUser(payload: RegisterPayload) {
  const response = await apiClient.post<TokenResponse>("/auth/register", payload);

  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await apiClient.post<TokenResponse>("/auth/login", payload);

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<User>("/auth/me");

  return response.data;
}
