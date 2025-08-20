# 🔗 Free URL Shortener

A modern, SEO-optimized URL shortening service built with Next.js and NestJS. Create custom short links with detailed analytics, all for free!

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

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand + Immer** - State management
- **React Hook Form + Zod** - Form handling and validation

### Backend

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Passport** - Authentication strategies

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Vercel** (recommended) - Frontend hosting
- **Railway/Render** (recommended) - Backend hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. **Backend Setup**

   ```bash
   cd backend
   pnpm install

   # Copy environment variables
   cp env.example .env
   # Edit .env with your database and JWT secrets

   # Run database migrations
   npx prisma migrate dev
   npx prisma generate

   # Start backend
   pnpm run start:dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   pnpm install

   # Copy environment variables
   cp env.example .env.local
   # Edit .env.local with your API URL

   # Start frontend
   pnpm run dev
   ```

4. **Using Docker (Alternative)**

   ```bash
   # Start all services
   docker-compose up -d

   # Run migrations
   docker-compose exec backend npx prisma migrate dev
   ```

## 📊 Database Schema

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  role         UserRole @default(USER)
  isVerified   Boolean  @default(false)
  createdAt    DateTime @default(now())
  urls         Url[]
}

model Url {
  id          String    @id @default(cuid())
  shortCode   String    @unique
  longUrl     String
  title       String?
  customSlug  String?
  clicks      Int       @default(0)
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  userId      String?
  user        User?     @relation(fields: [userId], references: [id])
  clickAnalytics Click[]
}

model Click {
  id        String   @id @default(cuid())
  timestamp DateTime @default(now())
  ipAddress String?
  country   String?
  device    String?
  browser   String?
  urlId     String
  url       Url      @relation(fields: [urlId], references: [id])
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

- `POST /api/urls` - Create short URL
- `GET /api/urls` - Get user's URLs (authenticated)
- `PATCH /api/urls/:id` - Update URL (authenticated)
- `DELETE /api/urls/:id` - Delete URL (authenticated)

### Analytics

- `GET /api/analytics/urls/:id/stats` - Get URL analytics
- `GET /api/analytics/dashboard` - Get dashboard stats

### Redirect

- `GET /s/:shortCode` - Redirect to original URL

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

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic migrations

### Database (PostgreSQL)

- Use managed PostgreSQL from your hosting provider
- Or self-host with Docker

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

## 📞 Contact

- **Email**: support@yoursite.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)
- **Discord**: [Join our community](https://discord.gg/yourinvite)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
