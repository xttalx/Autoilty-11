const redis = require('redis');
const logger = require('./logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

const getCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis GET error:', error);
    return null;
  }
};

const setCache = async (key, value, expiryInSeconds = 3600) => {
  if (!redisClient || !redisClient.isOpen) return false;
  
  try {
    await redisClient.setEx(key, expiryInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis SET error:', error);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis DELETE error:', error);
    return false;
  }
};

const clearCachePattern = async (pattern) => {
  if (!redisClient || !redisClient.isOpen) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error('Redis CLEAR PATTERN error:', error);
    return false;
  }
};

module.exports = {
  connectRedis,
  getCache,
  setCache,
  deleteCache,
  clearCachePattern,
  getClient: () => redisClient
};


