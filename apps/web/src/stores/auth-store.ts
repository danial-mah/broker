import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setSession: (session: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (session) => set(session),
      logout: () => set({ accessToken: null, refreshToken: null, user: null })
    }),
    { name: 'broker-session' }
  )
);
