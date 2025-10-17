import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';
import StatsSection from '../components/StatsSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HomePage = () => {
  // Fetch platform stats
  const { data: statsData } = useQuery('platformStats', async () => {
    const response = await axios.get(`${API_URL}/api/analytics/stats`);
    return response.data.data;
  });

  // Fetch top businesses across categories
  const { data: topMechanics } = useQuery('topMechanics', async () => {
    const response = await axios.get(`${API_URL}/api/businesses/top/mechanics?limit=3`);
    return response.data.data;
  });

  const { data: topDealerships } = useQuery('topDealerships', async () => {
    const response = await axios.get(`${API_URL}/api/businesses/top/dealerships?limit=3`);
    return response.data.data;
  });

  const categories = [
    {
      name: 'Mechanics',
      slug: 'mechanics',
      icon: '🔧',
      description: 'Trusted auto repair shops and mechanics',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Dealerships',
      slug: 'dealerships',
      icon: '🚗',
      description: 'New and used car dealerships',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Auto Parts',
      slug: 'auto-parts',
      icon: '⚙️',
      description: 'Quality parts and accessories',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Detailing',
      slug: 'detailing',
      icon: '✨',
      description: 'Professional car detailing services',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Tire Centers',
      slug: 'tire-centers',
      icon: '🛞',
      description: 'Tire sales and services',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'EV Chargers',
      slug: 'ev-chargers',
      icon: '⚡',
      description: 'Electric vehicle charging stations',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Body Shops',
      slug: 'body-shops',
      icon: '🔨',
      description: 'Collision repair and body work',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Performance Shops',
      slug: 'performance-shops',
      icon: '🏁',
      description: 'Performance tuning and upgrades',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const provinces = [
    { name: 'Ontario', code: 'ON', icon: '🏙️' },
    { name: 'Quebec', code: 'QC', icon: '🏛️' },
    { name: 'British Columbia', code: 'BC', icon: '🏔️' },
    { name: 'Alberta', code: 'AB', icon: '🛢️' },
    { name: 'Manitoba', code: 'MB', icon: '🌾' },
    { name: 'Saskatchewan', code: 'SK', icon: '🌻' }
  ];

  return (
    <>
      <Helmet>
        <title>Autoilty.com - Canada's Best Auto Businesses | Mechanics, Dealerships & More</title>
        <meta name="description" content="Discover Canada's top-rated automotive businesses. Find trusted mechanics, dealerships, auto parts stores, and more. Verified reviews and community ratings." />
        <meta name="keywords" content="auto mechanics Canada, car dealerships, auto repair, Canadian automotive services, best mechanics" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Canada's Premier Auto Business Directory
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Discover Trusted Mechanics, Dealerships & Auto Services Across Canada
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/category/mechanics"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Find Mechanics
              </Link>
              <Link
                to="/category/dealerships"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors"
              >
                Browse Dealerships
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {statsData && <StatsSection stats={statsData.overview} />}

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl`}>
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                  <div className="mt-4 flex items-center text-sm font-semibold">
                    Explore <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Mechanics */}
      {topMechanics && topMechanics.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                🔧 Top-Rated Mechanics
              </h2>
              <Link
                to="/category/mechanics"
                className="text-red-600 font-semibold hover:text-red-700"
              >
                See All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topMechanics.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Dealerships */}
      {topDealerships && topDealerships.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                🚗 Top-Rated Dealerships
              </h2>
              <Link
                to="/category/dealerships"
                className="text-red-600 font-semibold hover:text-red-700"
              >
                See All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topDealerships.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Province */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🇨🇦 Browse by Province
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {provinces.map((province) => (
              <Link
                key={province.code}
                to={`/province/${province.code}`}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors"
              >
                <div className="text-4xl mb-2">{province.icon}</div>
                <div className="font-semibold">{province.name}</div>
                <div className="text-sm text-gray-400">{province.code}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How Autoilty Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
                🔍
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-gray-600">
                Browse by category, location, or search for specific services
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
                ⭐
              </div>
              <h3 className="text-xl font-bold mb-2">Compare</h3>
              <p className="text-gray-600">
                View our 10-point score, reviews, and community ratings
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
                ✅
              </div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-gray-600">
                Contact trusted businesses and book appointments
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;


