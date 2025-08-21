'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Star, Heart } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    question: 'Is your URL shortener really free?',
    answer:
      'Yes! Our URL shortener is completely free to use. You can shorten unlimited URLs without any hidden costs or subscription fees. We offer premium features for registered users, but the core shortening service remains free forever.',
  },
  {
    question: 'Do I need to create an account to shorten URLs?',
    answer:
      'No, you can shorten URLs without creating an account. However, creating a free account gives you access to analytics, link management, custom domains, and the ability to edit or delete your links.',
  },
  {
    question: 'How long do the short links last?',
    answer:
      'Short links created without an account last indefinitely unless they violate our terms of service. Registered users can set expiration dates for their links and have full control over their link lifecycle.',
  },
  {
    question: 'Can I customize my short links?',
    answer:
      'Yes! You can create custom slugs for your short links (e.g., yoursite.com/my-custom-link). This feature is available for both free and registered users, subject to availability.',
  },
  {
    question: 'Do you provide click analytics?',
    answer:
      'Yes, we provide detailed analytics including total clicks, geographic data, referrer information, device types, and browser data. Analytics are available for registered users through the dashboard.',
  },
  {
    question: 'Are there any limits on the free plan?',
    answer:
      'The free plan includes unlimited URL shortening, basic analytics, and custom slugs. There are reasonable rate limits to prevent abuse, but they are generous enough for normal usage.',
  },
  {
    question: 'Is it safe to use your service?',
    answer:
      'Absolutely! We use HTTPS encryption, scan for malicious URLs, and have 99.9% uptime. Your links and data are protected with enterprise-grade security measures.',
  },
  {
    question: 'Can I use this for commercial purposes?',
    answer:
      'Yes, you can use our URL shortener for commercial purposes. Many businesses use our service for marketing campaigns, social media, and customer communications.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Star className="h-6 w-6 animate-pulse text-yellow-500" />
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              Frequently asked questions
            </h2>
            <Sparkles className="h-6 w-6 animate-bounce text-purple-500" />
          </div>
          <p className="text-lg text-gray-600">
            Answers to common questions about DV4 Links. If you need more help,
            contact us.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="pr-4 text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <div className="mb-2 flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 animate-pulse text-yellow-500" />
              <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-medium text-transparent">
                Ready to shorten your first link?
              </p>
              <Sparkles className="h-5 w-5 animate-bounce text-blue-500" />
            </div>
            <p className="mb-4 text-gray-600">
              Create a short link now — it takes a few seconds.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create account
              </a>
              <a
                href="/#hero"
                className="inline-flex items-center justify-center rounded-md border border-blue-300 px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Try without account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
