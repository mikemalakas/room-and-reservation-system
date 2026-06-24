// stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-store" },
  ),
);
