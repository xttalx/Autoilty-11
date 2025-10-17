const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/analytics/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Business.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalBusinesses: { $sum: 1 },
          averageScore: { $avg: '$score.total' },
          totalReviews: { $sum: '$aggregateRating.count' },
          verifiedBusinesses: {
            $sum: { $cond: ['$verified', 1, 0] }
          }
        }
      }
    ]);

    const categoryCounts = await Business.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const provinceCounts = await Business.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location.address.province', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        byCategory: categoryCounts,
        byProvince: provinceCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching statistics'
    });
  }
});

// @route   GET /api/analytics/business/:id
// @desc    Get detailed analytics for a business
// @access  Private (Business Owner/Admin)
router.get('/business/:id', protect, authorize('business_owner', 'admin'), async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && business.claimedBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: {
        analytics: business.analytics,
        score: business.score,
        rating: business.aggregateRating,
        social: business.socialMetrics,
        community: {
          votes: business.communityData.userVotes,
          discussions: business.communityData.forumThreads.length,
          recommendations: business.communityData.recommendations
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching analytics'
    });
  }
});

module.exports = router;


