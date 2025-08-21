'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Copy, ExternalLink, Loader2, Check, X, Sparkles } from 'lucide-react';
import { useUrlStore } from '@/store/url-store';
import { isValidUrl, getShortUrl, copyToClipboard } from '@/lib/utils';
import { validateCustomSlug } from '@/lib/validation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface DashboardUrlShortenerProps {
  onClose?: () => void;
  onUrlCreated?: () => void;
}

export function DashboardUrlShortener({
  onClose,
  onUrlCreated,
}: DashboardUrlShortenerProps) {
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expirationOption, setExpirationOption] = useState('never');
  const [customExpirationDate, setCustomExpirationDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<any>(null);

  const { addUrl, setError } = useUrlStore();

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
        'Please enter a valid URL (must include http:// or https://)'
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

      const response = await api.post('/urls/authenticated', requestData);

      const newUrl = response.data;
      setJustCreated(newUrl);

      // Clear form
      setLongUrl('');
      setCustomSlug('');
      setExpirationOption('never');
      setCustomExpirationDate('');

      toast.success('URL shortened successfully!');
      onUrlCreated?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to shorten URL';
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await copyToClipboard(url);
      setCopiedUrl(url);
      toast.success('Copied to clipboard!');

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleClose = () => {
    setJustCreated(null);
    setLongUrl('');
    setCustomSlug('');
    setExpirationOption('never');
    setCustomExpirationDate('');
    onClose?.();
  };

  const shortUrl = justCreated ? getShortUrl(justCreated.shortCode) : '';

  return (
    <div className="space-y-6">
      {/* URL Shortener Form */}
      <Card className="border-0 bg-gradient-to-r from-white to-blue-50/50 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5">
              <Sparkles className="h-full w-full text-white" />
            </div>
            <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
              Create Short Link
            </h3>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="longUrl"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              ✨ URL to shorten
            </label>
            <Input
              id="longUrl"
              type="url"
              placeholder="Enter your long URL here (e.g., https://example.com/very-long-url)"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="customSlug"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Custom slug (optional)
            </label>
            <Input
              id="customSlug"
              type="text"
              placeholder="Custom slug (optional) - e.g., my-awesome-link"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for auto-generated short code
            </p>
          </div>

          <div>
            <label
              htmlFor="expiration"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Link Expiration
            </label>
            <select
              id="expiration"
              value={expirationOption}
              onChange={(e) => setExpirationOption(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              <option value="never">Never expires</option>
              <option value="1week">1 week</option>
              <option value="1month">1 month</option>
              <option value="3months">3 months</option>
              <option value="6months">6 months</option>
              <option value="1year">1 year</option>
              <option value="custom">Custom date</option>
            </select>

            {expirationOption === 'custom' && (
              <div className="mt-2">
                <Input
                  type="datetime-local"
                  value={customExpirationDate}
                  onChange={(e) => setCustomExpirationDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  disabled={isLoading}
                />
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              {expirationOption === 'never' &&
                'Your link will work indefinitely'}
              {expirationOption === '1week' &&
                'Your link will expire in 1 week'}
              {expirationOption === '1month' &&
                'Your link will expire in 1 month'}
              {expirationOption === '3months' &&
                'Your link will expire in 3 months'}
              {expirationOption === '6months' &&
                'Your link will expire in 6 months'}
              {expirationOption === '1year' &&
                'Your link will expire in 1 year'}
              {expirationOption === 'custom' &&
                'Choose a specific date and time for expiration'}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              className="flex-1 transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Short Link
                </>
              )}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Result Display */}
      {justCreated && (
        <Card className="border-green-200 bg-green-50 p-6">
          <div className="text-center">
            <h3 className="mb-4 text-lg font-semibold text-green-900">
              🎉 Your short URL is ready!
            </h3>

            <div className="space-y-3">
              {/* Short URL Display */}
              <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-600">Short URL:</p>
                  <p className="truncate font-mono font-medium text-blue-600">
                    {shortUrl}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(shortUrl)}
                    className="shrink-0"
                  >
                    {copiedUrl === shortUrl ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="shrink-0"
                  >
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Original URL Display */}
              <div className="rounded-lg bg-gray-50 p-3 text-left">
                <p className="text-sm text-gray-600">Original URL:</p>
                <p className="truncate text-sm text-gray-800">
                  {justCreated.longUrl}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Your URL has been added to your dashboard and you can track its
              performance in analytics.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
