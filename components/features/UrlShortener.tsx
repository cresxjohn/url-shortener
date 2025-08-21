'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  Copy,
  ExternalLink,
  Loader2,
  Check,
  Sparkles,
  Star,
  Heart,
  Zap,
} from 'lucide-react';
import { useUrlStore } from '@/store/url-store';
import { isValidUrl, getShortUrl, copyToClipboard } from '@/lib/utils';
import { validateCustomSlug } from '@/lib/validation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expirationOption, setExpirationOption] = useState('never');
  const [customExpirationDate, setCustomExpirationDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { recentUrl, addUrl, setError } = useUrlStore();

  const getExpirationDate = () => {
    if (expirationOption === 'never') return null;
    if (expirationOption === 'custom') {
      return customExpirationDate
        ? new Date(customExpirationDate).toISOString()
        : null;
    }

    const now = new Date();
    switch (expirationOption) {
      case '1week':
        now.setDate(now.getDate() + 7);
        break;
      case '1month':
        now.setMonth(now.getMonth() + 1);
        break;
      case '3months':
        now.setMonth(now.getMonth() + 3);
        break;
      case '6months':
        now.setMonth(now.getMonth() + 6);
        break;
      case '1year':
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        return null;
    }
    return now.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    if (!isValidUrl(longUrl)) {
      toast.error(
        '🔮 Please enter a valid URL (must include http:// or https://)'
      );
      return;
    }

    // Validate custom slug if provided
    if (customSlug.trim()) {
      const slugValidation = validateCustomSlug(customSlug.trim());
      if (!slugValidation.isValid) {
        toast.error(`❌ ${slugValidation.error}`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const requestData: any = {
        longUrl: longUrl.trim(),
        customSlug: customSlug.trim() || undefined,
      };

      const expiresAt = getExpirationDate();
      if (expiresAt) {
        requestData.expiresAt = expiresAt;
      }

      const response = await api.post('/urls', requestData);

      const newUrl = response.data;
      addUrl(newUrl);

      // Clear form
      setLongUrl('');
      setCustomSlug('');
      setExpirationOption('never');
      setCustomExpirationDate('');

      toast.success('🎉 Short link created successfully!');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to create short link';
      toast.error(`🔥 ${message}`);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await copyToClipboard(url);
      setCopiedUrl(url);
      toast.success('📋 Link copied to clipboard!');

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error('⚠️ Failed to copy link');
    }
  };

  const shortUrl = recentUrl ? getShortUrl(recentUrl.shortCode) : '';

  return (
    <div className="mx-auto max-w-2xl">
      {/* URL Shortener Form */}
      <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="rounded-t-lg border-b bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="text-center">
            <div className="mb-3 flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 animate-bounce text-blue-500" />
              <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                Create Your Short Link
              </h2>
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-sm text-gray-600">
              Transform your long URLs into powerful short links ✨
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="longUrl"
              className="mb-2 flex items-center text-sm font-medium text-gray-700"
            >
              <Zap className="mr-1 h-4 w-4 text-blue-500" />
              URL to Shorten
            </label>
            <Input
              id="longUrl"
              type="url"
              placeholder="Enter your long URL (e.g., https://example.com/very-long-url)"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50 text-base transition-all duration-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="customSlug"
              className="mb-2 flex items-center text-sm font-medium text-gray-700"
            >
              <Star className="mr-1 h-4 w-4 text-purple-500" />
              Custom Short Code (Optional)
            </label>
            <Input
              id="customSlug"
              type="text"
              placeholder="Custom short code (optional) - e.g., my-awesome-link"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              className="border-gray-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 text-base transition-all duration-200 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for auto-generated short code
            </p>
          </div>

          <div>
            <label
              htmlFor="expiration"
              className="mb-2 flex items-center text-sm font-medium text-gray-700"
            >
              <Heart className="mr-1 h-4 w-4 text-red-500" />
              Link Expiration
            </label>
            <select
              id="expiration"
              value={expirationOption}
              onChange={(e) => setExpirationOption(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gradient-to-r from-green-50/50 to-blue-50/50 px-3 py-2 text-base shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            >
              <option value="never">Never expires</option>
              <option value="1week">1 week</option>
              <option value="1month">1 month</option>
              <option value="3months">3 months</option>
              <option value="6months">6 months</option>
              <option value="1year">1 year</option>
              <option value="custom">Custom duration</option>
            </select>

            {expirationOption === 'custom' && (
              <div className="mt-2">
                <Input
                  type="datetime-local"
                  value={customExpirationDate}
                  onChange={(e) => setCustomExpirationDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="border-gray-200 bg-gradient-to-r from-purple-50/50 to-blue-50/50 text-base transition-all duration-200 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              {expirationOption === 'never' && 'Your link will never expire'}
              {expirationOption === '1week' &&
                'Your link will expire after 1 week'}
              {expirationOption === '1month' &&
                'Your link will expire after 1 month'}
              {expirationOption === '3months' &&
                'Your link will expire after 3 months'}
              {expirationOption === '6months' &&
                'Your link will expire after 6 months'}
              {expirationOption === '1year' &&
                'Your link will expire after 1 year'}
              {expirationOption === 'custom' &&
                'Choose a specific expiration date and time'}
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full transform bg-gradient-to-r from-blue-600 to-purple-600 text-base text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Link...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Create Short Link
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Result Display */}
      {recentUrl && (
        <Card className="mt-6 border-0 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6 shadow-xl">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 animate-bounce text-green-500" />
              <h3 className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-lg font-semibold text-transparent">
                ✨ Your short link is ready! ✨
              </h3>
              <Star className="h-6 w-6 animate-pulse text-yellow-500" />
            </div>

            <div className="space-y-3">
              {/* Short URL Display */}
              <div className="flex items-center gap-2 rounded-lg border-2 border-blue-200 bg-white/80 p-3 shadow-md backdrop-blur-sm">
                <div className="flex-1 text-left">
                  <div className="mb-1 flex items-center gap-1">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium text-blue-800">
                      Short Link:
                    </p>
                  </div>
                  <p className="truncate rounded bg-blue-50 px-2 py-1 font-mono font-medium text-blue-600">
                    {shortUrl}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(shortUrl)}
                    className="shrink-0 border-blue-300 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
                  >
                    {copiedUrl === shortUrl ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-blue-600" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="shrink-0 border-purple-300 transition-all duration-200 hover:border-purple-500 hover:bg-purple-50"
                  >
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Original URL Display */}
              <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-3 text-left">
                <div className="mb-1 flex items-center gap-1">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">
                    Original URL:
                  </p>
                </div>
                <p className="truncate text-sm text-gray-800">
                  {recentUrl.longUrl}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-3">
              <p className="text-sm text-gray-600">
                Want to track clicks and manage your URLs?{' '}
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium text-transparent transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
                >
                  Create a free account
                </a>{' '}
                for dashboard access and analytics
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
