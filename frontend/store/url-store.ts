import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Url {
  id: string;
  shortCode: string;
  longUrl: string;
  title?: string;
  description?: string;
  customSlug?: string;
  isActive: boolean;
  clicks: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UrlPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UrlState {
  urls: Url[];
  currentUrl: Url | null;
  pagination: UrlPagination | null;
  isLoading: boolean;
  error: string | null;
  recentUrl: Url | null; // For displaying the most recently created URL
}

interface UrlActions {
  setUrls: (urls: Url[], pagination?: UrlPagination) => void;
  addUrl: (url: Url) => void;
  updateUrl: (id: string, updates: Partial<Url>) => void;
  removeUrl: (id: string) => void;
  setCurrentUrl: (url: Url | null) => void;
  setRecentUrl: (url: Url | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setPagination: (pagination: UrlPagination) => void;
}

export const useUrlStore = create<UrlState & UrlActions>()(
  immer((set) => ({
    // State
    urls: [],
    currentUrl: null,
    pagination: null,
    isLoading: false,
    error: null,
    recentUrl: null,

    // Actions
    setUrls: (urls, pagination) =>
      set((state) => {
        state.urls = urls || [];
        if (pagination) {
          state.pagination = pagination;
        }
      }),

    addUrl: (url) =>
      set((state) => {
        state.urls.unshift(url);
        state.recentUrl = url;
      }),

    updateUrl: (id, updates) =>
      set((state) => {
        const index = state.urls.findIndex((url) => url.id === id);
        if (index !== -1) {
          state.urls[index] = { ...state.urls[index], ...updates };
        }
        if (state.currentUrl?.id === id) {
          state.currentUrl = { ...state.currentUrl, ...updates };
        }
      }),

    removeUrl: (id) =>
      set((state) => {
        state.urls = state.urls.filter((url) => url.id !== id);
        if (state.currentUrl?.id === id) {
          state.currentUrl = null;
        }
      }),

    setCurrentUrl: (url) =>
      set((state) => {
        state.currentUrl = url;
      }),

    setRecentUrl: (url) =>
      set((state) => {
        state.recentUrl = url;
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

    setPagination: (pagination) =>
      set((state) => {
        state.pagination = pagination;
      }),
  }))
);
