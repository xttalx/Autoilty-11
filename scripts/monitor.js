/**
 * System Monitoring Script
 * Monitors application health, database, and API performance
 */

const axios = require('axios');
const mongoose = require('mongoose');
const { getClient } = require('../server/utils/redis');
const logger = require('../server/utils/logger');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';
const CHECK_INTERVAL = 60000; // 1 minute

class SystemMonitor {
  constructor() {
    this.metrics = {
      apiHealth: null,
      dbHealth: null,
      redisHealth: null,
      responseTime: null,
      lastCheck: null
    };
  }

  async checkAPIHealth() {
    try {
      const start = Date.now();
      const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
      const responseTime = Date.now() - start;

      this.metrics.apiHealth = response.status === 200 ? 'healthy' : 'unhealthy';
      this.metrics.responseTime = responseTime;

      logger.info(`✓ API Health: ${this.metrics.apiHealth} (${responseTime}ms)`);
      return true;
    } catch (error) {
      this.metrics.apiHealth = 'unhealthy';
      logger.error(`✗ API Health Check Failed: ${error.message}`);
      return false;
    }
  }

  async checkDatabaseHealth() {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI);
      }

      await mongoose.connection.db.admin().ping();
      
      const stats = await mongoose.connection.db.stats();
      this.metrics.dbHealth = 'healthy';
      
      logger.info(`✓ MongoDB Health: healthy (${stats.collections} collections, ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB)`);
      return true;
    } catch (error) {
      this.metrics.dbHealth = 'unhealthy';
      logger.error(`✗ MongoDB Health Check Failed: ${error.message}`);
      return false;
    }
  }

  async checkRedisHealth() {
    try {
      const client = getClient();
      
      if (!client || !client.isOpen) {
        this.metrics.redisHealth = 'disconnected';
        logger.warn('⚠ Redis: disconnected');
        return false;
      }

      await client.ping();
      this.metrics.redisHealth = 'healthy';
      
      logger.info('✓ Redis Health: healthy');
      return true;
    } catch (error) {
      this.metrics.redisHealth = 'unhealthy';
      logger.error(`✗ Redis Health Check Failed: ${error.message}`);
      return false;
    }
  }

  async checkBusinessMetrics() {
    try {
      const Business = require('../server/models/Business');
      
      const totalBusinesses = await Business.countDocuments({ status: 'active' });
      const verifiedBusinesses = await Business.countDocuments({ status: 'active', verified: true });
      const avgScore = await Business.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, avgScore: { $avg: '$score.total' } } }
      ]);

      logger.info(`📊 Business Metrics:`);
      logger.info(`   Total Active: ${totalBusinesses}`);
      logger.info(`   Verified: ${verifiedBusinesses}`);
      logger.info(`   Avg Score: ${avgScore[0]?.avgScore.toFixed(2) || 0}`);

      return true;
    } catch (error) {
      logger.error(`Error fetching business metrics: ${error.message}`);
      return false;
    }
  }

  async performHealthCheck() {
    logger.info('\n' + '='.repeat(60));
    logger.info('🔍 System Health Check');
    logger.info('='.repeat(60));

    const results = await Promise.all([
      this.checkAPIHealth(),
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.checkBusinessMetrics()
    ]);

    this.metrics.lastCheck = new Date().toISOString();

    const allHealthy = results.every(r => r === true);
    
    logger.info('\n' + '='.repeat(60));
    logger.info(`Overall Status: ${allHealthy ? '✓ HEALTHY' : '✗ ISSUES DETECTED'}`);
    logger.info('='.repeat(60) + '\n');

    // Send alert if unhealthy (implement your alerting logic here)
    if (!allHealthy) {
      this.sendAlert();
    }

    return allHealthy;
  }

  sendAlert() {
    // Implement alerting: Email, Slack, PagerDuty, etc.
    logger.error('⚠️ ALERT: System health issues detected!');
    logger.error('Metrics:', JSON.stringify(this.metrics, null, 2));
    
    // Example: Send email or webhook notification
    // await sendEmailAlert(this.metrics);
    // await sendSlackNotification(this.metrics);
  }

  startMonitoring() {
    logger.info('🚀 Starting system monitoring...');
    logger.info(`Check interval: ${CHECK_INTERVAL / 1000}s`);

    // Initial check
    this.performHealthCheck();

    // Periodic checks
    setInterval(() => {
      this.performHealthCheck();
    }, CHECK_INTERVAL);
  }
}

// Run if executed directly
if (require.main === module) {
  const monitor = new SystemMonitor();
  monitor.startMonitoring();
}

module.exports = SystemMonitor;


