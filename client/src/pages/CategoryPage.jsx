import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';
import FilterSidebar from '../components/FilterSidebar';
import { FiFilter, FiX } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Get filter values from URL
  const province = searchParams.get('province') || '';
  const city = searchParams.get('city') || '';
  const minScore = searchParams.get('minScore') || '';
  const verified = searchParams.get('verified') || '';
  const winterServices = searchParams.get('winterServices') || '';
  const evReady = searchParams.get('evReady') || '';
  const priceRange = searchParams.get('priceRange') || '';
  const sort = searchParams.get('sort') || '-score.total';

  // Fetch businesses with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error
  } = useInfiniteQuery(
    ['businesses', category, province, city, minScore, verified, winterServices, evReady, priceRange, sort],
    async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        category,
        page: pageParam.toString(),
        limit: '20',
        sort
      });

      if (province) params.append('province', province);
      if (city) params.append('city', city);
      if (minScore) params.append('minScore', minScore);
      if (verified) params.append('verified', verified);
      if (winterServices) params.append('winterServices', winterServices);
      if (evReady) params.append('evReady', evReady);
      if (priceRange) params.append('priceRange', priceRange);

      const response = await axios.get(`${API_URL}/api/businesses?${params}`);
      return response.data;
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.pages) {
          return lastPage.page + 1;
        }
        return undefined;
      }
    }
  );

  const allBusinesses = data?.pages.flatMap(page => page.data) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const categoryNames = {
    'mechanics': 'Mechanics & Auto Repair',
    'dealerships': 'Car Dealerships',
    'auto-parts': 'Auto Parts Stores',
    'detailing': 'Car Detailing Services',
    'performance-shops': 'Performance Shops',
    'tire-centers': 'Tire Centers',
    'ev-chargers': 'EV Charging Stations',
    'body-shops': 'Body Shops',
    'oil-change': 'Oil Change Services',
    'glass-repair': 'Auto Glass Repair',
    'rust-proofing': 'Rust Proofing Services'
  };

  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [province, city, minScore, verified, winterServices, evReady, priceRange].filter(Boolean).length;

  return (
    <>
      <Helmet>
        <title>{categoryNames[category] || 'Auto Services'} in Canada | Autoilty</title>
        <meta name="description" content={`Find the best ${categoryNames[category]?.toLowerCase() || 'auto services'} in Canada. Compare ratings, reviews, and scores.`} />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {categoryNames[category] || 'Auto Services'}
          </h1>
          <p className="text-gray-300">
            {totalCount.toLocaleString()} businesses found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
          >
            <FiFilter className="mr-2" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-red-600 text-sm font-semibold hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <FilterSidebar
                filters={{
                  province,
                  city,
                  minScore,
                  verified,
                  winterServices,
                  evReady,
                  priceRange,
                  sort
                }}
                onChange={handleFilterChange}
              />

              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                Showing {allBusinesses.length} of {totalCount} businesses
              </div>
              <select
                value={sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="-score.total">Highest Score</option>
                <option value="score.total">Lowest Score</option>
                <option value="-aggregateRating.average">Highest Rated</option>
                <option value="-aggregateRating.count">Most Reviews</option>
                <option value="name">A-Z</option>
              </select>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {province && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    Province: {province}
                    <button onClick={() => handleFilterChange('province', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
                {city && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    City: {city}
                    <button onClick={() => handleFilterChange('city', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
                {minScore && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    Min Score: {minScore}
                    <button onClick={() => handleFilterChange('minScore', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
                {verified && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    Verified Only
                    <button onClick={() => handleFilterChange('verified', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
                {winterServices && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    ❄️ Winter Services
                    <button onClick={() => handleFilterChange('winterServices', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
                {evReady && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    ⚡ EV Ready
                    <button onClick={() => handleFilterChange('evReady', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
                {priceRange && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    Price: {priceRange}
                    <button onClick={() => handleFilterChange('priceRange', '')} className="ml-2">
                      <FiX size={16} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Business Grid with Infinite Scroll */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading businesses...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600">Error loading businesses. Please try again.</p>
              </div>
            ) : allBusinesses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-600 mb-4">No businesses found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <InfiniteScroll
                dataLength={allBusinesses.length}
                next={fetchNextPage}
                hasMore={hasNextPage || false}
                loader={
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mx-auto"></div>
                  </div>
                }
                endMessage={
                  <p className="text-center text-gray-600 py-8">
                    You've reached the end of the list
                  </p>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allBusinesses.map((business) => (
                    <BusinessCard key={business._id} business={business} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;


