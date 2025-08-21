'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Zap, Menu, X, BarChart3, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <Zap className="h-full w-full text-white" />
              </div>
              <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400"></div>
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                DV4 Links
              </span>
              <span className="-mt-1 text-xs text-gray-500">Create Magic</span>
            </div>
          </Link>

          {/* Enhanced Auth Buttons */}
          <div className="hidden items-center space-x-3 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 rounded-full bg-gray-50 px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-6 w-6 p-0 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sign up Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-2 text-gray-700 transition-all duration-200 hover:from-blue-100 hover:to-purple-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t bg-gradient-to-b from-blue-50/50 to-purple-50/50 py-4 md:hidden">
            <nav className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 text-sm font-medium text-gray-700">
                    Welcome, {user?.name?.split(' ')[0] || 'User'}! ✨
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Sign up Free
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
