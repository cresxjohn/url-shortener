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
  Calendar,
  LogOut,
  Power,
  RefreshCw,
  Zap,
  Target,
  Clock,
  MousePointer,
  QrCode,
  Star,
  Activity,
  Sparkles,
  Rocket,
  Heart,
  Download,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUrlStore } from '@/store/url-store';
import { useAnalyticsStore } from '@/store/analytics-store';
import { DashboardUrlShortener } from '@/components/features/DashboardUrlShortener';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/Dialog';
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
  const [qrData, setQrData] = useState<{
    url: string;
    shortCode: string;
  } | null>(null);
  const router = useRouter();

  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const { urls, setUrls, removeUrl } = useUrlStore();
  const { dashboardStats, setDashboardStats } = useAnalyticsStore();

  // QR Code functions
  const generateQRUrl = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const downloadQR = async (url: string, shortCode: string) => {
    try {
      const response = await fetch(generateQRUrl(url));
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `linkforge-qr-${shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      const link = document.createElement('a');
      link.href = generateQRUrl(url);
      link.download = `linkforge-qr-${shortCode}.png`;
      link.click();
    }
  };

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3">
              <Sparkles className="h-full w-full text-white" />
            </div>
            <div className="absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
          <h2 className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
            Preparing your magic dashboard...
          </h2>
          <p className="mt-2 text-gray-600">Summoning your links ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Header with Branding */}
      <div className="border-b bg-white/80 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 shadow-lg sm:h-10 sm:w-10 sm:p-2">
                    <Zap className="h-full w-full text-white" />
                  </div>
                  <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400 sm:h-4 sm:w-4"></div>
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                    LinkForge
                  </h1>
                  <p className="hidden text-xs text-gray-500 sm:block">
                    Professional Dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={() => setShowUrlShortener(!showUrlShortener)}
                className="transform bg-gradient-to-r from-blue-600 to-purple-600 px-3 text-sm text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:px-4 sm:text-base"
              >
                <Sparkles className="mr-1 h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {showUrlShortener ? 'Hide Magic' : 'Create Magic Link'}
                </span>
                <span className="sm:hidden">Create</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 pt-6 sm:pt-8">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-2 flex items-center justify-center space-x-2">
            <Heart className="h-6 w-6 animate-pulse text-red-500" />
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Ready to create some magic? ✨
          </p>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="container mx-auto px-4 pb-6 sm:pb-8">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative transform overflow-hidden border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Total Links
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={dashboardStats?.totalUrls || 0} />
                  </p>
                  <p className="mt-1 text-xs text-blue-200">+12% this month</p>
                </div>
                <div className="relative">
                  <LinkIcon className="h-12 w-12 text-blue-200" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-white/20"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative transform overflow-hidden border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">
                    Total Clicks
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={dashboardStats?.totalClicks || 0} />
                  </p>
                  <p className="mt-1 text-xs text-green-200">+28% this week</p>
                </div>
                <div className="relative">
                  <MousePointer className="h-12 w-12 text-green-200" />
                  <div className="absolute inset-0 animate-bounce rounded-full bg-white/20"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative transform overflow-hidden border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">
                    Click Rate
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter
                      end={
                        Math.round(
                          ((dashboardStats?.totalClicks || 0) /
                            Math.max(dashboardStats?.totalUrls || 1, 1)) *
                            10
                        ) / 10
                      }
                    />
                  </p>
                  <p className="mt-1 text-xs text-purple-200">avg per link</p>
                </div>
                <Target className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative transform overflow-hidden border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">
                    Active Links
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter
                      end={urls.filter((url) => url.isActive).length}
                    />
                  </p>
                  <p className="mt-1 text-xs text-orange-200">ready to share</p>
                </div>
                <Activity className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* URL Shortener Form */}
        {showUrlShortener && (
          <div className="animate-in slide-in-from-top mb-8 transform duration-500">
            <DashboardUrlShortener
              onClose={() => setShowUrlShortener(false)}
              onUrlCreated={async () => {
                setTimeout(async () => {
                  await loadDashboardData();
                  setShowUrlShortener(false);
                }, 500);
              }}
            />
          </div>
        )}

        {/* Enhanced URLs Section */}
        <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5">
                  <Rocket className="h-full w-full text-white" />
                </div>
                <div>
                  <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl text-transparent">
                    Your Magic Links
                  </CardTitle>
                  <CardDescription>
                    Manage, track, and optimize your shortened URLs
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-500">
                  {urls.length} total
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {urls.length === 0 ? (
              <div className="py-16 text-center">
                <div className="relative inline-block">
                  <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-6">
                    <Sparkles className="h-full w-full text-blue-500" />
                  </div>
                  <div className="absolute -right-2 -top-2 h-6 w-6 animate-bounce rounded-full bg-yellow-400">
                    <Star className="m-1 h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  Ready to create magic? ✨
                </h3>
                <p className="mx-auto mb-6 max-w-md text-gray-600">
                  Transform your long, boring URLs into powerful, trackable
                  magic links that enchant your audience!
                </p>
                <Button
                  onClick={() => setShowUrlShortener(true)}
                  className="transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your First Magic Link
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {urls.map((url, index) => (
                  <Card
                    key={url.id}
                    className="group relative transform overflow-hidden border border-gray-200 bg-gradient-to-r from-white to-blue-50/30 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        {/* URL Info Section */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex items-start space-x-3">
                            <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 transition-transform duration-200 group-hover:scale-110">
                              <LinkIcon className="h-full w-full text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <h3 className="truncate font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                                  {getShortUrl(url.shortCode)}
                                </h3>
                                <span
                                  className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    url.isActive
                                      ? 'border border-green-200 bg-green-100 text-green-700'
                                      : 'border border-red-200 bg-red-100 text-red-700'
                                  }`}
                                >
                                  {url.isActive ? '🟢 Active' : '🔴 Inactive'}
                                </span>
                              </div>
                              <p className="mb-2 truncate text-sm text-gray-600">
                                {url.longUrl}
                              </p>

                              {/* Stats Row */}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <MousePointer className="h-3 w-3" />
                                  <span className="font-medium">
                                    {formatNumber(url.clicks)}
                                  </span>
                                  <span>clicks</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Created {formatDate(url.createdAt)}
                                  </span>
                                </div>
                                {url.expiresAt ? (
                                  <div
                                    className={`flex items-center space-x-1 ${
                                      new Date(url.expiresAt) < new Date()
                                        ? 'font-medium text-red-600'
                                        : new Date(url.expiresAt) <
                                            new Date(
                                              Date.now() +
                                                7 * 24 * 60 * 60 * 1000
                                            )
                                          ? 'font-medium text-orange-600'
                                          : 'text-gray-500'
                                    }`}
                                  >
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(url.expiresAt) < new Date()
                                        ? '❌ Expired'
                                        : `⏰ Expires ${formatDate(url.expiresAt)}`}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1 text-green-600">
                                    <Activity className="h-3 w-3" />
                                    <span>♾️ Never expires</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="flex flex-shrink-0 items-center justify-end gap-1">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyUrl(url.shortCode)}
                              className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                              title="Open link"
                            >
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
                              onClick={() =>
                                setQrData({
                                  url: getShortUrl(url.shortCode),
                                  shortCode: url.shortCode,
                                })
                              }
                              className="transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                              title="Generate QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/analytics/${url.id}`)
                              }
                              className="transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                              title="View analytics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mx-1 h-6 w-px bg-gray-200"></div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleToggleActive(url.id, url.isActive)
                              }
                              className={`transition-all duration-200 ${
                                url.isActive
                                  ? 'text-green-600 hover:bg-green-50 hover:text-green-700'
                                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
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

                            {(!url.isActive ||
                              (url.expiresAt &&
                                new Date(url.expiresAt) < new Date())) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReactivateUrl(url.id)}
                                className="text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700"
                                title="Reactivate and extend for 90 days"
                                disabled={reactivatingId === url.id}
                              >
                                <RefreshCw
                                  className={`h-4 w-4 ${
                                    reactivatingId === url.id
                                      ? 'animate-spin'
                                      : ''
                                  }`}
                                />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUrl(url.id)}
                              className="text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
                              title="Delete URL"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      {!showUrlShortener && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
          <Button
            onClick={() => setShowUrlShortener(true)}
            className="hover:shadow-3xl h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={!!qrData} onOpenChange={(open) => !open && setQrData(null)}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="border-0 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <DialogTitle className="text-white">
                  QR Code Generator
                </DialogTitle>
              </div>
              <DialogClose
                onClick={() => setQrData(null)}
                className="text-white hover:bg-white/20"
              />
            </div>
          </DialogHeader>

          <div className="p-6 text-center">
            {/* QR Code Display */}
            <div className="mb-6 inline-block rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-inner">
              {qrData && (
                <img
                  src={generateQRUrl(qrData.url)}
                  alt={`QR Code for ${qrData.shortCode}`}
                  className="mx-auto h-40 w-40 rounded-lg"
                />
              )}
            </div>

            {/* URL Display */}
            <div className="mb-6 rounded-lg border bg-gray-50 p-3">
              <p className="mb-1 text-xs text-gray-500">Shortened URL:</p>
              <p className="break-all rounded border bg-white px-2 py-1 font-mono text-sm text-gray-800">
                {qrData?.url}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() =>
                  qrData && downloadQR(qrData.url, qrData.shortCode)
                }
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
              <Button
                variant="outline"
                onClick={() => setQrData(null)}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Close
              </Button>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              💡 Share this QR code to let others quickly access your link
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
