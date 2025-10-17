const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/index');
const Business = require('../server/models/Business');

describe('Business API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/autoilty-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await Business.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/businesses', () => {
    it('should return all active businesses', async () => {
      const res = await request(app)
        .get('/api/businesses')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter businesses by category', async () => {
      const res = await request(app)
        .get('/api/businesses?category=mechanics')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(business => {
        expect(business.category).toBe('mechanics');
      });
    });

    it('should filter businesses by province', async () => {
      const res = await request(app)
        .get('/api/businesses?province=ON')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(business => {
        expect(business.location.address.province).toBe('ON');
      });
    });

    it('should filter by minimum score', async () => {
      const res = await request(app)
        .get('/api/businesses?minScore=7')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(business => {
        expect(business.score.total).toBeGreaterThanOrEqual(7);
      });
    });
  });

  describe('GET /api/businesses/top/:category', () => {
    it('should return top businesses for a category', async () => {
      const res = await request(app)
        .get('/api/businesses/top/mechanics?limit=5')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      
      // Verify sorted by score
      for (let i = 0; i < res.body.data.length - 1; i++) {
        expect(res.body.data[i].score.total).toBeGreaterThanOrEqual(
          res.body.data[i + 1].score.total
        );
      }
    });
  });

  describe('GET /api/businesses/:slug', () => {
    let testBusiness;

    beforeEach(async () => {
      testBusiness = await Business.create({
        name: 'Test Auto Shop',
        category: 'mechanics',
        location: {
          address: {
            city: 'Toronto',
            province: 'ON'
          }
        },
        status: 'active'
      });
    });

    afterEach(async () => {
      await Business.findByIdAndDelete(testBusiness._id);
    });

    it('should return a business by slug', async () => {
      const res = await request(app)
        .get(`/api/businesses/${testBusiness.slug}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Auto Shop');
    });

    it('should return 404 for non-existent business', async () => {
      const res = await request(app)
        .get('/api/businesses/non-existent-slug')
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('should increment view count', async () => {
      const initialViews = testBusiness.analytics.profileViews;
      
      await request(app)
        .get(`/api/businesses/${testBusiness.slug}`)
        .expect(200);

      const updated = await Business.findById(testBusiness._id);
      expect(updated.analytics.profileViews).toBe(initialViews + 1);
    });
  });

  describe('Business Scoring Algorithm', () => {
    it('should calculate score correctly', async () => {
      const business = new Business({
        name: 'Test Business',
        category: 'mechanics',
        location: {
          address: {
            city: 'Toronto',
            province: 'ON'
          }
        },
        aggregateRating: {
          average: 4.5,
          count: 100
        },
        communityData: {
          userVotes: {
            upvotes: 50,
            downvotes: 5
          },
          forumThreads: [{ threadId: '1' }]
        },
        socialMetrics: {
          instagramMentions: 50,
          facebookFollowers: 500
        },
        canadianFactors: {
          winterServices: true,
          certifications: [{ type: 'CAA_APPROVED' }]
        }
      });

      business.calculateScore();

      // Verify score components
      expect(business.score.reviews).toBeGreaterThan(0);
      expect(business.score.community).toBeGreaterThan(0);
      expect(business.score.socialSignals).toBeGreaterThan(0);
      expect(business.score.canadianFactors).toBeGreaterThan(0);
      expect(business.score.total).toBeLessThanOrEqual(10);
      expect(business.score.total).toBeGreaterThan(0);
    });
  });

  describe('POST /api/search', () => {
    it('should search businesses by text', async () => {
      const res = await request(app)
        .get('/api/search?q=mechanic')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return empty results for invalid query', async () => {
      const res = await request(app)
        .get('/api/search?q=x')
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });
});


