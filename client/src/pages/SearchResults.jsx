import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';
import { FiSearch } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const province = searchParams.get('province') || '';

  const { data, isLoading, error } = useQuery(
    ['search', query, category, province],
    async () => {
      const params = new URLSearchParams({ q: query });
      if (category) params.append('category', category);
      if (province) params.append('province', province);

      const response = await axios.get(`${API_URL}/api/search?${params}`);
      return response.data;
    },
    {
      enabled: query.length >= 2
    }
  );

  return (
    <>
      <Helmet>
        <title>Search Results: {query} | Autoilty</title>
        <meta name="description" content={`Search results for "${query}" on Autoilty.com`} />
      </Helmet>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <FiSearch className="text-3xl mr-3" />
            <h1 className="text-4xl font-bold">Search Results</h1>
          </div>
          <p className="text-gray-300">
            Showing results for: <span className="font-semibold">"{query}"</span>
          </p>
          {data && (
            <p className="text-gray-400 mt-2">
              {data.total} {data.total === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-red-600 text-xl mb-4">Error performing search</p>
            <Link to="/" className="text-red-600 hover:text-red-700">
              Return to Home
            </Link>
          </div>
        ) : !data || data.count === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 mb-4">No results found for "{query}"</p>
            <p className="text-gray-500 mb-6">Try a different search term or browse by category</p>
            <Link
              to="/"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;


