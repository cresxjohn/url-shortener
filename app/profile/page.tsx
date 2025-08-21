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
import {
  User,
  Mail,
  Calendar,
  Loader2,
  LogOut,
  Zap,
  Sparkles,
  Heart,
  Shield,
  Star,
  BarChart3,
} from 'lucide-react';
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 animate-bounce text-blue-500" />
            <Zap className="h-10 w-10 animate-spin text-purple-600" />
            <Heart className="h-8 w-8 animate-pulse text-red-500" />
          </div>
          <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-medium text-transparent">
            Awakening your magical profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Magical Header */}
      <div className="border-b bg-white/80 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2 shadow-lg">
                  <User className="h-full w-full text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  Wizard Profile Settings
                </h1>
                <Sparkles className="h-6 w-6 animate-bounce text-purple-500" />
              </div>
              <p className="ml-13 text-gray-600">
                Manage your magical account enchantments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="border-gray-300 transition-all duration-200 hover:border-blue-500 hover:text-blue-600"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Magical Profile Information */}
        <Card className="mb-8 border-0 bg-white/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center">
              <div className="mr-3 h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 shadow-md">
                <User className="h-full w-full text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wizard Profile Information
              </span>
              <Sparkles className="ml-2 h-5 w-5 text-purple-500" />
            </CardTitle>
            <CardDescription>
              Update your magical enchantment details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  🧙 Wizard Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your magical wizard name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                  className="border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  ✉️ Magical Contact Scroll
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
                />
                <p className="mt-2 rounded-lg border bg-blue-50 p-2 text-xs text-gray-500">
                  🔒 Your magical email scroll is protected and cannot be
                  changed. Contact our wizards if you need assistance.
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

              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating magical profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Update Wizard Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Magical Account Statistics */}
        <Card className="mb-8 border-0 bg-white/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center">
              <div className="mr-3 h-8 w-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 p-1.5 shadow-md">
                <BarChart3 className="h-full w-full text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Magical Statistics
              </span>
              <Star className="ml-2 h-5 w-5 animate-pulse text-yellow-500" />
            </CardTitle>
            <CardDescription>
              Your enchantment performance overview
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 text-center shadow-sm">
                <div className="mb-2 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  ∞
                </p>
                <p className="text-sm text-gray-600">Magic Links Created</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4 text-center shadow-sm">
                <div className="mb-2 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <p className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                  ∞
                </p>
                <p className="text-sm text-gray-600">Magical Clicks</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-3">
              <p className="text-center text-xs text-gray-600">
                ✨ Visit your dashboard for detailed magical analytics and
                enchantment insights
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Forbidden Magic Zone */}
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50 shadow-xl">
          <CardHeader className="border-b border-red-200 bg-gradient-to-r from-red-100 to-orange-100">
            <CardTitle className="flex items-center text-red-900">
              <div className="mr-3 h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 p-1.5 shadow-md">
                <Shield className="h-full w-full text-white" />
              </div>
              <span className="bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent">
                Forbidden Magic Zone
              </span>
              <span className="ml-2 text-red-500">⚠️</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              Dark spells with irreversible and destructive consequences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-white/80 p-4">
                <h4 className="mb-2 flex items-center text-sm font-medium text-red-900">
                  <span className="mr-2">🗑️</span>
                  Banish Wizard Account
                </h4>
                <p className="mb-4 text-sm text-red-700">
                  Permanently banish your wizard account and destroy all magical
                  links and enchantment data. This dark magic cannot be undone -
                  your digital soul will be lost forever.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-600 to-orange-600 shadow-lg hover:from-red-700 hover:to-orange-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Casting banishment spell...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Banish Wizard Account
                    </>
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
