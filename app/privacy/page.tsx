import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Zap, Shield, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | DV4 Links',
  description:
    'Privacy Policy for DV4 Links URL shortening platform. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
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
                    DV4 Links
                  </span>
                  <span className="-mt-1 text-xs text-gray-500">
                    Smart Links
                  </span>
                </div>
              </Link>
              <div className="hidden items-center space-x-2 sm:flex">
                <Lock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Privacy Policy</span>
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
              <Shield className="h-8 w-8 text-green-600" />
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                Privacy Policy
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

          {/* Privacy Content */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <div className="space-y-8 p-8">
              {/* Introduction */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  Introduction
                </h2>
                <p className="leading-relaxed text-gray-700">
                  DV4 Links ("we," "our," or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our
                  URL shortening service.
                </p>
              </section>

              {/* Section 1 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  1. Information We Collect
                </h2>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p className="mb-4 leading-relaxed text-gray-700">
                  When you create an account, we collect:
                </p>
                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                  <li>Name and email address</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                  <li>Account preferences and settings</li>
                </ul>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Usage Information
                </h3>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We automatically collect certain information when you use our
                  service:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>URLs you shorten and their click analytics</li>
                  <li>IP addresses and browser information</li>
                  <li>Device type, operating system, and screen resolution</li>
                  <li>Referrer information and click timestamps</li>
                  <li>Geographic location (country/region level)</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  2. How We Use Your Information
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We use the information we collect to:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Provide and maintain our URL shortening service</li>
                  <li>
                    Generate analytics and insights for your shortened links
                  </li>
                  <li>Improve and optimize our service performance</li>
                  <li>
                    Communicate with you about your account and our service
                  </li>
                  <li>Detect and prevent fraud, spam, and abuse</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  3. Information Sharing and Disclosure
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information only in the
                  following circumstances:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or acquisition</li>
                  <li>
                    With service providers who assist in our operations (under
                    strict confidentiality agreements)
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  4. Data Security
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We implement appropriate technical and organizational security
                  measures to protect your information:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure hosting infrastructure</li>
                  <li>Regular backup and disaster recovery procedures</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  5. Cookies and Tracking Technologies
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Analyze service usage and performance</li>
                  <li>Provide security features</li>
                </ul>
                <p className="mt-4 leading-relaxed text-gray-700">
                  You can control cookies through your browser settings, but
                  disabling them may affect service functionality.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  6. Your Rights and Choices
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    information
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Request your data in a
                    machine-readable format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain processing of
                    your information
                  </li>
                </ul>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  7. Data Retention
                </h2>
                <p className="leading-relaxed text-gray-700">
                  We retain your personal information for as long as necessary
                  to provide our services and fulfill the purposes outlined in
                  this policy. Account information is retained until you delete
                  your account. Analytics data may be retained in aggregated,
                  anonymized form for service improvement purposes.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  8. International Data Transfers
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure appropriate
                  safeguards are in place to protect your information in
                  accordance with this privacy policy.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  9. Children's Privacy
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Our service is not directed to children under 13 years of age.
                  We do not knowingly collect personal information from children
                  under 13. If you believe we have collected information from a
                  child under 13, please contact us immediately.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="leading-relaxed text-gray-700">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by email or through our
                  service. Your continued use of the service after changes
                  become effective constitutes acceptance of the updated policy.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-semibold text-transparent">
                  Contact Us
                </h2>
                <p className="leading-relaxed text-gray-700">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us through our website. We are
                  committed to addressing your concerns and protecting your
                  privacy rights.
                </p>
              </section>
            </div>
          </Card>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Your privacy is protected
              </h3>
              <p className="mb-4 text-gray-600">
                Join thousands of users who trust DV4 Links with their URL
                shortening needs.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Shield className="mr-2 h-4 w-4" />
                    Get Started Securely
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline">View Terms of Service</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
