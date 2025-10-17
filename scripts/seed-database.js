/**
 * Database Seeding Script
 * Populates database with sample data for testing
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Business = require('../server/models/Business');
const User = require('../server/models/User');
const logger = require('../server/utils/logger');

const sampleBusinesses = [
  {
    name: 'Toronto Premium Auto Repair',
    category: 'mechanics',
    description: 'Full-service automotive repair shop specializing in European vehicles',
    location: {
      address: {
        street: '123 King Street West',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5H 1A1'
      },
      coordinates: {
        type: 'Point',
        coordinates: [-79.3832, 43.6532]
      }
    },
    contact: {
      phone: '416-555-0100',
      website: 'https://torontoautorepair.example.com',
      email: 'info@torontoautorepair.com'
    },
    aggregateRating: {
      average: 4.8,
      count: 127
    },
    priceRange: '$$$',
    verified: true,
    canadianFactors: {
      winterServices: true,
      bilingualService: { english: true, french: false },
      certifications: [
        { type: 'CAA_APPROVED', verified: true },
        { type: 'RED_SEAL', verified: true }
      ]
    },
    status: 'active'
  },
  {
    name: 'Vancouver EV Center',
    category: 'dealerships',
    description: 'Leading electric vehicle dealership in British Columbia',
    location: {
      address: {
        street: '456 Granville Street',
        city: 'Vancouver',
        province: 'BC',
        postalCode: 'V6C 1V3'
      },
      coordinates: {
        type: 'Point',
        coordinates: [-123.1207, 49.2827]
      }
    },
    contact: {
      phone: '604-555-0200',
      website: 'https://vancouverevcenter.example.com'
    },
    aggregateRating: {
      average: 4.6,
      count: 89
    },
    priceRange: '$$$$',
    verified: true,
    isPremium: true,
    canadianFactors: {
      evReadiness: {
        hasChargers: true,
        evCertified: true
      },
      bilingualService: { english: true, french: false }
    },
    status: 'active'
  },
  {
    name: 'Montreal Pneus & Auto',
    category: 'tire-centers',
    description: 'Centre de pneus et service automobile - Tire center and automotive service',
    location: {
      address: {
        street: '789 Rue Saint-Catherine',
        city: 'Montreal',
        province: 'QC',
        postalCode: 'H3B 1B1'
      },
      coordinates: {
        type: 'Point',
        coordinates: [-73.5698, 45.5017]
      }
    },
    contact: {
      phone: '514-555-0300',
      website: 'https://montrealtires.example.com'
    },
    aggregateRating: {
      average: 4.7,
      count: 156
    },
    priceRange: '$$',
    verified: true,
    canadianFactors: {
      winterServices: true,
      bilingualService: { english: true, french: true },
      rustProofing: true
    },
    status: 'active'
  },
  {
    name: 'Calgary Performance Tuning',
    category: 'performance-shops',
    description: 'High-performance automotive tuning and modifications',
    location: {
      address: {
        street: '321 17th Avenue SW',
        city: 'Calgary',
        province: 'AB',
        postalCode: 'T2S 0A1'
      },
      coordinates: {
        type: 'Point',
        coordinates: [-114.0719, 51.0447]
      }
    },
    contact: {
      phone: '403-555-0400',
      website: 'https://calgaryperformance.example.com'
    },
    aggregateRating: {
      average: 4.9,
      count: 78
    },
    priceRange: '$$$',
    verified: true,
    canadianFactors: {
      winterServices: true
    },
    status: 'active'
  }
];

const sampleUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'adminuser',
    email: 'admin@autoilty.com',
    password: 'admin123',
    role: 'admin'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Business.deleteMany({});
    await User.deleteMany({});
    logger.info('Cleared existing data');

    // Insert sample businesses
    const businesses = await Business.insertMany(sampleBusinesses);
    logger.info(`✓ Inserted ${businesses.length} sample businesses`);

    // Calculate scores for businesses
    for (const business of businesses) {
      business.calculateScore();
      await business.save();
    }
    logger.info('✓ Calculated scores for all businesses');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    logger.info(`✓ Inserted ${users.length} sample users`);

    logger.info('\n🎉 Database seeding completed successfully!');
    logger.info(`\nSample Login Credentials:`);
    logger.info(`User: john@example.com / password123`);
    logger.info(`Admin: admin@autoilty.com / admin123`);

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();


