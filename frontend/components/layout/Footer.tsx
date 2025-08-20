import Link from 'next/link';
import { LinkIcon, Twitter, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <LinkIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ShortURL</span>
            </Link>
            <p className="mb-4 max-w-md text-gray-600">
              Free URL shortener with analytics. Create custom short links,
              track clicks, and manage your URLs with ease. 100% free, no hidden
              costs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/shorturl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/shorturl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@shorturl.com"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Status
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ShortURL. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
