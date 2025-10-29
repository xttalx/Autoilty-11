# Autoilty.com - Canada's #1 Automotive Directory (Next.js)

A comprehensive, SEO-optimized automotive directory built with Next.js 14, designed to rank #1 on Google for automotive searches in Canada.

## 🚀 Features

### SEO Optimizations
- ✅ Dynamic meta tags and Open Graph images
- ✅ Structured data (JSON-LD) for LocalBusiness, BreadcrumbList, FAQPage
- ✅ Auto-generated sitemap.xml and robots.txt
- ✅ Canonical URLs and hreflang tags (EN/FR)
- ✅ Server-Side Rendering (SSR) for all pages
- ✅ Optimized Core Web Vitals
- ✅ Image optimization with next/image

### Core Functionality
- 🏠 Homepage with hero, stats, featured listings, search, categories
- 📍 Province-based directories (/regions/[province])
- 🚗 Brand pages with forums and reviews (/brands/[make])
- 📋 Detailed business listings (/listings/[slug])
- 🛠️ Tools: Financing calculator, Value estimator (AI-powered)
- 📝 Blog system with SEO articles
- 👤 User dashboard with gamification (badges, contributions)
- 🤖 AI recommendations and chat assistant
- 📊 Real-time analytics integration

### Integrations
- 🔐 NextAuth (Google/X OAuth)
- 🗄️ Supabase for database
- 🗺️ Google Maps API
- 💳 Stripe for monetization
- 🐦 Twitter/X API for sentiment analysis
- 🤖 OpenAI for AI features
- 📈 Google Analytics & Hotjar

## 📁 Project Structure

```
nextjs-app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with SEO
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   ├── providers.tsx        # Context providers
│   ├── sitemap.ts           # Dynamic sitemap
│   ├── robots.ts            # Robots.txt
│   ├── regions/             # Province pages
│   ├── brands/              # Brand pages
│   ├── listings/            # Business detail pages
│   ├── tools/               # Calculator pages
│   ├── blog/                # Blog posts
│   ├── profile/             # User dashboard
│   └── api/                 # API routes
├── components/
│   ├── layout/              # Navbar, Footer
│   ├── home/                # Homepage components
│   ├── listings/            # Business cards, details
│   ├── search/              # Search components
│   ├── tools/               # Calculator components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── supabase/            # Supabase client
│   ├── seo.ts               # SEO utilities
│   ├── ai/                  # AI integrations
│   └── utils/               # Helper functions
├── types/                   # TypeScript types
├── public/                  # Static assets
└── scripts/                 # Utility scripts
```

## 🛠️ Setup

1. **Install dependencies:**
```bash
cd nextjs-app
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

3. **Run development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## 🌐 Environment Variables

See `.env.example` for all required environment variables. Key ones:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `OPENAI_API_KEY` - For AI features
- `NEXTAUTH_SECRET` - NextAuth secret
- `GOOGLE_CLIENT_ID` - OAuth
- `TWITTER_CLIENT_ID` - OAuth

## 📊 SEO Strategy

### Target Keywords
- Primary: "best mechanics XI Canada", "top auto repair shops"
- Long-tail: "best Toyota mechanics Edmonton", "top auto parts Calgary"
- Local: "[service] in [city] [province]"

### Implementation
- Dynamic meta tags per page
- Structured data (LocalBusiness, ReviewAggregate)
- Internal linking strategy
- Content optimization (H1-H6 hierarchy)
- Image alt text optimization
- Fast load times (<2s)

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app is compatible with any platform supporting Next.js:
- Netlify
- AWS Amplify
- Self-hosted (Docker)

## 📈 Performance

Target metrics:
- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

## 🔒 Security

- NextAuth.js for secure authentication
- Environment variables for secrets
- Rate limiting on API routes
- XSS protection
- CSRF protection

## 📝 License

Proprietary - Autoilty.com

## 🤝 Contributing

This is a proprietary project. For questions, contact: info@autoilty.com

---

Built with ❤️ in Canada 🇨🇦
