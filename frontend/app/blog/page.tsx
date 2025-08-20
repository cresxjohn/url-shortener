import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog – URL Shortening Tips & Best Practices | ShortURL',
  description:
    'Learn about URL shortening best practices, digital marketing tips, link management strategies, and analytics insights from our expert team.',
  alternates: {
    canonical: '/blog',
  },
};

const blogPosts = [
  {
    id: '1',
    title: 'The Complete Guide to URL Shortening in 2024',
    excerpt:
      'Everything you need to know about URL shortening, from basic concepts to advanced strategies for businesses and marketers.',
    content:
      'Learn the fundamentals of URL shortening, why it matters for your business, and how to implement an effective link management strategy.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Guide',
    tags: ['URL Shortening', 'Marketing', 'Best Practices'],
    featured: true,
    image: '/blog/url-shortening-guide.jpg',
  },
  {
    id: '2',
    title: 'How Custom Short Links Boost Brand Recognition',
    excerpt:
      'Discover how branded short links can increase click-through rates by up to 39% and strengthen your brand identity.',
    content:
      'Custom short links are more than just vanity URLs. They build trust, improve brand recall, and provide better analytics.',
    author: 'Mike Chen',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'Branding',
    tags: ['Branding', 'Custom Links', 'Marketing'],
    featured: false,
    image: '/blog/custom-links.jpg',
  },
  {
    id: '3',
    title: '10 URL Shortening Best Practices for Social Media',
    excerpt:
      'Maximize your social media impact with these proven URL shortening strategies that drive more clicks and engagement.',
    content:
      "Social media platforms have character limits, but your impact doesn't have to be limited. Learn how to optimize your links.",
    author: 'Emily Rodriguez',
    date: '2024-01-05',
    readTime: '5 min read',
    category: 'Social Media',
    tags: ['Social Media', 'Best Practices', 'Engagement'],
    featured: false,
    image: '/blog/social-media-tips.jpg',
  },
  {
    id: '4',
    title: 'Understanding Link Analytics: Metrics That Matter',
    excerpt:
      'Learn which link analytics metrics are most important for your business and how to use them to optimize your marketing campaigns.',
    content:
      'Not all metrics are created equal. Focus on the analytics that truly impact your business goals and marketing ROI.',
    author: 'David Kim',
    date: '2024-01-01',
    readTime: '7 min read',
    category: 'Analytics',
    tags: ['Analytics', 'Metrics', 'ROI'],
    featured: false,
    image: '/blog/analytics-guide.jpg',
  },
  {
    id: '5',
    title: 'QR Codes vs Short URLs: Which is Better?',
    excerpt:
      'A comprehensive comparison of QR codes and short URLs for different use cases, platforms, and marketing objectives.',
    content:
      'Both QR codes and short URLs have their place in modern marketing. Learn when to use each for maximum effectiveness.',
    author: 'Lisa Park',
    date: '2023-12-28',
    readTime: '6 min read',
    category: 'Comparison',
    tags: ['QR Codes', 'Comparison', 'Marketing Tools'],
    featured: false,
    image: '/blog/qr-vs-urls.jpg',
  },
  {
    id: '6',
    title: 'Link Security: Protecting Your Audience from Malicious URLs',
    excerpt:
      'Essential security practices to protect your audience from malicious links and maintain trust in your brand.',
    content:
      "Link security isn't optional in today's digital landscape. Learn how to implement proper security measures.",
    author: 'Alex Thompson',
    date: '2023-12-25',
    readTime: '9 min read',
    category: 'Security',
    tags: ['Security', 'Trust', 'Safety'],
    featured: false,
    image: '/blog/link-security.jpg',
  },
];

const categories = [
  'All Posts',
  'Guide',
  'Branding',
  'Social Media',
  'Analytics',
  'Security',
  'Comparison',
];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                URL Shortening
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}
                  Insights & Tips
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Stay up-to-date with the latest URL shortening trends, best
                practices, and expert insights to maximize your link management
                strategy.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-2xl font-bold text-gray-900">
                Featured Article
              </h2>
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="flex h-64 items-center justify-center bg-gray-200 md:h-full">
                      <span className="text-gray-500">Featured Image</span>
                    </div>
                  </div>
                  <div className="p-8 md:w-1/2">
                    <div className="mb-4 flex items-center space-x-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                      {featuredPost.title}
                    </h3>
                    <p className="mb-6 text-gray-600">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                      <Link href={`/blog/${featuredPost.id}`}>
                        <Button>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-12 lg:flex-row">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <h2 className="mb-8 text-2xl font-bold text-gray-900">
                  Latest Articles
                </h2>
                <div className="grid gap-8">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden transition-shadow hover:shadow-lg"
                    >
                      <div className="sm:flex">
                        <div className="sm:w-1/3">
                          <div className="flex h-48 items-center justify-center bg-gray-200 sm:h-full">
                            <span className="text-gray-500">Image</span>
                          </div>
                        </div>
                        <div className="p-6 sm:w-2/3">
                          <div className="mb-3 flex items-center space-x-4">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              {post.category}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                          </div>
                          <h3 className="mb-3 text-xl font-semibold text-gray-900">
                            <Link
                              href={`/blog/${post.id}`}
                              className="transition-colors hover:text-primary"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mb-4 text-gray-600">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                {post.author}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {post.readTime}
                              </div>
                            </div>
                            <Link href={`/blog/${post.id}`}>
                              <Button variant="outline" size="sm">
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="space-y-8">
                  {/* Categories */}
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="cursor-pointer text-gray-600 transition-colors hover:text-primary">
                            {category}
                          </span>
                          <span className="text-sm text-gray-400">
                            {category === 'All Posts'
                              ? blogPosts.length
                              : blogPosts.filter(
                                  (post) => post.category === category
                                ).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Popular Tags */}
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Set(blogPosts.flatMap((post) => post.tags))
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex cursor-pointer items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>

                  {/* Newsletter Signup */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Stay Updated
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Get the latest URL shortening tips and insights delivered
                      to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button className="w-full">Subscribe</Button>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                      No spam, unsubscribe at any time.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to put these tips into practice?
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Start shortening your URLs and implementing these best practices
                today.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    Start Shortening URLs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'ShortURL Blog',
            description: 'URL shortening tips, best practices, and insights',
            url: process.env.NEXT_PUBLIC_APP_URL + '/blog',
            blogPost: blogPosts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                '@type': 'Person',
                name: post.author,
              },
              articleSection: post.category,
              keywords: post.tags.join(', '),
            })),
          }),
        }}
      />
    </div>
  );
}
