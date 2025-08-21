# 🔗 Free URL Shortener

A modern, SEO-optimized URL shortening service built with Next.js and MongoDB. Create custom short links with detailed analytics, all for free!

## ✨ Features

- **Free URL Shortening** - No limits, no hidden costs
- **Custom Short Links** - Create memorable custom slugs
- **Advanced Analytics** - Track clicks, geography, devices, and more
- **User Authentication** - JWT-based auth with refresh tokens
- **Dashboard** - Manage and monitor your links
- **SEO Optimized** - Built for search engine visibility
- **Mobile Responsive** - Works perfectly on all devices
- **API Access** - RESTful API for integrations
- **Monetization Ready** - Ad slots and donation integration

## 🛠️ Tech Stack

### Full-Stack Framework

- **Next.js 14** - React framework with App Router and API Routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand + Immer** - State management
- **React Hook Form + Zod** - Form handling and validation

### Backend (API Routes)

- **Next.js API Routes** - Server-side API endpoints
- **Mongoose** - MongoDB object modeling
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **UA Parser** - User agent analysis

### Infrastructure

- **MongoDB** - Database hosting (MongoDB Atlas recommended)
- **Vercel** (recommended) - Full-stack hosting
- **Docker** - Containerization (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 5+ (local or MongoDB Atlas)
- pnpm package manager

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.local.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas (recommended)
   # Just update MONGODB_URI in .env.local
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📊 Database Schema (MongoDB)

```typescript
// User Schema
interface IUser {
  _id: ObjectId
  email: string
  passwordHash: string
  name?: string
  role: 'ADMIN' | 'USER'
  isVerified: boolean
  verificationToken?: string
  resetToken?: string
  resetTokenExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

// URL Schema
interface IUrl {
  _id: ObjectId
  shortCode: string
  longUrl: string
  title?: string
  description?: string
  customSlug?: string
  isActive: boolean
  clicks: number
  expiresAt?: Date
  userId?: ObjectId
  createdAt: Date
  updatedAt: Date
}

// Click Analytics Schema
interface IClick {
  _id: ObjectId
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  referrer?: string
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
  urlId: ObjectId
}

// Blacklisted URLs Schema
interface IBlacklistedUrl {
  _id: ObjectId
  url: string
  reason?: string
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### URLs

- `POST /api/urls` - Create short URL (anonymous)
- `POST /api/urls/authenticated` - Create short URL (authenticated)
- `GET /api/urls` - Get user's URLs (authenticated)
- `GET /api/urls/:id` - Get specific URL (authenticated)
- `PATCH /api/urls/:id` - Update URL (authenticated)
- `DELETE /api/urls/:id` - Delete URL (authenticated)
- `POST /api/urls/:id/reactivate` - Reactivate expired URL (authenticated)

### Analytics

- `GET /api/analytics/urls/:id/stats` - Get URL analytics
- `GET /api/analytics/dashboard` - Get dashboard stats

### User Management

- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics
- `DELETE /api/user/account` - Delete user account

### Redirect

- `GET /:shortCode` - Redirect to original URL

## 💰 Monetization Strategy

### Ad Placement (Non-intrusive)

1. **Homepage Top Banner** - Above the fold, below hero
2. **Homepage Bottom Banner** - Before footer
3. **Dashboard Sidebar** - Right sidebar for logged-in users
4. **Analytics Page** - Bottom of analytics reports

### Donation Integration

- **PayPal** - Direct donations
- **Buy Me a Coffee** - Subscription support
- **Ko-fi** - One-time and monthly support
- **GitHub Sponsors** - Developer support

### Premium Features (Future)

- Custom domains
- Bulk URL operations
- Advanced analytics
- API rate limit increases
- White-label solutions

## 🎯 SEO Features

- **Structured Data** - Schema.org markup for better search visibility
- **Open Graph Tags** - Social media sharing optimization
- **Meta Tags** - Comprehensive meta descriptions and titles
- **Sitemap.xml** - Auto-generated sitemap
- **Robots.txt** - Search engine crawling instructions
- **Fast Loading** - Optimized performance for Core Web Vitals

## 📈 Analytics & Monitoring

- **Click Tracking** - Real-time click analytics
- **Geographic Data** - Country and city tracking
- **Device Detection** - Browser, OS, and device type
- **Referrer Tracking** - Traffic source analysis
- **Error Monitoring** - Sentry integration ready

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - API abuse prevention
- **HTTPS Encryption** - Secure data transmission
- **Input Validation** - XSS and injection protection
- **CSRF Protection** - Cross-site request forgery prevention
- **URL Scanning** - Malicious URL detection

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-jwt-secret
   JWT_REFRESH_SECRET=your-production-refresh-secret
   NODE_ENV=production
   ```
3. **Deploy automatically on push to main branch**

### Alternative Hosting

- **Netlify** - Full-stack hosting with serverless functions
- **Railway** - Full-stack hosting with database
- **Render** - Full-stack hosting

### Database (MongoDB)

- **MongoDB Atlas** (recommended) - Managed MongoDB hosting
- **Self-hosted MongoDB** with Docker
- **Railway MongoDB** - Integrated database hosting

### Environment Setup for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener
JWT_SECRET=your-super-secure-production-jwt-secret-256-bit
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret-256-bit
NODE_ENV=production
```

## 🔄 Migration Notes

This project has been migrated from a separate NestJS backend + Next.js frontend architecture to a unified Next.js full-stack application:

- **Before**: NestJS + PostgreSQL + Prisma (separate backend)
- **After**: Next.js API Routes + MongoDB + Mongoose (unified app)

### Benefits of the New Architecture

- **Simplified Development**: Single codebase for frontend and backend
- **Better Performance**: No network calls between frontend and backend
- **Easier Deployment**: Deploy as a single Next.js application
- **Type Safety**: Shared types between client and server code
- **Reduced Complexity**: Fewer moving parts and dependencies

For detailed migration information, see [MIGRATION-README.md](./MIGRATION-README.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Support

If you find this project helpful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- ☕ [Buying me a coffee](https://buymeacoffee.com/yourusername)

---

Made with ❤️ by [cresxjohn](https://github.com/cresxjohn)
