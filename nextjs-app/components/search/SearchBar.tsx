'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin } from 'react-icons/fi';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-xl shadow-xl p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for mechanics, dealerships, parts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:w-64 relative">
          <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="City or Province"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
}
