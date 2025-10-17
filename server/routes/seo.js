const express = require('express');
const router = express.Router();
const { generateSitemap, generateRobotsTxt } = require('../utils/seo');
const { getCache, setCache } = require('../utils/redis');
const logger = require('../utils/logger');

// @route   GET /sitemap.xml
// @desc    Generate and serve sitemap
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'sitemap:xml';
    const cached = await getCache(cacheKey);
    
    if (cached) {
      res.header('Content-Type', 'application/xml');
      return res.send(cached);
    }

    // Generate sitemap
    const sitemap = await generateSitemap();
    
    // Cache for 24 hours
    await setCache(cacheKey, sitemap, 86400);
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    logger.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// @route   GET /robots.txt
// @desc    Serve robots.txt
// @access  Public
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(generateRobotsTxt());
});

module.exports = router;


