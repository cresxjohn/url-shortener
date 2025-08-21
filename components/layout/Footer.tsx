import Link from 'next/link';
import { Zap, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2 shadow-lg">
                <Zap className="h-full w-full text-white" />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  DV4 Links
                </span>
                <span className="-mt-1 text-xs text-gray-500">Smart Links</span>
              </div>
            </Link>
            <p className="mb-4 max-w-md text-gray-600">
              DV4 Links is a free URL shortener with built‑in analytics. Create
              custom short links, track clicks, and manage everything in a
              simple dashboard.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/dv4links"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-blue-500"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/dv4links"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-purple-500"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-600 transition-colors hover:text-purple-600"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 transition-colors hover:text-purple-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} DV4 Links. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 transition-colors hover:text-blue-600"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 transition-colors hover:text-purple-600"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
