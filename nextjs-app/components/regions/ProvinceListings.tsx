'use client';

import Link from 'next/link';
import BusinessCard from '@/components/listings/BusinessCard';

interface ProvinceListingsProps {
  province: string;
  provinceCode: string;
  businesses: any[];
  filters: {
    category?: string;
    city?: string;
    minScore?: string;
  };
}

export default function ProvinceListings({
  province,
  provinceCode,
  businesses,
  filters,
}: ProvinceListingsProps) {
  // Get unique cities from businesses
  const cities = Array.from(
    new Set(
      businesses
        .map((b) => b.location?.address?.city)
        .filter((city) => city)
    )
  ).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary-600">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/regions" className="text-gray-500 hover:text-primary-600">
                Regions
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{province}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Best Automotive Services in {province}
        </h1>
        <p className="text-lg text-gray-600">
          Discover {businesses.length} trusted businesses across {province}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              defaultValue={filters.category || ''}
              onChange={(e) => {
                const params = new URLSearchParams();
                if (e.target.value) params.set('category', e.target.value);
                if (filters.city) params.set('city', filters.city);
                if (filters.minScore) params.set('minScore', filters.minScore);
                window.location.href = `/regions/${provinceCode.toLowerCase()}?${params.toString()}`;
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Categories</option>
              <option value="mechanics">Mechanics</option>
              <option value="dealerships">Dealerships</option>
              <option value="auto-parts">Auto Parts</option>
              <option value="detailing">Detailing</option>
              <option value="tire-centers">Tire Centers</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              defaultValue={filters.city || ''}
              onChange={(e) => {
                const params = new URLSearchParams();
                if (filters.category) params.set('category', filters.category);
                if (e.target.value) params.set('city', e.target.value);
                if (filters.minScore) params.set('minScore', filters.minScore);
                window.location.href = `/regions/${provinceCode.toLowerCase()}?${params.toString()}`;
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Score
            </label>
            <select
              defaultValue={filters.minScore || ''}
              onChange={(e) => {
                const params = new URLSearchParams();
                if (filters.category) params.set('category', filters.category);
                if (filters.city) params.set('city', filters.city);
                if (e.target.value) params.set('minScore', e.target.value);
                window.location.href = `/regions/${provinceCode.toLowerCase()}?${params.toString()}`;
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Any Score</option>
              <option value="8">8.0+ (Excellent)</option>
              <option value="6">6.0+ (Good)</option>
              <option value="4">4.0+ (Average)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business._id || business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-600 mb-4">
            No businesses found matching your criteria.
          </p>
          <Link
            href={`/regions/${provinceCode.toLowerCase()}`}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Clear filters and view all businesses
          </Link>
        </div>
      )}
    </div>
  );
}
