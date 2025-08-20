'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { User, Mail, Calendar, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, checkAuthStatus } =
    useAuth();

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setName(user.name || '');
    }
  }, [isAuthenticated, isHydrated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsUpdating(true);

    try {
      await api.patch('/user/profile', {
        name: name.trim(),
      });

      // Refresh user data
      await checkAuthStatus();

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone and will delete all your URLs and analytics data.'
      )
    ) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    setIsLoading(true);

    try {
      await api.delete('/user/account');
      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="text-red-600 hover:border-red-300 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed. Contact support if you need to update
                  your email.
                </p>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  <span
                    className={
                      user.isVerified ? 'text-green-600' : 'text-orange-600'
                    }
                  >
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your account usage overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-sm text-gray-600">Total URLs</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Visit your dashboard for detailed analytics
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
            <CardDescription className="text-red-600">
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Delete Account
                </h4>
                <p className="mb-4 text-sm text-gray-600">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
