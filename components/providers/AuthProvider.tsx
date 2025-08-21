'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    isHydrated,
    isAuthenticated,
    accessToken,
    user,
    setUser,
    logout,
    setLoading,
    setHydrated,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Wait for hydration to complete
      if (!isHydrated) {
        return;
      }

      setLoading(true);

      try {
        // If we have a token and user data, validate the token
        if (accessToken && isAuthenticated && user) {
          // Verify the token is still valid by making a request to /auth/me
          const response = await api.get('/auth/me');

          // If successful, update user data in case it changed
          setUser(response.data);
        } else {
          // No valid auth state, ensure we're logged out
          logout();
        }
      } catch (error) {
        // Token is invalid or expired, logout
        console.warn('Auth token validation failed:', error);
        logout();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [
    isHydrated,
    accessToken,
    isAuthenticated,
    user,
    setUser,
    logout,
    setLoading,
  ]);

  // Ensure hydration is triggered on mount
  useEffect(() => {
    if (!isHydrated) {
      // Small delay to ensure store is ready
      const timer = setTimeout(() => {
        setHydrated(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isHydrated, setHydrated]);

  // Show loading state while initializing auth
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
