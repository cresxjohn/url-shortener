'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LinkIcon, BarChart3, Zap, Shield } from 'lucide-react';
import { UrlShortener } from '@/components/features/UrlShortener';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';

export function Hero() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100 absolute inset-0 opacity-60 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Free URL Shortener –{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create Custom Short Links
            </span>{' '}
            with Analytics
          </h1>

          {/* Hero Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Shorten, share, and manage your links with ease. Get detailed
            analytics, create custom slugs, and track performance. 100% free, no
            hidden costs.
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Detailed Analytics</span>
            </div>
          </div>

          {/* Conditional Content Based on Authentication */}
          {isAuthenticated ? (
            /* Authenticated User Content */
            <div className="mt-12">
              <Card className="bg-white/80 p-8 backdrop-blur-sm">
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name || user?.email}! 👋
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Ready to create and manage your short URLs? Head to your
                    dashboard to get started.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/features">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Explore Features
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Guest User Content */
            <>
              {/* URL Shortener Widget */}
              <div className="mt-12">
                <UrlShortener />
              </div>

              {/* Secondary CTA */}
              <div className="mt-8">
                <p className="text-sm text-gray-500">
                  Want more features?{' '}
                  <Link
                    href="/signup"
                    className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                  >
                    Create a free account
                  </Link>{' '}
                  for dashboard, analytics, and link management.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <LinkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Custom Short Links
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Create memorable custom slugs or use our auto-generated short
                codes
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Advanced Analytics
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Track clicks, geographic data, referrers, and device information
              </p>
            </Card>

            <Card className="p-6 text-center sm:col-span-2 lg:col-span-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Safe & Reliable
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                99.9% uptime with malicious URL protection and HTTPS encryption
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
