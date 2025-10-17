const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Business = require('../models/Business');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/bookmarks
// @desc    Get user's bookmarked businesses
// @access  Private
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching bookmarks'
    });
  }
});

// @route   POST /api/users/bookmarks/:businessId
// @desc    Add business to bookmarks
// @access  Private
router.post('/bookmarks/:businessId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.bookmarks.includes(req.params.businessId)) {
      return res.status(400).json({
        success: false,
        error: 'Business already bookmarked'
      });
    }

    user.bookmarks.push(req.params.businessId);
    await user.save();

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error adding bookmark'
    });
  }
});

// @route   DELETE /api/users/bookmarks/:businessId
// @desc    Remove business from bookmarks
// @access  Private
router.delete('/bookmarks/:businessId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.bookmarks = user.bookmarks.filter(
      id => id.toString() !== req.params.businessId
    );
    await user.save();

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error removing bookmark'
    });
  }
});

module.exports = router;


