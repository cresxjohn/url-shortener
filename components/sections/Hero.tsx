'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  Zap,
  BarChart3,
  Shield,
  Sparkles,
  Heart,
  Star,
  Rocket,
} from 'lucide-react';
import { UrlShortener } from '@/components/features/UrlShortener';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';

export function Hero() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 lg:py-32"
    >
      {/* Magical Background Pattern */}
      <div className="bg-grid-slate-100 absolute inset-0 opacity-40 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      {/* Floating magical elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 animate-bounce">
          <Sparkles className="h-6 w-6 text-blue-400 opacity-60" />
        </div>
        <div className="absolute right-20 top-32 animate-pulse">
          <Heart className="h-5 w-5 text-red-400 opacity-50" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-300">
          <Star className="h-4 w-4 text-yellow-400 opacity-70" />
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Magical Hero Headline */}
          <div className="mb-6 flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 animate-bounce text-blue-500" />
            <Zap className="h-10 w-10 text-purple-600" />
            <Heart className="h-8 w-8 animate-pulse text-red-500" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            DV4 Links –{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Smart Links
            </span>{' '}
            with Advanced Analytics
          </h1>

          {/* Hero Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Transform and manage your URLs with ease. Get detailed analytics,
            create custom short codes, and track performance. 100% free forever,
            no hidden costs.
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure & Protected</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2">
              <Rocket className="h-4 w-4 text-blue-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Detailed Analytics</span>
            </div>
          </div>

          {/* Magical Content Based on Authentication */}
          {isAuthenticated ? (
            /* Magical Authenticated User Content */
            <div className="mt-12">
              <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
                <div className="rounded-t-lg border-b bg-gradient-to-r from-blue-50 to-purple-50 p-8">
                  <div className="text-center">
                    <div className="mb-4 flex items-center justify-center space-x-2">
                      <Sparkles className="h-6 w-6 animate-bounce text-blue-500" />
                      <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                        Welcome back, {user?.name?.split(' ')[0] || 'Wizard'}!
                        ✨
                      </h2>
                      <Heart className="h-6 w-6 animate-pulse text-red-500" />
                    </div>
                    <p className="mb-6 text-gray-600">
                      Ready to create more short links? Head to your dashboard
                      to continue managing your URLs.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          className="w-full transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto"
                        >
                          <Zap className="mr-2 h-5 w-5" />
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-gray-300 transition-all duration-200 hover:border-blue-500 hover:text-blue-600 sm:w-auto"
                        onClick={() => {
                          const featuresSection =
                            document.querySelector('#features-section');
                          if (featuresSection) {
                            featuresSection.scrollIntoView({
                              behavior: 'smooth',
                            });
                          }
                        }}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Explore Features
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Magical Guest User Content */
            <>
              {/* Magical URL Shortener Widget */}
              <div className="mt-12">
                <UrlShortener />
              </div>

              {/* Magical Secondary CTA */}
              <div className="mt-8">
                <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                  <p className="text-sm text-gray-600">
                    Want more features?{' '}
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium text-transparent transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
                    >
                      Create a free account
                    </Link>{' '}
                    for dashboard access, detailed analytics, and advanced link
                    management.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Magical Feature Cards */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg transition-transform duration-200 hover:scale-110">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent">
                Custom Magic Links
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Create memorable custom magic codes or use our auto-generated
                enchanted spells
              </p>
            </Card>

            <Card className="border-0 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg transition-transform duration-200 hover:scale-110">
                <BarChart3 className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent">
                Enchanted Analytics
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Track magical clicks, mystical geographic data, enchanted
                referrers, and device divination
              </p>
            </Card>

            <Card className="border-0 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl sm:col-span-2 lg:col-span-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-100 to-blue-100 shadow-lg transition-transform duration-200 hover:scale-110">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent">
                Magically Protected
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                99.9% magical uptime with dark magic protection and enchanted
                HTTPS barriers
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
