# Autoilty.com Asia Expansion

## Overview

Expansion of Autoilty.com to Asia markets (Singapore, Malaysia, Indonesia, Thailand) with i18n support, geo-IP detection, and localized features.

## Features Added

### 1. Country Configuration (`lib/config/countries.ts`)
- Support for 5 countries: CA, SG, MY, ID, TH
- Localized currencies, categories, and makes
- Country-specific forum categories
- Popular cities per country

### 2. Internationalization (`lib/i18n/`)
- Multi-language support: English, Malay (ms), Indonesian (id)
- i18next integration
- Browser language detection
- Cookie-based language persistence

### 3. Geo-IP Detection (`lib/utils/geoip.ts`)
- Server-side country detection
- Cloudflare header support (CF-IPCountry)
- Accept-Language header fallback
- IP-based geolocation

### 4. Components

#### SearchFilters.tsx
- Dynamic filters based on country config
- Make, category, price range, rating filters
- Mobile-responsive design

#### DirectoryListing.tsx
- Grid layout with responsive cards
- Currency formatting per country
- Star ratings and review counts
- Forum thread links
- Contact buttons (phone, website)

#### ForumThread.tsx
- Thread display with replies
- Post form with authentication check
- Country-specific placeholders
- Like/view counters
- Responsive design (stacked mobile, threaded desktop)

### 5. Routes

#### `/[country]/page.tsx`
- Dynamic country homepage
- Geo-IP detection on server
- Featured deals carousel
- Search filters sidebar
- Listing grid with pagination
- Schema.org Product markup

#### `/forums/[threadId]/page.tsx`
- Forum thread pages
- Integrated with listings
- Discussion threads per business

### 6. Authentication
- NextAuth.js configuration
- Google & Twitter OAuth
- Credentials provider (ready for Supabase)
- Session management

## Installation

1. **Install new dependencies:**
```bash
cd nextjs-app
npm install
```

2. **Configure environment variables:**
Add to `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

## Usage

### Accessing Country Pages

- **Canada:** `http://localhost:3000/ca`
- **Singapore:** `http://localhost:3000/sg`
- **Malaysia:** `http://localhost:3000/my`
- **Indonesia:** `http://localhost:3000/id`
- **Thailand:** `http://localhost:3000/th`

### Geo-IP Detection

The app automatically detects user's country from:
1. IP address (using geoip-lite)
2. Cloudflare headers (CF-IPCountry)
3. Accept-Language header
4. Falls back to Canada (CA)

### Language Switching

Users can switch languages via browser preferences or the app will detect from:
- Cookie settings
- LocalStorage
- Browser language

## API Integration

All components are ready to integrate with:
- Supabase (for forums and user data)
- Existing backend API (for listings)
- NextAuth providers (Google, Twitter)

## Mobile-First Design

All components use Tailwind CSS with:
- Responsive grid layouts
- Mobile-optimized filters
- Touch-friendly buttons
- Stacked layouts on mobile
- Side-by-side on desktop

## Schema Markup

- Product schema for listings
- LocalBusiness schema (existing)
- ItemList schema for search results
- Review schema (ready for integration)

## Next Steps

1. Connect to Supabase for forum data
2. Implement user authentication flow
3. Add real-time forum updates
4. Integrate with payment providers (Stripe)
5. Add country-specific payment methods
6. Localize more content based on user feedback

## File Structure

```
nextjs-app/
├── lib/
│   ├── config/
│   │   └── countries.ts          # Country configurations
│   ├── i18n/
│   │   ├── config.ts             # i18next setup
│   │   └── server.ts             # Server-side i18n
│   └── utils/
│       └── geoip.ts              # Geo-IP detection
├── components/
│   ├── search/
│   │   └── SearchFilters.tsx     # Dynamic search filters
│   ├── listings/
│   │   ├── DirectoryListing.tsx  # Listing grid component
│   │   └── BusinessDetails.tsx   # Enhanced with forum link
│   └── forums/
│       └── ForumThread.tsx       # Forum thread component
├── app/
│   ├── [country]/
│   │   └── page.tsx              # Country-specific homepage
│   ├── forums/
│   │   └── [threadId]/
│   │       └── page.tsx          # Forum thread page
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               ├── route.ts      # NextAuth handler
│               └── auth-options.ts # Auth configuration
```

