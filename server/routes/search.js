const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { getCache, setCache } = require('../utils/redis');

// @route   GET /api/search
// @desc    Search businesses with full-text search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { q, category, province, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const cacheKey = `search:${q}:${category || 'all'}:${province || 'all'}:${page}`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Build query
    const query = {
      $text: { $search: q },
      status: 'active'
    };

    if (category) query.category = category;
    if (province) query['location.address.province'] = province;

    // Execute search with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const businesses = await Business.find(query, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' }, 'score.total': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews -communityData.forumThreads');

    const total = await Business.countDocuments(query);

    const response = {
      success: true,
      query: q,
      count: businesses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: businesses
    };

    // Cache for 5 minutes
    await setCache(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search error'
    });
  }
});

// @route   GET /api/search/autocomplete
// @desc    Autocomplete suggestions
// @access  Public
router.get('/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const cacheKey = `autocomplete:${q}`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const regex = new RegExp(q, 'i');
    const suggestions = await Business.find({
      name: regex,
      status: 'active'
    })
      .limit(10)
      .select('name category location.address.city location.address.province slug');

    const response = {
      success: true,
      data: suggestions
    };

    // Cache for 10 minutes
    await setCache(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Autocomplete error'
    });
  }
});

module.exports = router;


