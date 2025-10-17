# 🚘 Autoilty - Canada's Premier Auto Business Directory

## 🌟 Overview

**Autoilty.com** is a comprehensive business curation platform for the Canadian automotive industry, inspired by the BestDubai.com model. It showcases vetted auto businesses—mechanics, dealerships, parts stores, detailing services, and more—using an advanced 10-point scoring system based on reviews, community engagement, social signals, and Canadian-specific excellence factors.

### Key Features

- ✅ **10-Point Scoring Algorithm** - Reviews (40%), Community (30%), Social Signals (20%), Canadian Factors (10%)
- 🇨🇦 **Canadian-Focused** - Winter services, bilingual support, provincial certifications, rust-proofing
- 🔍 **Advanced Search & Filters** - Category, location, score, price range, EV readiness
- 📊 **Real-Time Analytics** - Profile views, click-through tracking, engagement metrics
- 🗺️ **Interactive Maps** - Leaflet.js integration with geospatial search
- 💬 **Forum Integration** - GraphQL API syncing with existing Autoilty forum
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🚀 **Performance Optimized** - Redis caching, infinite scroll, lazy loading
- 🔒 **Privacy Compliant** - PIPEDA adherence, ethical data handling

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with React Router
- Tailwind CSS for styling
- React Query for state management
- Apollo Client for GraphQL
- Leaflet.js for maps
- Chart.js for data visualization
- Helmet for SEO

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- GraphQL (Apollo Server)
- Redis for caching
- JWT authentication
- Winston logging

**Data Curation:**
- Python 3.9+ with BeautifulSoup
- Google Places API integration
- Yelp Fusion API integration
- Automated scoring calculator

**DevOps:**
- Docker & Docker Compose
- Nginx reverse proxy
- Artillery for load testing
- Jest for unit testing

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.9+
- MongoDB 7.0+
- Redis 7+
- Docker (optional)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/autoilty.git
cd autoilty
```

2. **Install dependencies:**
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client && npm install && cd ..

# Python dependencies
pip3 install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start development servers:**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client

# Or run both concurrently
npm run dev:full
```

6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- GraphQL Playground: http://localhost:5000/graphql

---

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Services:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Nginx**: http://localhost (production only)

---

## 📊 Data Curation

### Running the Scraper

```bash
# Scrape test cities (Toronto, Vancouver, Montreal, Calgary)
python3 scripts/data-scraper.py

# Full scraping (all major Canadian cities)
# Edit data-scraper.py and uncomment scraper.scrape_all_cities()
```

**Rate Limiting:** Built-in delays and API rate limit handling ensure ethical scraping.

**Data Sources:**
- Google Places API (businesses, reviews, ratings, hours)
- Yelp Fusion API (additional reviews and metadata)
- Canadian Yellow Pages (fallback source)
- Forum data sync (via GraphQL API)

### Score Calculation

Scores are automatically calculated and can be updated:

```bash
# Update all business scores
node scripts/score-updater.js

# Update specific business
node scripts/score-updater.js --id BUSINESS_ID

# Run as scheduled daemon (daily at 2 AM)
node scripts/score-updater.js --schedule
```

---

## 🧪 Testing

### Unit Tests

```bash
npm test                  # Run all tests
npm test -- --coverage   # With coverage report
```

### Load Testing

```bash
npm run test:load        # Artillery load test
```

**Load Test Scenarios:**
- Browse businesses (40% traffic)
- View business profiles (30%)
- Search functionality (20%)
- Top businesses (10%)

**Target Metrics:**
- 5,000 concurrent users
- <500ms avg response time
- 99.5% success rate

---

## 🔍 SEO & Visibility

### Features

1. **Schema Markup**
   - LocalBusiness schema for all profiles
   - Breadcrumb navigation
   - AggregateRating schema

2. **Meta Tags**
   - Dynamic Open Graph tags
   - Twitter Cards
   - Keyword optimization

3. **Sitemap & Robots**
   - Auto-generated sitemap.xml
   - Robots.txt for search engine guidance
   - Cached for 24 hours

### Access SEO Files

```
https://autoilty.com/sitemap.xml
https://autoilty.com/robots.txt
```

---

## 📈 API Documentation

### REST API Endpoints

#### Businesses

```
GET    /api/businesses                    # List all businesses (paginated)
GET    /api/businesses/:slug              # Get business by slug
GET    /api/businesses/top/:category      # Top businesses by category
GET    /api/businesses/nearby             # Geospatial search
POST   /api/businesses                    # Create business (auth required)
PUT    /api/businesses/:id                # Update business (auth required)
POST   /api/businesses/:id/vote           # Vote on business (auth required)
POST   /api/businesses/:id/click/:type    # Track analytics
```

#### Search

```
GET    /api/search                        # Full-text search
GET    /api/search/autocomplete           # Autocomplete suggestions
```

#### Authentication

```
POST   /api/auth/register                 # Register new user
POST   /api/auth/login                    # Login
GET    /api/auth/me                       # Get current user
PUT    /api/auth/updateprofile            # Update profile
```

#### Analytics

```
GET    /api/analytics/stats               # Platform statistics
GET    /api/analytics/business/:id        # Business analytics (auth required)
```

### GraphQL API

**Endpoint:** `/graphql`

**Sample Queries:**

```graphql
# Get top mechanics in Ontario
query {
  topBusinesses(category: "mechanics", province: "ON", limit: 10) {
    name
    slug
    score {
      total
      reviews
      community
    }
    location {
      address {
        city
        province
      }
    }
  }
}

# Search businesses
query {
  searchBusinesses(query: "auto repair toronto", page: 1, limit: 20) {
    businesses {
      name
      score { total }
    }
    total
    pages
  }
}

# Vote on business
mutation {
  voteBusiness(businessId: "507f1f77bcf86cd799439011", voteType: "upvote") {
    upvotes
    downvotes
    score { total }
  }
}
```

---

## 🎨 Frontend Components

### Key Components

- **`HomePage`** - Hero section, categories grid, top businesses showcase
- **`CategoryPage`** - Filtered business listings with infinite scroll
- **`BusinessProfile`** - Detailed business page with maps, reviews, score breakdown
- **`SearchResults`** - Full-text search results
- **`FilterSidebar`** - Advanced filtering (province, score, Canadian factors)
- **`BusinessCard`** - Reusable business card component

### State Management

- React Query for server state (caching, pagination)
- Apollo Client for GraphQL
- Local storage for JWT tokens
- URL params for filter state

---

## 🔐 Security & Compliance

### PIPEDA Compliance

- Explicit data retention policies (730 days)
- Privacy contact: privacy@autoilty.com
- Data consent modals
- User data export/deletion options

### Security Features

- JWT authentication with httpOnly cookies
- Helmet.js security headers
- Rate limiting (100 req/15min)
- Input validation with express-validator
- MongoDB injection prevention
- XSS protection

---

## 📊 Monitoring & Analytics

### Built-in Analytics

- Profile views tracking
- Click-through rates (phone, website, directions)
- Booking conversions
- Search query analytics

### External Integration

- Google Analytics ready
- Custom event tracking
- Conversion funnel monitoring

### Logging

- Winston logger with file rotation
- Error tracking
- API request logging
- Scheduled job monitoring

---

## 💰 Monetization Features

### Premium Listings

- Featured placement
- Enhanced profiles
- Priority in search results
- Custom badges

### Affiliate Integration

- Amazon auto parts links
- Booking platform partnerships
- Referral tracking

### Business Claims

- Verified business badges
- Owner dashboard
- Analytics access
- Direct booking integration

---

## 🌍 Scalability

### Performance Optimizations

1. **Caching Strategy**
   - Redis for API responses (5-60 min TTL)
   - Browser caching with ETags
   - Sitemap caching (24h)

2. **Database Optimization**
   - Compound indexes on category + score
   - Geospatial 2dsphere index
   - Text search indexes
   - Connection pooling

3. **CDN Ready**
   - Static assets optimization
   - Image lazy loading
   - Code splitting

### Load Capacity

**Target:**
- 10,000+ daily active users
- 100,000+ monthly page views
- <200ms avg API response
- 1,000+ curated businesses (launch)
- 10,000+ businesses (6 months)

---

## 🛠️ Development Workflow

### Branch Strategy

```
main              # Production
develop           # Development
feature/*         # Feature branches
hotfix/*          # Emergency fixes
```

### Code Quality

```bash
npm run lint      # ESLint
npm run format    # Prettier
npm test          # Jest tests
```

### Deployment

```bash
# Build for production
npm run build

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Database migrations
npm run migrate
```

---

## 📞 Support & Contact

- **Website:** https://autoilty.com
- **Email:** info@autoilty.com
- **Privacy:** privacy@autoilty.com
- **Forum:** https://forum.autoilty.com

---

## 📄 License

Copyright © 2025 Autoilty.com. All rights reserved.

This project is proprietary software. Unauthorized copying, modification, or distribution is prohibited.

---

## 🙏 Acknowledgments

- Inspired by BestDubai.com's curation model
- Google Places API for business data
- Yelp Fusion API for reviews
- Open Street Map for mapping
- Canadian automotive community for feedback

---

## 🚀 Roadmap

### Q1 2025
- [x] Core platform development
- [x] 10-point scoring system
- [x] Data scraping engine
- [ ] Beta launch (1,000 businesses)
- [ ] Forum integration complete

### Q2 2025
- [ ] Mobile app (React Native)
- [ ] Advanced AI recommendations
- [ ] Business claiming workflow
- [ ] 5,000+ business listings
- [ ] Premium tier launch

### Q3 2025
- [ ] API marketplace
- [ ] Multi-language support (French)
- [ ] Enhanced analytics dashboard
- [ ] 10,000+ businesses
- [ ] Regional expansion

### Q4 2025
- [ ] White-label licensing
- [ ] B2B enterprise features
- [ ] Predictive scoring AI
- [ ] 50,000+ businesses
- [ ] International expansion planning

---

**Built with ❤️ in Canada 🇨🇦**

*Autoilty.com - Driving Canadian Automotive Excellence*


