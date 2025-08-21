import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

// For Next.js API routes, we use relative URLs so they work both in development and production
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Separate client without interceptors for refresh calls
const refreshClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // Do not try to refresh on the refresh endpoint itself
    const url: string = originalRequest?.url || '';
    if (
      url.includes('/auth/refresh') ||
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password')
    ) {
      return Promise.reject(error);
    }

    const hasToken = !!useAuthStore.getState().accessToken;

    if (error.response?.status === 401 && hasToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await refreshClient.post('/auth/refresh');
        const { accessToken } = response.data;

        useAuthStore.getState().setAccessToken(accessToken);

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        useAuthStore
          .getState()
          .setError('Your session expired. Please sign in.');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
