'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help with any questions or issues',
    contact: 'support@shorturl.com',
    availability: 'Usually responds within 24 hours',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    contact: 'Available on our website',
    availability: 'Monday - Friday, 9 AM - 6 PM EST',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our team',
    contact: '+1 (555) 123-4567',
    availability: 'Monday - Friday, 9 AM - 5 PM EST',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const faqs = [
  {
    question: 'How quickly do you respond to support requests?',
    answer:
      'We typically respond to email inquiries within 24 hours. For urgent issues, we recommend using our live chat feature during business hours.',
  },
  {
    question: 'Do you provide technical support for API integration?',
    answer:
      'Yes! Our technical team can help you integrate our API. We provide documentation, code examples, and direct support for developers.',
  },
  {
    question: 'Can you help with bulk URL operations?',
    answer:
      'Absolutely. We offer guidance on bulk URL creation, management, and analytics export. Contact us for best practices and tips.',
  },
  {
    question: 'Is there a limit to how many URLs I can create?',
    answer:
      'No, there are no limits on the number of URLs you can create. Our free platform provides unlimited URL shortening.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Get in
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}
                  Touch
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Have questions about our URL shortener? Need help with your
                account? Our support team is here to help you succeed.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                How can we help you?
              </h2>
              <p className="text-lg text-gray-600">
                Choose the best way to reach us based on your needs and urgency.
              </p>
            </div>

            <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="p-6 text-center transition-shadow hover:shadow-lg"
                >
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${method.bgColor} mb-4`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {method.title}
                  </h3>
                  <p className="mb-3 text-gray-600">{method.description}</p>
                  <p className="mb-2 font-medium text-gray-900">
                    {method.contact}
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    {method.availability}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Form */}
                <Card className="p-8">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      Send us a message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    {submitted ? (
                      <div className="py-8 text-center">
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                          Message Sent Successfully!
                        </h3>
                        <p className="mb-6 text-gray-600">
                          Thank you for contacting us. We'll respond to your
                          inquiry within 24 hours.
                        </p>
                        <Button
                          onClick={() => setSubmitted(false)}
                          variant="outline"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Name *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Email *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="category"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="feature">Feature Request</option>
                            <option value="bug">Bug Report</option>
                            <option value="api">API Support</option>
                            <option value="business">Business Inquiry</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Subject
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="Brief description of your inquiry"
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Please provide details about your inquiry..."
                            value={formData.message}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                            className="resize-vertical w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>

                {/* FAQ */}
                <div>
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <Card key={index} className="p-6">
                        <h4 className="mb-3 text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600">{faq.answer}</p>
                      </Card>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <Card className="mt-8 border-blue-200 bg-blue-50 p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="mb-2 font-semibold text-blue-900">
                          Need immediate help?
                        </h4>
                        <p className="text-sm text-blue-800">
                          For urgent technical issues or account problems,
                          please use our live chat feature or call our support
                          line during business hours.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Info */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Our Office
                </h2>
                <p className="text-lg text-gray-600">
                  While we operate primarily online, here's where you can find
                  us.
                </p>
              </div>

              <Card className="p-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600">
                            123 Tech Street, Suite 100
                            <br />
                            San Francisco, CA 94105
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <p className="text-gray-600">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <p className="text-gray-600">support@shorturl.com</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Business Hours
                          </p>
                          <p className="text-gray-600">
                            Monday - Friday: 9 AM - 6 PM EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      Response Times
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="text-gray-700">Email Support</span>
                        <span className="text-sm font-medium text-gray-900">
                          Within 24 hours
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="text-gray-700">Live Chat</span>
                        <span className="text-sm font-medium text-gray-900">
                          Immediate
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="text-gray-700">Phone Support</span>
                        <span className="text-sm font-medium text-gray-900">
                          Immediate
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="text-gray-700">Technical Issues</span>
                        <span className="text-sm font-medium text-gray-900">
                          Within 4 hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
