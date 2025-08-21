'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkHref: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center space-x-3"
          >
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <Zap className="h-full w-full text-white" />
              </div>
              <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-400"></div>
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                DV4 Links
              </span>
              <span className="-mt-1 text-xs text-gray-500">{subtitle}</span>
            </div>
          </Link>

          <div className="mb-4">
            <h2 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold text-transparent">
              {title}
            </h2>
            <p className="mt-2 text-gray-600">
              Fast, reliable, and completely free
            </p>
          </div>
        </div>

        {/* Form Content */}
        {children}

        {/* Bottom Links */}
        <div className="space-y-3 text-center text-sm text-gray-600">
          <div className="rounded-lg border border-gray-200 bg-white/50 p-4 backdrop-blur-sm">
            <p className="text-gray-700">
              {bottomText}{' '}
              <Link
                href={bottomLinkHref}
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium text-transparent transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
              >
                {bottomLinkText}
              </Link>
            </p>
          </div>

          <p>
            <Link
              href="/"
              className="inline-flex items-center font-medium text-gray-500 transition-all duration-200 hover:scale-105 hover:text-blue-600"
            >
              ← Back to DV4 Links
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
