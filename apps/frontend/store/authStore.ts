// apps/frontend/store/authStore.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Clone } from "@/types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  clone: Clone | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setClone: (clone: Clone) => void;
  logout: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      clone: null,
      isAuthenticated: false,
      isLoading: true,

      setToken: (token) => {
        // Also set as cookie so middleware can read it
        document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        set({ accessToken: token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      setClone: (clone) => set({ clone }),

      setLoading: (v) => set({ isLoading: v }),

      logout: () => {
        // Clear cookie
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem("accessToken");
        set({
          accessToken: null,
          user: null,
          clone: null,
          isAuthenticated: false,
        });
        window.location.href = "/sign-in";
      },
    }),
    {
      name: "copycat-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        clone: state.clone,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);