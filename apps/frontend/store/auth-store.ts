"use client";

import { create } from "zustand";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "@/features/auth/auth.service";
import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "@/features/auth/auth.types";

const TOKEN_KEY = "accessToken";
const COOKIE_NAME = "auth_token";

type AuthState = {
  error: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
};

function persistToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=604800; SameSite=Lax`;
}

function readToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

function removeToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { detail?: string };

    if (data.detail) {
      return data.detail;
    }
  }

  return "Authentication request failed.";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  error: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  token: null,
  user: null,
  clearError: () => set({ error: null }),
  fetchCurrentUser: async () => {
    set({ error: null, isLoading: true });

    try {
      const user = await getCurrentUser();

      set({ isAuthenticated: true, isLoading: false, user });
    } catch (error) {
      removeToken();
      set({
        error: getErrorMessage(error),
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
      });
    }
  },
  hydrate: async () => {
    const token = readToken();

    if (!token) {
      set({ isHydrated: true });
      return;
    }

    set({ isAuthenticated: true, isHydrated: true, token });
    await get().fetchCurrentUser();
  },
  login: async (payload) => {
    set({ error: null, isLoading: true });

    try {
      const response = await loginUser(payload);

      persistToken(response.access_token);
      set({
        isAuthenticated: true,
        isLoading: false,
        token: response.access_token,
        user: response.user,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
  logout: () => {
    removeToken();
    set({
      error: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      user: null,
    });
  },
  register: async (payload) => {
    set({ error: null, isLoading: true });

    try {
      const response = await registerUser(payload);

      persistToken(response.access_token);
      set({
        isAuthenticated: true,
        isLoading: false,
        token: response.access_token,
        user: response.user,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
}));
