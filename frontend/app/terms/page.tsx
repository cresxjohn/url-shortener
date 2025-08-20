import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Zap, Shield, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | LinkForge',
  description:
    'Terms of Service for LinkForge URL shortening platform. Learn about our service terms, user responsibilities, and legal requirements.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="group flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2 shadow-lg transition-transform duration-200 group-hover:scale-110">
                  <Zap className="h-full w-full text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                    LinkForge
                  </span>
                  <span className="-mt-1 text-xs text-gray-500">
                    Smart Links
                  </span>
                </div>
              </Link>
              <div className="hidden items-center space-x-2 sm:flex">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Terms of Service</span>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                Terms of Service
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Terms Content */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <div className="space-y-8 p-8">
              {/* Section 1 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  1. Acceptance of Terms
                </h2>
                <p className="leading-relaxed text-gray-700">
                  By accessing and using LinkForge ("Service"), you accept and
                  agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  2. Description of Service
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  LinkForge is a URL shortening service that allows users to
                  create shortened versions of long URLs. Our service includes:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>URL shortening and custom link creation</li>
                  <li>Click tracking and analytics</li>
                  <li>Link management dashboard</li>
                  <li>QR code generation</li>
                  <li>Link expiration settings</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  3. User Responsibilities
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  Users agree to:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>
                    Provide accurate and truthful information when creating an
                    account
                  </li>
                  <li>
                    Not use the service for illegal, harmful, or abusive
                    purposes
                  </li>
                  <li>
                    Not create links to malicious, phishing, or spam content
                  </li>
                  <li>
                    Not circumvent or attempt to circumvent any security
                    measures
                  </li>
                  <li>Respect the intellectual property rights of others</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  4. Prohibited Uses
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  The following uses are strictly prohibited:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Linking to illegal content or activities</li>
                  <li>Phishing, malware, or virus distribution</li>
                  <li>Spam or unsolicited commercial communications</li>
                  <li>Adult content without proper age verification</li>
                  <li>Harassment, hate speech, or discriminatory content</li>
                  <li>Copyright or trademark infringement</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  5. Service Availability
                </h2>
                <p className="leading-relaxed text-gray-700">
                  While we strive to maintain 99.9% uptime, LinkForge is
                  provided "as is" and we do not guarantee uninterrupted
                  service. We reserve the right to modify, suspend, or
                  discontinue the service at any time with reasonable notice.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  6. Data and Privacy
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Your privacy is important to us. Please review our{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your
                  information.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  7. Limitation of Liability
                </h2>
                <p className="leading-relaxed text-gray-700">
                  LinkForge shall not be liable for any indirect, incidental,
                  special, or consequential damages resulting from the use or
                  inability to use the service, even if we have been advised of
                  the possibility of such damages.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  8. Modifications to Terms
                </h2>
                <p className="leading-relaxed text-gray-700">
                  We reserve the right to modify these terms at any time. Users
                  will be notified of significant changes via email or through
                  the service. Continued use of the service after changes
                  constitutes acceptance of the new terms.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  9. Contact Information
                </h2>
                <p className="leading-relaxed text-gray-700">
                  If you have any questions about these Terms of Service, please
                  contact us through our website or via email. We will respond
                  to all legitimate inquiries in a timely manner.
                </p>
              </section>
            </div>
          </Card>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Ready to get started?
              </h3>
              <p className="mb-4 text-gray-600">
                Create your free LinkForge account and start shortening URLs
                today.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
