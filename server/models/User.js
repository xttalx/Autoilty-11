const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'business_owner', 'moderator', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    location: {
      city: String,
      province: String
    },
    vehicles: [{
      make: String,
      model: String,
      year: Number,
      trim: String
    }],
    interests: [String]
  },
  forumData: {
    forumUserId: String,
    postCount: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    joinedForum: Date
  },
  businessClaims: [{
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    claimedAt: Date,
    verified: { type: Boolean, default: false }
  }],
  votes: [{
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    voteType: {
      type: String,
      enum: ['upvote', 'downvote']
    },
    votedAt: Date
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  }],
  reviews: [{
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    rating: Number,
    text: String,
    createdAt: Date
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    language: {
      type: String,
      enum: ['en', 'fr'],
      default: 'en'
    },
    newsletter: { type: Boolean, default: false }
  },
  verification: {
    email: {
      verified: { type: Boolean, default: false },
      token: String,
      expires: Date
    },
    phone: {
      verified: { type: Boolean, default: false },
      number: String
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has voted on a business
userSchema.methods.hasVoted = function(businessId) {
  return this.votes.some(vote => vote.businessId.toString() === businessId.toString());
};

// Add or update vote
userSchema.methods.addVote = function(businessId, voteType) {
  const existingVote = this.votes.find(v => v.businessId.toString() === businessId.toString());
  
  if (existingVote) {
    existingVote.voteType = voteType;
    existingVote.votedAt = new Date();
  } else {
    this.votes.push({
      businessId,
      voteType,
      votedAt: new Date()
    });
  }
  
  return this.save();
};

// Remove vote
userSchema.methods.removeVote = function(businessId) {
  this.votes = this.votes.filter(v => v.businessId.toString() !== businessId.toString());
  return this.save();
};

module.exports = mongoose.model('User', userSchema);


