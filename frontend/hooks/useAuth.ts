'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    accessToken,
    isHydrated,
    logout,
    setUser,
    setLoading,
    setError,
  } = useAuthStore();

  const router = useRouter();

  // Only run auth check after hydration is complete
  useEffect(() => {
    if (isHydrated && isAuthenticated && accessToken) {
      // Verify token is still valid
      checkAuthStatus();
    }
  }, [isHydrated]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      // Token is invalid, logout user
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout API fails, clear local state
      console.error('Logout error:', error);
    } finally {
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    isHydrated,
    logout: handleLogout,
    requireAuth,
    checkAuthStatus,
  };
}
