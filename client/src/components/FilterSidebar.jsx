import React from 'react';

const FilterSidebar = ({ filters, onChange }) => {
  const provinces = [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
  ];

  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  return (
    <div className="space-y-6">
      {/* Province */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Province
        </label>
        <select
          value={filters.province}
          onChange={(e) => onChange('province', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
        >
          <option value="">All Provinces</option>
          {provinces.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Enter city name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Minimum Score */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Minimum Score
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={filters.minScore || 0}
          onChange={(e) => onChange('minScore', e.target.value)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0</span>
          <span className="font-semibold text-red-600">
            {filters.minScore || '0'}+
          </span>
          <span>10</span>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range}
                checked={filters.priceRange === range}
                onChange={(e) => onChange('priceRange', e.target.value)}
                className="mr-2 text-red-600"
              />
              <span className="text-gray-700">{range}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="priceRange"
              value=""
              checked={!filters.priceRange}
              onChange={(e) => onChange('priceRange', '')}
              className="mr-2 text-red-600"
            />
            <span className="text-gray-700">Any</span>
          </label>
        </div>
      </div>

      {/* Verified Only */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.verified === 'true'}
            onChange={(e) => onChange('verified', e.target.checked ? 'true' : '')}
            className="mr-2 text-red-600 h-5 w-5"
          />
          <span className="text-sm font-semibold text-gray-700">
            ✓ Verified Businesses Only
          </span>
        </label>
      </div>

      {/* Canadian Features */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Canadian Excellence
        </h3>
        
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={filters.winterServices === 'true'}
            onChange={(e) => onChange('winterServices', e.target.checked ? 'true' : '')}
            className="mr-2 text-red-600 h-5 w-5"
          />
          <span className="text-sm text-gray-700">
            ❄️ Winter Services
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.evReady === 'true'}
            onChange={(e) => onChange('evReady', e.target.checked ? 'true' : '')}
            className="mr-2 text-red-600 h-5 w-5"
          />
          <span className="text-sm text-gray-700">
            ⚡ EV Certified
          </span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;


