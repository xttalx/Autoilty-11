/**
 * Score Updater Script
 * Recalculates business scores periodically
 * Run via cron job or manually
 */

const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

const Business = require('../server/models/Business');
const logger = require('../server/utils/logger');
const { clearCachePattern } = require('../server/utils/redis');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connected for score updates');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function updateAllScores() {
  logger.info('Starting score update for all businesses...');
  
  try {
    const businesses = await Business.find({ status: 'active' });
    let updated = 0;
    let failed = 0;

    for (const business of businesses) {
      try {
        const oldScore = business.score.total;
        business.calculateScore();
        await business.save();
        
        const newScore = business.score.total;
        const change = (newScore - oldScore).toFixed(2);
        
        logger.info(
          `Updated: ${business.name} - ` +
          `Score: ${oldScore.toFixed(2)} → ${newScore.toFixed(2)} ` +
          `(${change >= 0 ? '+' : ''}${change})`
        );
        
        updated++;
      } catch (error) {
        logger.error(`Failed to update ${business.name}:`, error.message);
        failed++;
      }
    }

    // Clear all caches after score update
    await clearCachePattern('*');

    logger.info(
      `Score update completed: ${updated} updated, ${failed} failed, ` +
      `${businesses.length} total`
    );

    return { updated, failed, total: businesses.length };
  } catch (error) {
    logger.error('Error in updateAllScores:', error);
    throw error;
  }
}

async function updateBusinessScore(businessId) {
  try {
    const business = await Business.findById(businessId);
    
    if (!business) {
      logger.error(`Business not found: ${businessId}`);
      return null;
    }

    const oldScore = business.score.total;
    business.calculateScore();
    await business.save();
    
    const newScore = business.score.total;
    
    logger.info(
      `Updated single business: ${business.name} - ` +
      `Score: ${oldScore.toFixed(2)} → ${newScore.toFixed(2)}`
    );

    // Clear relevant caches
    await clearCachePattern(`business:${business.slug}`);
    await clearCachePattern('businesses:*');
    await clearCachePattern('top:*');

    return business;
  } catch (error) {
    logger.error('Error updating business score:', error);
    throw error;
  }
}

// Schedule automatic updates (daily at 2 AM)
function scheduleScoreUpdates() {
  logger.info('Scheduling daily score updates at 2:00 AM');
  
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running scheduled score update...');
    try {
      await updateAllScores();
    } catch (error) {
      logger.error('Scheduled update failed:', error);
    }
  });
}

// If run directly
if (require.main === module) {
  connectDB().then(async () => {
    const args = process.argv.slice(2);
    
    if (args[0] === '--schedule') {
      // Run as daemon with scheduled updates
      scheduleScoreUpdates();
      logger.info('Score updater running in scheduled mode');
    } else if (args[0] === '--id' && args[1]) {
      // Update single business
      await updateBusinessScore(args[1]);
      process.exit(0);
    } else {
      // Update all businesses once
      await updateAllScores();
      process.exit(0);
    }
  }).catch(error => {
    logger.error('Failed to start score updater:', error);
    process.exit(1);
  });
}

module.exports = {
  updateAllScores,
  updateBusinessScore,
  scheduleScoreUpdates
};


