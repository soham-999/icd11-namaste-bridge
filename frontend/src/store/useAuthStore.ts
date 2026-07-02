// src/store/useAuthStore.ts — REPLACE poori file isse
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, UserRole } from '../api/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

// Demo/sample user — always used as the default so no sidebar module is
// ever hidden just because .env wasn't set up yet. Once real login via
// /auth/login is wired (see Login.tsx -> setSession), that call overwrites
// this and the real logged-in user + role take over automatically.
const sampleUser: AuthUser = {
  id: 'usr-1', name: 'Dr. Ananya Rao', email: 'ananya.rao@namaste-icd.org',
  role: 'Admin', department: 'Ayurveda',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: sampleUser,
      token: 'sample-jwt-token',
      setSession: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      hasRole: (roles) => {
        const role = get().user?.role;
        return !!role && roles.includes(role);
      },
    }),
    { name: 'namaste-icd-auth' }
  )
);