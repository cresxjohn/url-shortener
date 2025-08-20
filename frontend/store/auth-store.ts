import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      // Actions
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
        }),

      setAccessToken: (token) =>
        set((state) => {
          state.accessToken = token;
        }),

      login: (user, accessToken) =>
        set((state) => {
          state.user = user;
          state.accessToken = accessToken;
          state.isAuthenticated = true;
          state.error = null;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
          state.error = null;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),

      setHydrated: (hydrated) =>
        set((state) => {
          state.isHydrated = hydrated;
        }),
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
