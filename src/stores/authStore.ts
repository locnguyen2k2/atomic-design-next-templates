import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setAuth: (user: User, tokens: { access_token: string; refresh_token: string; expires_in: number }) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (tokens: { access_token: string; refresh_token: string; expires_in: number }) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, tokens) => {
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
          isAuthenticated: true,
          error: null,
        });
        localStorage.setItem('nexusiam-token', tokens.access_token);
      },

      setUser: (user) => set({ user }),

      setTokens: (tokens) => {
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
        });
        localStorage.setItem('nexusiam-token', tokens.access_token);
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('nexusiam-token');
      },

      logout: async () => {
        const { accessToken, refreshToken, clearAuth } = get();
        if (accessToken && refreshToken) {
          try {
            await authApi.logout(accessToken, refreshToken);
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'nexusiam-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresIn: state.expiresIn,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
