import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AnalyticsData {
  totalClicks: number;
  clicksByDay: Record<string, number>;
  clicksByCountry: Array<{ country: string; _count: { id: number } }>;
  clicksByDevice: Array<{ device: string; _count: { id: number } }>;
  clicksByBrowser: Array<{ browser: string; _count: { id: number } }>;
  clicksByReferrer: Array<{ referrer: string; _count: { id: number } }>;
}

interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  recentClicks: number;
  topUrls: Array<{
    id: string;
    shortCode: string;
    clicks: number;
  }>;
}

interface AnalyticsState {
  urlAnalytics: Record<string, AnalyticsData>;
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

interface AnalyticsActions {
  setUrlAnalytics: (urlId: string, analytics: AnalyticsData) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>()(
  immer((set) => ({
    // State
    urlAnalytics: {},
    dashboardStats: null,
    isLoading: false,
    error: null,

    // Actions
    setUrlAnalytics: (urlId, analytics) =>
      set((state) => {
        state.urlAnalytics[urlId] = analytics;
      }),

    setDashboardStats: (stats) =>
      set((state) => {
        state.dashboardStats = stats;
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

    clearAnalytics: () =>
      set((state) => {
        state.urlAnalytics = {};
        state.dashboardStats = null;
      }),
  }))
);

