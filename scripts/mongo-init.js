// MongoDB initialization script
// Creates database, indexes, and initial configuration

db = db.getSiblingDB('autoilty-curator');

// Create collections
db.createCollection('businesses');
db.createCollection('users');

// Create indexes for businesses
db.businesses.createIndex({ slug: 1 }, { unique: true });
db.businesses.createIndex({ category: 1, 'score.total': -1 });
db.businesses.createIndex({ 'location.address.province': 1, category: 1 });
db.businesses.createIndex({ 'location.coordinates': '2dsphere' });
db.businesses.createIndex({ status: 1, verified: 1 });
db.businesses.createIndex({ name: 'text', description: 'text' });
db.businesses.createIndex({ 'externalIds.googlePlaceId': 1 }, { sparse: true });
db.businesses.createIndex({ 'externalIds.yelpId': 1 }, { sparse: true });

// Create indexes for users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ 'votes.businessId': 1 });

print('✓ MongoDB initialized with indexes');


