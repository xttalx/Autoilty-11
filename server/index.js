const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const { connectRedis } = require('./utils/redis');

// Initialize Express
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/analytics', require('./routes/analytics'));

// GraphQL endpoint (for forum integration)
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});

async function startServer() {
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }

  // Connect to Redis
  try {
    await connectRedis();
    logger.info('Redis Connected Successfully');
  } catch (error) {
    logger.warn('Redis connection failed, continuing without cache:', error.message);
  }

  // Start Apollo Server
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Autoilty Backend Server running on port ${PORT}`);
    logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
}

// Initialize scheduled tasks
if (process.env.NODE_ENV === 'production') {
  require('./jobs/scoreUpdater');
  require('./jobs/dataScraper');
}

startServer();

module.exports = app;


