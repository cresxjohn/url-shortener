'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
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
  }, [isAuthenticated, isHydrated, params.id, router]);

  const loadAnalytics = async () => {
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
  };

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !urlDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Analytics not found
          </h2>
          <p className="mb-4 text-gray-600">
            The analytics data for this URL could not be loaded.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const shortUrl = getShortUrl(urlDetails.shortCode);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  URL Analytics
                </h1>
                <p className="text-gray-600">Detailed performance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* URL Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {shortUrl}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      urlDetails.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {urlDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mb-2 truncate text-gray-600">
                  {urlDetails.longUrl}
                </p>
                <p className="text-sm text-gray-500">
                  Created {formatDate(urlDetails.createdAt)}
                </p>
              </div>

              <div className="ml-4 flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Clicks
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(analytics.totalClicks)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Countries</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.clicksByCountry.length}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Devices</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.clicksByDevice.length}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Referrers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.clicksByReferrer.length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Clicks by geographic location</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.clicksByCountry.length > 0 ? (
                <div className="space-y-3">
                  {analytics.clicksByCountry.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-900">
                        {item.country || 'Unknown'}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>Clicks by device category</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.clicksByDevice.length > 0 ? (
                <div className="space-y-3">
                  {analytics.clicksByDevice.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {item.device === 'mobile' && (
                          <Smartphone className="mr-2 h-4 w-4 text-gray-600" />
                        )}
                        {item.device === 'desktop' && (
                          <Monitor className="mr-2 h-4 w-4 text-gray-600" />
                        )}
                        {item.device !== 'mobile' &&
                          item.device !== 'desktop' && (
                            <BarChart3 className="mr-2 h-4 w-4 text-gray-600" />
                          )}
                        <span className="text-sm capitalize text-gray-900">
                          {item.device || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Browsers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Browsers</CardTitle>
              <CardDescription>Clicks by browser type</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.clicksByBrowser.length > 0 ? (
                <div className="space-y-3">
                  {analytics.clicksByBrowser.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-900">
                        {item.browser || 'Unknown'}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Traffic sources</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.clicksByReferrer.length > 0 ? (
                <div className="space-y-3">
                  {analytics.clicksByReferrer.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate text-sm text-gray-900">
                        {item.referrer || 'Direct'}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {formatNumber(item._count.id)} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No referrer data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
