# 📁 Autoilty Project Structure

## Directory Tree

```
autoilty/
├── 📂 client/                          # React Frontend Application
│   ├── public/                         # Static assets
│   ├── src/
│   │   ├── components/                 # Reusable React components
│   │   │   ├── BusinessCard.jsx        # Business listing card
│   │   │   ├── FilterSidebar.jsx       # Advanced filters
│   │   │   ├── Footer.jsx              # Site footer
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   └── StatsSection.jsx        # Platform statistics
│   │   ├── pages/                      # Route-level pages
│   │   │   ├── HomePage.jsx            # Landing page
│   │   │   ├── CategoryPage.jsx        # Category listings with filters
│   │   │   ├── BusinessProfile.jsx     # Detailed business page
│   │   │   ├── SearchResults.jsx       # Search results
│   │   │   ├── ProvincePage.jsx        # Province overview
│   │   │   ├── LoginPage.jsx           # User login
│   │   │   ├── RegisterPage.jsx        # User registration
│   │   │   └── DashboardPage.jsx       # User dashboard
│   │   ├── styles/
│   │   │   └── tailwind.css            # Tailwind configuration
│   │   └── App.js                      # Main React app
│   ├── package.json                    # Frontend dependencies
│   ├── tailwind.config.js              # Tailwind CSS config
│   └── Dockerfile                      # Frontend container
│
├── 📂 server/                          # Express Backend Application
│   ├── models/                         # Mongoose data models
│   │   ├── Business.js                 # Business schema with scoring
│   │   └── User.js                     # User authentication schema
│   ├── routes/                         # API route handlers
│   │   ├── businesses.js               # Business CRUD operations
│   │   ├── auth.js                     # Authentication endpoints
│   │   ├── users.js                    # User management
│   │   ├── search.js                   # Search functionality
│   │   ├── analytics.js                # Platform analytics
│   │   └── seo.js                      # SEO endpoints (sitemap, robots)
│   ├── graphql/                        # GraphQL API
│   │   ├── typeDefs.js                 # GraphQL schema
│   │   └── resolvers.js                # GraphQL resolvers
│   ├── middleware/                     # Express middleware
│   │   └── auth.js                     # JWT authentication
│   ├── utils/                          # Utility functions
│   │   ├── logger.js                   # Winston logging
│   │   ├── redis.js                    # Redis caching
│   │   └── seo.js                      # SEO utilities
│   ├── jobs/                           # Scheduled tasks
│   │   ├── scoreUpdater.js             # Daily score recalculation
│   │   └── dataScraper.js              # Weekly data refresh
│   └── index.js                        # Express server entry point
│
├── 📂 scripts/                         # Automation scripts
│   ├── data-scraper.py                 # Python data curation engine
│   ├── score-updater.js                # Business score calculator
│   ├── seed-database.js                # Database seeding
│   ├── monitor.js                      # System health monitoring
│   ├── mongo-init.js                   # MongoDB initialization
│   ├── quick-start.sh                  # Automated setup script
│   └── backup.sh                       # Database backup script
│
├── 📂 tests/                           # Testing suite
│   ├── business.test.js                # Business API tests
│   ├── load-test.yml                   # Artillery load testing config
│   └── setup.js                        # Test environment setup
│
├── 📂 nginx/                           # Nginx configuration
│   ├── nginx.conf                      # Production reverse proxy
│   └── ssl/                            # SSL certificates (gitignored)
│
├── 📂 logs/                            # Application logs
│   ├── combined.log                    # All logs
│   ├── error.log                       # Error logs
│   └── scraper.log                     # Scraper logs
│
├── 📂 .github/                         # GitHub configuration
│   └── workflows/                      # CI/CD pipelines
│       ├── test.yml                    # Automated testing
│       └── deploy.yml                  # Deployment pipeline
│
├── 📄 package.json                     # Root dependencies
├── 📄 requirements.txt                 # Python dependencies
├── 📄 docker-compose.yml               # Docker orchestration
├── 📄 Dockerfile.backend               # Backend container
├── 📄 .env.example                     # Environment template
├── 📄 .gitignore                       # Git ignore rules
├── 📄 jest.config.js                   # Jest testing config
├── 📄 README.md                        # Main documentation
├── 📄 DEPLOYMENT.md                    # Deployment guide
├── 📄 GROWTH_PROJECTIONS.md            # 6-month growth plan
└── 📄 PROJECT_STRUCTURE.md             # This file

```

---

## Key Components

### 🎨 Frontend (React + Tailwind)

**Technology:** React 18, React Router, Tailwind CSS, React Query, Apollo Client

**Key Features:**
- Server-side rendering ready
- Infinite scroll with pagination
- Real-time search with autocomplete
- Interactive maps (Leaflet.js)
- Data visualization (Chart.js)
- SEO optimized (React Helmet)
- Mobile-first responsive design

**State Management:**
- React Query for server state
- Apollo Client for GraphQL
- URL params for filter state
- LocalStorage for auth tokens

---

### 🔧 Backend (Node.js + Express)

**Technology:** Express, MongoDB, Redis, GraphQL, JWT

**Key Features:**
- RESTful API + GraphQL endpoints
- JWT authentication & authorization
- Redis caching (5-60 min TTL)
- Rate limiting (100 req/15min)
- Winston logging with rotation
- Helmet security headers
- Input validation

**Database:**
- MongoDB with Mongoose ODM
- Compound indexes for performance
- Geospatial 2dsphere indexing
- Text search capabilities
- Connection pooling

---

### 🐍 Data Curation Engine (Python)

**Technology:** Python 3.9+, BeautifulSoup, Requests

**Data Sources:**
- Google Places API
- Yelp Fusion API
- Canadian Yellow Pages
- Forum data sync

**Features:**
- Rate limiting & retry logic
- Ethical scraping compliance
- Automated score calculation
- Data validation & normalization

---

### 📊 Scoring Algorithm

**10-Point Scale:**

```javascript
Score Components:
├── Reviews (40% = 4.0 points)
│   ├── Average rating (3.0 points)
│   └── Review volume (1.0 point)
├── Community (30% = 3.0 points)
│   ├── User votes (1.5 points)
│   ├── Forum discussions (1.0 point)
│   └── Recommendations (0.5 points)
├── Social Signals (20% = 2.0 points)
│   ├── Instagram mentions (0.8 points)
│   ├── Facebook followers (0.6 points)
│   └── Forum activity (0.6 points)
└── Canadian Factors (10% = 1.0 point)
    ├── Certifications (0.15 ea)
    ├── Winter services (0.2 points)
    ├── Bilingual service (0.15 points)
    ├── EV certified (0.2 points)
    └── Rust proofing (0.1 points)
```

---

## API Endpoints Overview

### REST API

```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me
  PUT    /api/auth/updateprofile

Businesses:
  GET    /api/businesses                      # List with filters
  GET    /api/businesses/:slug                # Single business
  GET    /api/businesses/top/:category        # Top rated
  GET    /api/businesses/nearby               # Geo search
  POST   /api/businesses                      # Create (auth)
  PUT    /api/businesses/:id                  # Update (auth)
  POST   /api/businesses/:id/vote             # Vote (auth)
  POST   /api/businesses/:id/click/:type      # Track click

Search:
  GET    /api/search                          # Full-text search
  GET    /api/search/autocomplete             # Suggestions

Analytics:
  GET    /api/analytics/stats                 # Platform stats
  GET    /api/analytics/business/:id          # Business analytics

SEO:
  GET    /sitemap.xml                         # Dynamic sitemap
  GET    /robots.txt                          # Robots file
```

### GraphQL API

```graphql
Query:
  - businesses(filters): BusinessList
  - business(slug): Business
  - topBusinesses(category, province): [Business]
  - nearbyBusinesses(lat, lng): [Business]
  - searchBusinesses(query): BusinessList
  - platformStats: Stats

Mutation:
  - register(credentials): AuthPayload
  - login(credentials): AuthPayload
  - voteBusiness(businessId, type): VoteResult
  - addBookmark(businessId): User
  - syncForumThread(data): Business
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  React App → React Query → Apollo Client → Axios            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     NGINX (Reverse Proxy)                    │
│  SSL Termination → Rate Limiting → Load Balancing           │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ↓                         ↓
┌──────────────────┐       ┌──────────────────┐
│  REST API        │       │  GraphQL API     │
│  Express Routes  │       │  Apollo Server   │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         └────────────┬─────────────┘
                      ↓
         ┌────────────────────────┐
         │   BUSINESS LOGIC       │
         │  - Authentication      │
         │  - Score Calculation   │
         │  - Data Validation     │
         └────────┬───────────────┘
                  │
     ┌────────────┴────────────┐
     ↓                         ↓
┌──────────┐            ┌──────────┐
│ MongoDB  │            │  Redis   │
│ (Data)   │            │ (Cache)  │
└──────────┘            └──────────┘
     ↑
     │
┌──────────────────┐
│ Python Scraper   │
│ - Google Places  │
│ - Yelp API       │
│ - Data Curation  │
└──────────────────┘
```

---

## Deployment Architecture

### Development
```
localhost:3000 (React Dev Server)
     ↓
localhost:5000 (Express API)
     ↓
localhost:27017 (MongoDB)
localhost:6379 (Redis)
```

### Production (Docker)
```
Internet
  ↓
Nginx (Port 80/443)
  ↓
Docker Network
  ├── Frontend Container
  ├── Backend Container (3 replicas)
  ├── MongoDB Container
  └── Redis Container
```

---

## Security Layers

```
1. Network Layer
   ├── Firewall rules
   ├── DDoS protection
   └── SSL/TLS encryption

2. Application Layer
   ├── Helmet.js security headers
   ├── CORS configuration
   ├── Rate limiting
   └── Input sanitization

3. Authentication Layer
   ├── JWT tokens (httpOnly)
   ├── Password hashing (bcrypt)
   ├── Role-based access control
   └── Session management

4. Data Layer
   ├── MongoDB injection prevention
   ├── Prepared statements
   ├── Data encryption at rest
   └── Regular backups
```

---

## Performance Optimizations

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Infinite scroll
- Service workers (PWA ready)

### Backend
- Redis caching (5-60 min)
- Database indexing
- Connection pooling
- Query optimization
- Response compression

### Database
- Compound indexes
- Geospatial indexing
- Text search indexes
- Aggregation pipelines
- Sharding ready

---

## Monitoring & Observability

```
Application Logs (Winston)
  ↓
Log Files (rotated daily)
  ↓
Log Aggregation (optional: ELK Stack)
  ↓
Alerts & Dashboards
```

**Metrics Tracked:**
- API response times
- Error rates
- Cache hit ratios
- Database query performance
- User engagement
- Business profile views
- Conversion rates

---

## Scalability Strategy

### Horizontal Scaling
- Docker Swarm/Kubernetes
- Multiple backend replicas
- Load balancer (Nginx)
- Redis cluster
- MongoDB replica set

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Enhance caching strategy
- CDN for static assets

---

## Development Workflow

```
1. Local Development
   └── npm run dev:full

2. Testing
   ├── npm test (Jest)
   ├── npm run test:load (Artillery)
   └── Manual QA

3. Version Control
   └── Git (feature branches)

4. CI/CD
   ├── GitHub Actions
   ├── Automated testing
   └── Docker build

5. Deployment
   ├── Docker Compose (staging)
   └── Production deployment
```

---

## Quick Reference

### Start Development
```bash
./scripts/quick-start.sh    # Automated setup
npm run dev:full            # Start both frontend & backend
```

### Seed Database
```bash
npm run seed
```

### Run Tests
```bash
npm test                    # Unit tests
npm run test:load          # Load testing
```

### Deploy with Docker
```bash
docker-compose up -d --build
```

### Update Business Scores
```bash
npm run update-scores
```

### Run Data Scraper
```bash
python3 scripts/data-scraper.py
```

---

**For detailed documentation, see:**
- [README.md](README.md) - Main documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [GROWTH_PROJECTIONS.md](GROWTH_PROJECTIONS.md) - Growth strategy

**Built with ❤️ for Canadian Automotive Excellence 🇨🇦**


