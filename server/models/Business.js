const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['google', 'yelp', 'forum', 'manual'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  text: String,
  author: String,
  date: Date,
  verified: {
    type: Boolean,
    default: false
  }
});

const scoreBreakdownSchema = new mongoose.Schema({
  reviews: {
    type: Number,
    default: 0,
    max: 4.0
  },
  community: {
    type: Number,
    default: 0,
    max: 3.0
  },
  socialSignals: {
    type: Number,
    default: 0,
    max: 2.0
  },
  canadianFactors: {
    type: Number,
    default: 0,
    max: 1.0
  },
  total: {
    type: Number,
    default: 0,
    max: 10.0
  }
}, { _id: false });

const locationSchema = new mongoose.Schema({
  address: {
    street: String,
    city: { type: String, required: true },
    province: {
      type: String,
      enum: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
      required: true
    },
    postalCode: String,
    country: {
      type: String,
      default: 'Canada'
    }
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  timezone: String
}, { _id: false });

const businessHoursSchema = new mongoose.Schema({
  monday: { open: String, close: String, closed: { type: Boolean, default: false } },
  tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
  wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
  thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
  friday: { open: String, close: String, closed: { type: Boolean, default: false } },
  saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
  sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
}, { _id: false });

const canadianCertificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CAA_APPROVED', 'RED_SEAL', 'PROVINCIAL_CERTIFIED', 'BBB_ACCREDITED', 'OEM_CERTIFIED', 'OMVIC']
  },
  issuedBy: String,
  issuedDate: Date,
  expiryDate: Date,
  verified: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const businessSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  category: {
    type: String,
    enum: [
      'mechanics',
      'dealerships',
      'auto-parts',
      'detailing',
      'performance-shops',
      'tire-centers',
      'ev-chargers',
      'body-shops',
      'oil-change',
      'car-wash',
      'towing',
      'inspections',
      'glass-repair',
      'rust-proofing'
    ],
    required: true,
    index: true
  },
  subcategories: [{
    type: String
  }],
  description: {
    type: String,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },

  // Location
  location: {
    type: locationSchema,
    required: true
  },

  // Contact Information
  contact: {
    phone: String,
    email: String,
    website: String,
    bookingUrl: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String
    }
  },

  // Operating Details
  hours: businessHoursSchema,
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  paymentMethods: [{
    type: String,
    enum: ['cash', 'credit', 'debit', 'financing', 'e-transfer']
  }],

  // Reviews & Ratings
  reviews: [reviewSchema],
  aggregateRating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },

  // Autoilty Scoring System (10-point scale)
  score: {
    type: scoreBreakdownSchema,
    default: () => ({})
  },

  // Canadian-Specific Factors
  canadianFactors: {
    certifications: [canadianCertificationSchema],
    winterServices: {
      type: Boolean,
      default: false
    },
    bilingualService: {
      english: { type: Boolean, default: true },
      french: { type: Boolean, default: false }
    },
    evReadiness: {
      hasChargers: { type: Boolean, default: false },
      evCertified: { type: Boolean, default: false }
    },
    rustProofing: {
      type: Boolean,
      default: false
    }
  },

  // Social Signals
  socialMetrics: {
    instagramMentions: { type: Number, default: 0 },
    facebookFollowers: { type: Number, default: 0 },
    twitterMentions: { type: Number, default: 0 },
    forumDiscussions: { type: Number, default: 0 },
    lastUpdated: Date
  },

  // Community Engagement
  communityData: {
    forumThreads: [{
      threadId: String,
      title: String,
      url: String,
      sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative']
      },
      votes: Number
    }],
    userVotes: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 }
    },
    recommendations: { type: Number, default: 0 }
  },

  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false },
    uploadedAt: Date
  }],
  videos: [{
    url: String,
    platform: String,
    title: String
  }],

  // Premium Features
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumBadges: [{
    type: String,
    enum: ['TOP_RATED_CAA', 'EDITOR_CHOICE', 'BEST_VALUE', 'MOST_POPULAR', 'TRUSTED_PARTNER']
  }],
  sponsoredListing: {
    active: { type: Boolean, default: false },
    expiryDate: Date,
    rank: Number
  },

  // Affiliate Links
  affiliateLinks: [{
    platform: String,
    url: String,
    commission: Number
  }],

  // Business Analytics
  analytics: {
    profileViews: { type: Number, default: 0 },
    clickThroughs: { type: Number, default: 0 },
    phoneClicks: { type: Number, default: 0 },
    websiteClicks: { type: Number, default: 0 },
    directionsClicks: { type: Number, default: 0 },
    bookingClicks: { type: Number, default: 0 },
    lastViewedAt: Date
  },

  // Data Sources
  externalIds: {
    googlePlaceId: String,
    yelpId: String,
    foursquareId: String
  },

  // Status & Verification
  verified: {
    type: Boolean,
    default: false
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'closed'],
    default: 'pending'
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    schemaMarkup: mongoose.Schema.Types.Mixed
  },

  // Metadata
  lastScraped: Date,
  lastScoreUpdate: Date,
  dataQuality: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
businessSchema.index({ 'location.coordinates': '2dsphere' });
businessSchema.index({ category: 1, 'score.total': -1 });
businessSchema.index({ 'location.address.province': 1, category: 1 });
businessSchema.index({ slug: 1 });
businessSchema.index({ status: 1, verified: 1 });
businessSchema.index({ name: 'text', description: 'text' });

// Virtual for full address
businessSchema.virtual('fullAddress').get(function() {
  const addr = this.location.address;
  return `${addr.street || ''}, ${addr.city}, ${addr.province} ${addr.postalCode || ''}`.trim();
});

// Pre-save middleware to generate slug
businessSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + this.location.address.city.toLowerCase();
  }
  next();
});

// Method to calculate and update score
businessSchema.methods.calculateScore = function() {
  const scores = { reviews: 0, community: 0, socialSignals: 0, canadianFactors: 0 };

  // 1. Reviews Score (40% = 4.0 points)
  if (this.aggregateRating.count > 0) {
    const ratingScore = (this.aggregateRating.average / 5) * 3.0; // 3.0 for rating
    const volumeScore = Math.min(this.aggregateRating.count / 100, 1.0) * 1.0; // 1.0 for volume
    scores.reviews = Math.min(ratingScore + volumeScore, 4.0);
  }

  // 2. Community Score (30% = 3.0 points)
  const netVotes = this.communityData.userVotes.upvotes - this.communityData.userVotes.downvotes;
  const voteScore = Math.min(netVotes / 50, 1.5); // 1.5 for votes
  const threadScore = Math.min(this.communityData.forumThreads.length / 10, 1.0); // 1.0 for discussions
  const recommendScore = Math.min(this.communityData.recommendations / 20, 0.5); // 0.5 for recommendations
  scores.community = Math.max(0, Math.min(voteScore + threadScore + recommendScore, 3.0));

  // 3. Social Signals Score (20% = 2.0 points)
  const instagramScore = Math.min(this.socialMetrics.instagramMentions / 100, 0.8);
  const facebookScore = Math.min(this.socialMetrics.facebookFollowers / 1000, 0.6);
  const forumScore = Math.min(this.socialMetrics.forumDiscussions / 10, 0.6);
  scores.socialSignals = Math.min(instagramScore + facebookScore + forumScore, 2.0);

  // 4. Canadian Factors (10% = 1.0 point)
  let canadianScore = 0;
  canadianScore += this.canadianFactors.certifications.length * 0.15;
  canadianScore += this.canadianFactors.winterServices ? 0.2 : 0;
  canadianScore += this.canadianFactors.bilingualService.french ? 0.15 : 0;
  canadianScore += this.canadianFactors.evReadiness.evCertified ? 0.2 : 0;
  canadianScore += this.canadianFactors.rustProofing ? 0.1 : 0;
  scores.canadianFactors = Math.min(canadianScore, 1.0);

  // Update score breakdown
  this.score.reviews = parseFloat(scores.reviews.toFixed(2));
  this.score.community = parseFloat(scores.community.toFixed(2));
  this.score.socialSignals = parseFloat(scores.socialSignals.toFixed(2));
  this.score.canadianFactors = parseFloat(scores.canadianFactors.toFixed(2));
  this.score.total = parseFloat((
    scores.reviews + 
    scores.community + 
    scores.socialSignals + 
    scores.canadianFactors
  ).toFixed(2));

  this.lastScoreUpdate = new Date();
  return this.score;
};

// Static method to get top businesses by category
businessSchema.statics.getTopByCategory = function(category, province, limit = 10) {
  const query = { category, status: 'active' };
  if (province) query['location.address.province'] = province;
  
  return this.find(query)
    .sort({ 'score.total': -1, 'aggregateRating.average': -1 })
    .limit(limit)
    .select('-reviews -communityData.forumThreads');
};

// Static method for geo-spatial search
businessSchema.statics.findNearby = function(longitude, latitude, maxDistance = 50000, category) {
  const query = {
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  };
  
  if (category) query.category = category;
  
  return this.find(query).limit(20);
};

module.exports = mongoose.model('Business', businessSchema);


