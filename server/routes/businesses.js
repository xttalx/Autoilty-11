const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { protect, authorize } = require('../middleware/auth');
const { getCache, setCache, clearCachePattern } = require('../utils/redis');
const logger = require('../utils/logger');

// @route   GET /api/businesses
// @desc    Get all businesses with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      province,
      city,
      minScore,
      priceRange,
      verified,
      winterServices,
      evReady,
      page = 1,
      limit = 20,
      sort = '-score.total'
    } = req.query;

    // Build cache key
    const cacheKey = `businesses:${JSON.stringify(req.query)}`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Build query
    const query = { status: 'active' };
    
    if (category) query.category = category;
    if (province) query['location.address.province'] = province;
    if (city) query['location.address.city'] = new RegExp(city, 'i');
    if (minScore) query['score.total'] = { $gte: parseFloat(minScore) };
    if (priceRange) query.priceRange = priceRange;
    if (verified === 'true') query.verified = true;
    if (winterServices === 'true') query['canadianFactors.winterServices'] = true;
    if (evReady === 'true') query['canadianFactors.evReadiness.evCertified'] = true;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const businesses = await Business.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews -communityData.forumThreads');

    const total = await Business.countDocuments(query);

    const response = {
      success: true,
      count: businesses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: businesses
    };

    // Cache for 10 minutes
    await setCache(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    logger.error('Error fetching businesses:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching businesses'
    });
  }
});

// @route   GET /api/businesses/top/:category
// @desc    Get top businesses by category
// @access  Public
router.get('/top/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { province, limit = 10 } = req.query;

    const cacheKey = `top:${category}:${province || 'all'}:${limit}`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const businesses = await Business.getTopByCategory(
      category,
      province,
      parseInt(limit)
    );

    const response = {
      success: true,
      category,
      province: province || 'All Canada',
      count: businesses.length,
      data: businesses
    };

    // Cache for 1 hour
    await setCache(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    logger.error('Error fetching top businesses:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching top businesses'
    });
  }
});

// @route   GET /api/businesses/nearby
// @desc    Get nearby businesses
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const businesses = await Business.findNearby(
      parseFloat(lng),
      parseFloat(lat),
      parseInt(maxDistance),
      category
    );

    res.json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    logger.error('Error finding nearby businesses:', error);
    res.status(500).json({
      success: false,
      error: 'Server error finding nearby businesses'
    });
  }
});

// @route   GET /api/businesses/:slug
// @desc    Get single business by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const cacheKey = `business:${slug}`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      // Increment view count asynchronously
      Business.findByIdAndUpdate(cached._id, {
        $inc: { 'analytics.profileViews': 1 },
        'analytics.lastViewedAt': new Date()
      }).catch(err => logger.error('Error updating view count:', err));
      
      return res.json(cached);
    }

    const business = await Business.findOne({ slug, status: 'active' });

    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }

    // Increment view count
    business.analytics.profileViews += 1;
    business.analytics.lastViewedAt = new Date();
    await business.save();

    const response = {
      success: true,
      data: business
    };

    // Cache for 5 minutes
    await setCache(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    logger.error('Error fetching business:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching business'
    });
  }
});

// @route   POST /api/businesses
// @desc    Create new business
// @access  Private (Admin/Business Owner)
router.post('/', protect, authorize('admin', 'business_owner'), async (req, res) => {
  try {
    const business = await Business.create(req.body);

    // Calculate initial score
    business.calculateScore();
    await business.save();

    // Clear related caches
    await clearCachePattern('businesses:*');
    await clearCachePattern('top:*');

    logger.info(`New business created: ${business.name} (${business._id})`);

    res.status(201).json({
      success: true,
      data: business
    });
  } catch (error) {
    logger.error('Error creating business:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/businesses/:id
// @desc    Update business
// @access  Private (Admin/Business Owner)
router.put('/:id', protect, authorize('admin', 'business_owner'), async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }

    // Check ownership (if not admin)
    if (req.user.role !== 'admin' && business.claimedBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this business'
      });
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Recalculate score
    business.calculateScore();
    await business.save();

    // Clear caches
    await clearCachePattern('businesses:*');
    await clearCachePattern('top:*');
    await deleteCache(`business:${business.slug}`);

    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    logger.error('Error updating business:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/businesses/:id/vote
// @desc    Vote on a business
// @access  Private
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type'
      });
    }

    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    // Check if user has already voted
    const existingVote = user.votes.find(
      v => v.businessId.toString() === req.params.id
    );

    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType === voteType) {
        return res.status(400).json({
          success: false,
          error: 'You have already cast this vote'
        });
      }
      
      // Change vote
      if (existingVote.voteType === 'upvote') {
        business.communityData.userVotes.upvotes -= 1;
        business.communityData.userVotes.downvotes += 1;
      } else {
        business.communityData.userVotes.downvotes -= 1;
        business.communityData.userVotes.upvotes += 1;
      }
    } else {
      // New vote
      if (voteType === 'upvote') {
        business.communityData.userVotes.upvotes += 1;
      } else {
        business.communityData.userVotes.downvotes += 1;
      }
    }

    // Update user vote record
    await user.addVote(req.params.id, voteType);

    // Recalculate score
    business.calculateScore();
    await business.save();

    // Clear caches
    await clearCachePattern('businesses:*');
    await deleteCache(`business:${business.slug}`);

    res.json({
      success: true,
      data: {
        upvotes: business.communityData.userVotes.upvotes,
        downvotes: business.communityData.userVotes.downvotes,
        score: business.score
      }
    });
  } catch (error) {
    logger.error('Error voting on business:', error);
    res.status(500).json({
      success: false,
      error: 'Server error processing vote'
    });
  }
});

// @route   POST /api/businesses/:id/click/:type
// @desc    Track business click analytics
// @access  Public
router.post('/:id/click/:type', async (req, res) => {
  try {
    const { id, type } = req.params;
    const validTypes = ['phone', 'website', 'directions', 'booking'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid click type'
      });
    }

    const updateField = `analytics.${type}Clicks`;
    await Business.findByIdAndUpdate(id, {
      $inc: { [updateField]: 1, 'analytics.clickThroughs': 1 }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error tracking click:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;


