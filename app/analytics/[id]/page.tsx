'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink,
  Copy,
  ArrowLeft,
  Zap,
  LinkIcon,
  Activity,
  MousePointer,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  formatNumber,
  formatDate,
  getShortUrl,
  copyToClipboard,
} from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface UrlAnalytics {
  totalClicks: number;
  clicksByDay: Record<string, number>;
  clicksByCountry: Array<{ country: string; _count: { id: number } }>;
  clicksByDevice: Array<{ device: string; _count: { id: number } }>;
  clicksByBrowser: Array<{ browser: string; _count: { id: number } }>;
  clicksByReferrer: Array<{ referrer: string; _count: { id: number } }>;
}

interface UrlDetails {
  id: string;
  shortCode: string;
  longUrl: string;
  title?: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
}

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [urlDetails, setUrlDetails] = useState<UrlDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);

      const [analyticsResponse, urlResponse] = await Promise.all([
        api.get(`/analytics/urls/${params.id}/stats`),
        api.get(`/urls/${params.id}`),
      ]);

      setAnalytics(analyticsResponse.data);
      setUrlDetails(urlResponse.data);
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      if (error.response?.status === 404) {
        toast.error('URL not found');
        router.push('/dashboard');
      } else {
        toast.error('Failed to load analytics');
      }
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadAnalytics();
  }, [isAuthenticated, isHydrated, params.id, router, loadAnalytics]);

  const handleCopyUrl = async () => {
    if (!urlDetails) return;

    const shortUrl = getShortUrl(urlDetails.shortCode);
    try {
      await copyToClipboard(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3">
              <BarChart3 className="h-full w-full text-white" />
            </div>
            <div className="absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
          <h2 className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
            Loading analytics...
          </h2>
          <p className="mt-2 text-gray-600">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !urlDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mb-6 inline-block h-20 w-20 rounded-full bg-gradient-to-r from-red-100 to-orange-100 p-5">
            <BarChart3 className="h-full w-full text-red-500" />
          </div>
          <h2 className="mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
            Analytics Not Found
          </h2>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            We couldn't load the analytics data for this URL. It might not exist
            or you don't have permission to view it.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const shortUrl = getShortUrl(urlDetails.shortCode);

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
                    DV4 Links
                  </h1>
                  <p className="hidden text-xs text-gray-500 sm:block">
                    Analytics Dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Hero Section */}
      <div className="container mx-auto px-4 pt-6 sm:pt-8">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 flex items-center justify-center space-x-2">
            <BarChart3 className="h-8 w-8 animate-pulse text-blue-600" />
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              URL Analytics
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Deep insights into your link performance 📊
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-6 sm:pb-8">
        {/* Enhanced URL Info Card */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-white to-blue-50/50 shadow-xl backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-start space-x-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2 shadow-lg">
                    <LinkIcon className="h-full w-full text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <h3 className="truncate text-xl font-bold text-gray-900">
                        {shortUrl}
                      </h3>
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium shadow-sm ${
                          urlDetails.isActive
                            ? 'border border-green-200 bg-green-100 text-green-700'
                            : 'border border-red-200 bg-red-100 text-red-700'
                        }`}
                      >
                        {urlDetails.isActive ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                    <p className="mb-2 truncate rounded border bg-white px-2 py-1 font-mono text-sm text-gray-600">
                      {urlDetails.longUrl}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Activity className="h-4 w-4" />
                      <span>Created {formatDate(urlDetails.createdAt)}</span>
                      <span>•</span>
                      <MousePointer className="h-4 w-4" />
                      <span className="font-medium">
                        {formatNumber(urlDetails.clicks)} total clicks
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="bg-white transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-white transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                >
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative transform overflow-hidden border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Total Clicks
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={analytics.totalClicks} />
                  </p>
                  <p className="mt-1 text-xs text-blue-200">
                    All time performance
                  </p>
                </div>
                <div className="relative">
                  <MousePointer className="h-12 w-12 text-blue-200" />
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
                    Countries
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={analytics.clicksByCountry.length} />
                  </p>
                  <p className="mt-1 text-xs text-green-200">Global reach</p>
                </div>
                <div className="relative">
                  <Globe className="h-12 w-12 text-green-200" />
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
                    Device Types
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={analytics.clicksByDevice.length} />
                  </p>
                  <p className="mt-1 text-xs text-purple-200">
                    Platform diversity
                  </p>
                </div>
                <Smartphone className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative transform overflow-hidden border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">
                    Traffic Sources
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={analytics.clicksByReferrer.length} />
                  </p>
                  <p className="mt-1 text-xs text-orange-200">
                    Referrer variety
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Enhanced Top Countries */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-lg text-transparent">
                    Top Countries
                  </CardTitle>
                  <CardDescription>Global reach of your link</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.clicksByCountry.length > 0 ? (
                <div className="space-y-4">
                  {analytics.clicksByCountry.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 p-3 transition-all duration-200 hover:from-blue-50 hover:to-green-50"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.country || 'Unknown'}
                        </span>
                      </div>
                      <span className="rounded bg-white px-2 py-1 text-sm font-bold text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Globe className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No geographic data yet</p>
                  <p className="text-xs text-gray-400">
                    Share your link to see countries!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Device Types */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-lg text-transparent">
                    Device Types
                  </CardTitle>
                  <CardDescription>How users access your link</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.clicksByDevice.length > 0 ? (
                <div className="space-y-4">
                  {analytics.clicksByDevice.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-purple-50 p-3 transition-all duration-200 hover:from-purple-50 hover:to-blue-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-100 p-1.5">
                          {item.device === 'mobile' && (
                            <Smartphone className="h-full w-full text-purple-600" />
                          )}
                          {item.device === 'desktop' && (
                            <Monitor className="h-full w-full text-purple-600" />
                          )}
                          {item.device !== 'mobile' &&
                            item.device !== 'desktop' && (
                              <Eye className="h-full w-full text-purple-600" />
                            )}
                        </div>
                        <span className="font-medium capitalize text-gray-900">
                          {item.device || 'Unknown'}
                        </span>
                      </div>
                      <span className="rounded bg-white px-2 py-1 text-sm font-bold text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Smartphone className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No device data yet</p>
                  <p className="text-xs text-gray-400">
                    Clicks will show device types!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Top Browsers */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-lg text-transparent">
                    Top Browsers
                  </CardTitle>
                  <CardDescription>Most popular browsers used</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.clicksByBrowser.length > 0 ? (
                <div className="space-y-4">
                  {analytics.clicksByBrowser.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-orange-50 p-3 transition-all duration-200 hover:from-orange-50 hover:to-red-50"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-800">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.browser || 'Unknown'}
                        </span>
                      </div>
                      <span className="rounded bg-white px-2 py-1 text-sm font-bold text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Monitor className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No browser data yet</p>
                  <p className="text-xs text-gray-400">
                    Clicks will show browser types!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Top Referrers */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg text-transparent">
                    Traffic Sources
                  </CardTitle>
                  <CardDescription>Where your clicks come from</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.clicksByReferrer.length > 0 ? (
                <div className="space-y-4">
                  {analytics.clicksByReferrer.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-indigo-50 p-3 transition-all duration-200 hover:from-indigo-50 hover:to-purple-50"
                    >
                      <div className="flex min-w-0 flex-1 items-center space-x-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
                          {index + 1}
                        </span>
                        <span className="truncate font-medium text-gray-900">
                          {item.referrer || '🌍 Direct Traffic'}
                        </span>
                      </div>
                      <span className="ml-2 rounded bg-white px-2 py-1 text-sm font-bold text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <TrendingUp className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No referrer data yet</p>
                  <p className="text-xs text-gray-400">
                    Share your link to see traffic sources!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
