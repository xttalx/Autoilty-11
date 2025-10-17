const Business = require('../models/Business');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to get user from context
const getUserFromToken = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

const resolvers = {
  Query: {
    businesses: async (_, { category, province, city, minScore, page = 1, limit = 20 }) => {
      const query = { status: 'active' };
      
      if (category) query.category = category;
      if (province) query['location.address.province'] = province;
      if (city) query['location.address.city'] = new RegExp(city, 'i');
      if (minScore) query['score.total'] = { $gte: minScore };

      const skip = (page - 1) * limit;
      const businesses = await Business.find(query)
        .sort({ 'score.total': -1 })
        .skip(skip)
        .limit(limit);

      const total = await Business.countDocuments(query);

      return {
        businesses,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    },

    business: async (_, { slug }) => {
      return await Business.findOne({ slug, status: 'active' });
    },

    topBusinesses: async (_, { category, province, limit = 10 }) => {
      return await Business.getTopByCategory(category, province, limit);
    },

    nearbyBusinesses: async (_, { lat, lng, maxDistance = 50000, category }) => {
      return await Business.findNearby(lng, lat, maxDistance, category);
    },

    searchBusinesses: async (_, { query, category, province, page = 1, limit = 20 }) => {
      const searchQuery = {
        $text: { $search: query },
        status: 'active'
      };

      if (category) searchQuery.category = category;
      if (province) searchQuery['location.address.province'] = province;

      const skip = (page - 1) * limit;
      const businesses = await Business.find(searchQuery, {
        score: { $meta: 'textScore' }
      })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit);

      const total = await Business.countDocuments(searchQuery);

      return {
        businesses,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    },

    me: async (_, __, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');
      return user;
    },

    userBookmarks: async (_, __, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');
      
      return await Business.find({
        _id: { $in: user.bookmarks }
      });
    },

    forumDiscussions: async (_, { businessId }) => {
      const business = await Business.findById(businessId);
      if (!business) throw new Error('Business not found');
      
      return business.communityData.forumThreads;
    },

    platformStats: async () => {
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

      return stats[0] || {
        totalBusinesses: 0,
        averageScore: 0,
        totalReviews: 0,
        verifiedBusinesses: 0
      };
    }
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = await User.create({ username, email, password });
      const token = user.getSignedJwtToken();

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      user.lastLogin = new Date();
      await user.save();

      const token = user.getSignedJwtToken();

      return { token, user };
    },

    createBusiness: async (_, { input }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user || !['admin', 'business_owner'].includes(user.role)) {
        throw new Error('Not authorized');
      }

      const business = await Business.create(input);
      business.calculateScore();
      await business.save();

      return business;
    },

    updateBusiness: async (_, { id, input }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');

      const business = await Business.findById(id);
      if (!business) throw new Error('Business not found');

      // Check authorization
      if (user.role !== 'admin' && business.claimedBy?.toString() !== user.id) {
        throw new Error('Not authorized');
      }

      Object.assign(business, input);
      business.calculateScore();
      await business.save();

      return business;
    },

    voteBusiness: async (_, { businessId, voteType }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');

      if (!['upvote', 'downvote'].includes(voteType)) {
        throw new Error('Invalid vote type');
      }

      const business = await Business.findById(businessId);
      if (!business) throw new Error('Business not found');

      const existingVote = user.votes.find(
        v => v.businessId.toString() === businessId
      );

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          throw new Error('Already voted');
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

      await user.addVote(businessId, voteType);
      business.calculateScore();
      await business.save();

      return {
        upvotes: business.communityData.userVotes.upvotes,
        downvotes: business.communityData.userVotes.downvotes,
        score: business.score
      };
    },

    removeVote: async (_, { businessId }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');

      const business = await Business.findById(businessId);
      if (!business) throw new Error('Business not found');

      const existingVote = user.votes.find(
        v => v.businessId.toString() === businessId
      );

      if (existingVote) {
        if (existingVote.voteType === 'upvote') {
          business.communityData.userVotes.upvotes -= 1;
        } else {
          business.communityData.userVotes.downvotes -= 1;
        }

        await user.removeVote(businessId);
        business.calculateScore();
        await business.save();
      }

      return {
        upvotes: business.communityData.userVotes.upvotes,
        downvotes: business.communityData.userVotes.downvotes,
        score: business.score
      };
    },

    addBookmark: async (_, { businessId }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');

      if (!user.bookmarks.includes(businessId)) {
        user.bookmarks.push(businessId);
        await user.save();
      }

      return user;
    },

    removeBookmark: async (_, { businessId }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user) throw new Error('Not authenticated');

      user.bookmarks = user.bookmarks.filter(
        id => id.toString() !== businessId
      );
      await user.save();

      return user;
    },

    syncForumThread: async (_, { businessId, threadId, title, url, sentiment }, { req }) => {
      const user = await getUserFromToken(req);
      if (!user || !['admin', 'moderator'].includes(user.role)) {
        throw new Error('Not authorized');
      }

      const business = await Business.findById(businessId);
      if (!business) throw new Error('Business not found');

      const existingThread = business.communityData.forumThreads.find(
        t => t.threadId === threadId
      );

      if (!existingThread) {
        business.communityData.forumThreads.push({
          threadId,
          title,
          url,
          sentiment: sentiment || 'neutral',
          votes: 0
        });

        business.socialMetrics.forumDiscussions += 1;
        business.calculateScore();
        await business.save();
      }

      return business;
    },

    trackClick: async (_, { businessId, clickType }) => {
      const validTypes = ['phone', 'website', 'directions', 'booking'];
      
      if (!validTypes.includes(clickType)) {
        throw new Error('Invalid click type');
      }

      const updateField = `analytics.${clickType}Clicks`;
      await Business.findByIdAndUpdate(businessId, {
        $inc: { [updateField]: 1, 'analytics.clickThroughs': 1 }
      });

      return true;
    }
  },

  Business: {
    id: (business) => business._id.toString()
  },

  User: {
    id: (user) => user._id.toString()
  }
};

module.exports = resolvers;


