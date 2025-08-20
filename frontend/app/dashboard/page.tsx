'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import {
  LinkIcon,
  BarChart3,
  Plus,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  TrendingUp,
  Users,
  Globe,
  Calendar,
  LogOut,
  Power,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUrlStore } from '@/store/url-store';
import { useAnalyticsStore } from '@/store/analytics-store';
import { DashboardUrlShortener } from '@/components/features/DashboardUrlShortener';
import {
  formatDate,
  formatNumber,
  getShortUrl,
  copyToClipboard,
} from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUrlShortener, setShowUrlShortener] = useState(false);
  const [reactivatingId, setReactivatingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const router = useRouter();

  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const { urls, setUrls, removeUrl } = useUrlStore();
  const { dashboardStats, setDashboardStats } = useAnalyticsStore();

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, isHydrated, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load user URLs and dashboard stats in parallel
      const [urlsResponse, statsResponse] = await Promise.all([
        api.get('/urls'),
        api.get('/analytics/dashboard'),
      ]);

      setUrls(urlsResponse.data.urls, urlsResponse.data.pagination);
      setDashboardStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async (shortCode: string) => {
    const shortUrl = getShortUrl(shortCode);
    try {
      await copyToClipboard(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDeleteUrl = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      await api.delete(`/urls/${id}`);
      removeUrl(id);
      toast.success('URL deleted successfully');

      // Reload stats after deletion
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activated' : 'deactivated';

    setTogglingId(id);
    try {
      console.log('Toggling URL:', { id, currentStatus, newStatus });

      const response = await api.patch(`/urls/${id}`, {
        isActive: newStatus,
      });

      console.log('Toggle response:', response.data);

      // Always reload dashboard data to ensure UI is consistent (same as reactivate)
      await loadDashboardData();

      toast.success(`URL ${action} successfully`);
    } catch (error: any) {
      console.error('Toggle error details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);

      const message =
        error.response?.data?.message ||
        `Failed to ${action} URL. Status: ${error.response?.status || 'Unknown'}`;
      toast.error(message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleReactivateUrl = async (id: string) => {
    setReactivatingId(id);
    try {
      const response = await api.post(`/urls/${id}/reactivate`);

      console.log('Reactivate response:', response.data);

      // Always reload dashboard data to ensure UI is up to date
      await loadDashboardData();

      toast.success('URL reactivated and extended for 90 days!');
    } catch (error: any) {
      console.error('Reactivate error:', error);
      console.error('Error response:', error.response?.data);
      const message =
        error.response?.data?.message || 'Failed to reactivate URL';
      toast.error(message);
    } finally {
      setReactivatingId(null);
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return null; // Will redirect in useEffect or still hydrating
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name || user?.email}!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => setShowUrlShortener(!showUrlShortener)}>
                <Plus className="mr-2 h-4 w-4" />
                {showUrlShortener ? 'Hide Form' : 'Create Short URL'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* URL Shortener Form */}
        {showUrlShortener && (
          <div className="mb-8">
            <DashboardUrlShortener
              onClose={() => setShowUrlShortener(false)}
              onUrlCreated={async () => {
                // Small delay to ensure backend has processed the URL
                setTimeout(async () => {
                  await loadDashboardData();
                  setShowUrlShortener(false);
                }, 500);
              }}
            />
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total URLs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(dashboardStats?.totalUrls || 0)}
                  </p>
                </div>
                <LinkIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Clicks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(dashboardStats?.totalClicks || 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Recent Clicks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(dashboardStats?.recentClicks || 0)}
                  </p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats?.totalUrls
                      ? Math.round(
                          (dashboardStats.totalClicks /
                            dashboardStats.totalUrls) *
                            100
                        ) / 100
                      : 0}
                  </p>
                  <p className="text-xs text-gray-500">Clicks per URL</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing URLs */}
        {dashboardStats?.topUrls && dashboardStats.topUrls.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Performing URLs</CardTitle>
              <CardDescription>Your most popular short links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.topUrls.map((url, index) => (
                  <div
                    key={url.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getShortUrl(url.shortCode)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(url.clicks)} clicks
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyUrl(url.shortCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>
              Manage and track your shortened links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {urls.length === 0 ? (
              <div className="py-12 text-center">
                <LinkIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No URLs yet
                </h3>
                <p className="mb-4 text-gray-600">
                  Create your first short URL to get started
                </p>
                <Button onClick={() => setShowUrlShortener(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Short URL
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h3 className="truncate text-lg font-medium text-gray-900">
                            {getShortUrl(url.shortCode)}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              url.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {url.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mb-2 truncate text-sm text-gray-600">
                          {url.longUrl}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{formatNumber(url.clicks)} clicks</span>
                          <span>Created {formatDate(url.createdAt)}</span>
                          {url.expiresAt ? (
                            <span
                              className={`${
                                new Date(url.expiresAt) < new Date()
                                  ? 'font-medium text-red-600'
                                  : new Date(url.expiresAt) <
                                      new Date(
                                        Date.now() + 7 * 24 * 60 * 60 * 1000
                                      )
                                    ? 'font-medium text-orange-600'
                                    : 'text-gray-500'
                              }`}
                            >
                              {new Date(url.expiresAt) < new Date()
                                ? '🔴 Expired'
                                : `⏰ Expires ${formatDate(url.expiresAt)}`}
                            </span>
                          ) : (
                            <span className="text-green-600">
                              ♾️ Never expires
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(url.shortCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={getShortUrl(url.shortCode)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/analytics/${url.id}`)}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleActive(url.id, url.isActive)
                          }
                          className={`${
                            url.isActive
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={
                            url.isActive ? 'Deactivate URL' : 'Activate URL'
                          }
                          disabled={togglingId === url.id}
                        >
                          <Power
                            className={`h-4 w-4 ${
                              togglingId === url.id ? 'animate-pulse' : ''
                            }`}
                          />
                        </Button>

                        {/* Show reactivate button for expired or inactive URLs */}
                        {(!url.isActive ||
                          (url.expiresAt &&
                            new Date(url.expiresAt) < new Date())) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReactivateUrl(url.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Reactivate and extend for 90 days"
                            disabled={reactivatingId === url.id}
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${
                                reactivatingId === url.id ? 'animate-spin' : ''
                              }`}
                            />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUrl(url.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
