import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import Link from 'next/link';

// Mock blog post data - in a real app, this would come from a CMS or API
const blogPosts = {
  '1': {
    id: '1',
    title: 'The Complete Guide to URL Shortening in 2024',
    content: `
    <div class="prose prose-lg">
      <p>URL shortening has become an essential tool in digital marketing and communication. In this comprehensive guide, we'll explore everything you need to know about URL shortening in 2024.</p>
      
      <h2>What is URL Shortening?</h2>
      <p>URL shortening is the process of creating a shorter, more manageable version of a long URL. Instead of sharing a lengthy link like <code>https://example.com/very/long/path/to/content?parameter=value</code>, you can create a short link like <code>short.ly/abc123</code>.</p>
      
      <h2>Why Use URL Shorteners?</h2>
      <ul>
        <li><strong>Space Saving:</strong> Essential for platforms with character limits like Twitter</li>
        <li><strong>Aesthetics:</strong> Clean, professional appearance in marketing materials</li>
        <li><strong>Analytics:</strong> Track clicks, geographic data, and user behavior</li>
        <li><strong>Flexibility:</strong> Easy to update the destination without changing the short link</li>
        <li><strong>Branding:</strong> Custom domains can reinforce brand recognition</li>
      </ul>
      
      <h2>Best Practices for URL Shortening</h2>
      <p>To maximize the effectiveness of your short links, follow these best practices:</p>
      
      <h3>1. Choose Meaningful Slugs</h3>
      <p>When possible, use custom slugs that hint at the content. Instead of random characters, use descriptive terms like <code>yoursite.com/2024-guide</code>.</p>
      
      <h3>2. Monitor Link Performance</h3>
      <p>Regularly check your analytics to understand which links perform best and why. This data can inform your content strategy and marketing decisions.</p>
      
      <h3>3. Ensure Link Security</h3>
      <p>Always verify that your URL shortener provides security scanning to protect your audience from malicious sites.</p>
      
      <h2>Advanced Features to Look For</h2>
      <p>Modern URL shorteners offer advanced features that can significantly enhance your marketing efforts:</p>
      
      <ul>
        <li><strong>Bulk Creation:</strong> Create multiple short links at once</li>
        <li><strong>API Access:</strong> Integrate shortening into your existing workflows</li>
        <li><strong>Custom Domains:</strong> Use your own domain for branded links</li>
        <li><strong>Link Expiration:</strong> Set automatic expiration dates</li>
        <li><strong>Geographic Targeting:</strong> Redirect users based on location</li>
      </ul>
      
      <h2>The Future of URL Shortening</h2>
      <p>As we move further into 2024, URL shortening continues to evolve. We're seeing trends toward:</p>
      
      <ul>
        <li>Enhanced privacy controls</li>
        <li>Better integration with social media platforms</li>
        <li>Improved analytics and reporting</li>
        <li>AI-powered link optimization</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Ready to start using URL shortening effectively? Here's a quick checklist:</p>
      
      <ol>
        <li>Choose a reliable URL shortening service</li>
        <li>Set up custom slugs for important campaigns</li>
        <li>Implement tracking and analytics</li>
        <li>Monitor performance and optimize</li>
        <li>Train your team on best practices</li>
      </ol>
      
      <p>URL shortening is more than just making links shorter – it's about creating better user experiences, gaining valuable insights, and building stronger connections with your audience.</p>
    </div>
    `,
    excerpt:
      'Everything you need to know about URL shortening, from basic concepts to advanced strategies for businesses and marketers.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Guide',
    tags: ['URL Shortening', 'Marketing', 'Best Practices'],
    featured: true,
  },
  // Add more blog posts as needed
};

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
};

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = blogPosts[params.id as keyof typeof blogPosts] as
    | BlogPost
    | undefined;

  if (!post) {
    return {
      title: 'Post Not Found | ShortURL Blog',
    };
  }

  return {
    title: `${post.title} | ShortURL Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${params.id}`,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts[params.id as keyof typeof blogPosts] as
    | BlogPost
    | undefined;

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* Back Button */}
              <div className="mb-8">
                <Link href="/blog">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>

              {/* Article Header */}
              <header className="mb-12">
                <div className="mb-6 flex items-center space-x-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                </div>

                <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {post.author}
                      </p>
                      <p className="text-sm text-gray-600">Content Writer</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </header>

              {/* Article Content */}
              <Card className="mb-12 p-8">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Card>

              {/* Tags */}
              <div className="mb-12">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                <div className="text-center">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">
                    Ready to try our URL shortener?
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Put these tips into practice with our free URL shortening
                    platform.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/signup">
                      <Button size="lg">Get Started Free</Button>
                    </Link>
                    <Link href="/">
                      <Button size="lg" variant="outline">
                        Try Without Signup
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </article>
      </main>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
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
            publisher: {
              '@type': 'Organization',
              name: 'ShortURL',
            },
          }),
        }}
      />
    </div>
  );
}
