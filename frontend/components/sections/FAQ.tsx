'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    question: 'Is your URL shortener really free?',
    answer: 'Yes! Our URL shortener is completely free to use. You can shorten unlimited URLs without any hidden costs or subscription fees. We offer premium features for registered users, but the core shortening service remains free forever.',
  },
  {
    question: 'Do I need to create an account to shorten URLs?',
    answer: 'No, you can shorten URLs without creating an account. However, creating a free account gives you access to analytics, link management, custom domains, and the ability to edit or delete your links.',
  },
  {
    question: 'How long do the short links last?',
    answer: 'Short links created without an account last indefinitely unless they violate our terms of service. Registered users can set expiration dates for their links and have full control over their link lifecycle.',
  },
  {
    question: 'Can I customize my short links?',
    answer: 'Yes! You can create custom slugs for your short links (e.g., yoursite.com/my-custom-link). This feature is available for both free and registered users, subject to availability.',
  },
  {
    question: 'Do you provide click analytics?',
    answer: 'Yes, we provide detailed analytics including total clicks, geographic data, referrer information, device types, and browser data. Analytics are available for registered users through the dashboard.',
  },
  {
    question: 'Are there any limits on the free plan?',
    answer: 'The free plan includes unlimited URL shortening, basic analytics, and custom slugs. There are reasonable rate limits to prevent abuse, but they are generous enough for normal usage.',
  },
  {
    question: 'Is it safe to use your service?',
    answer: 'Absolutely! We use HTTPS encryption, scan for malicious URLs, and have 99.9% uptime. Your links and data are protected with enterprise-grade security measures.',
  },
  {
    question: 'Can I use this for commercial purposes?',
    answer: 'Yes, you can use our URL shortener for commercial purposes. Many businesses use our service for marketing campaigns, social media, and customer communications.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-md font-medium"
          >
            Contact Support
          </a>
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

