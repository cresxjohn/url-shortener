import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – Get Help with URL Shortening | ShortURL',
  description:
    "Need help with our free URL shortener? Contact our support team for technical assistance, feature requests, or general inquiries. We're here to help!",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
