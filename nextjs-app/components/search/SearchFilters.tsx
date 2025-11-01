'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getCountryConfig } from '@/lib/config/countries';

export interface SearchFilters {
  make?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  country?: string;
}

interface SearchFiltersProps {
  countryCode: string;
  filters: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
}

export default function SearchFilters({
  countryCode,
  filters: initialFilters,
  onFiltersChange,
}: SearchFiltersProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = getCountryConfig(countryCode);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);

    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && k !== 'country') {
        params.set(k, String(v));
      }
    });

    router.push(`/${countryCode.toLowerCase()}?${params.toString()}`);

    // Call callback if provided
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

      {/* Make Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filter.make')}
        </label>
        <select
          value={filters.make || ''}
          onChange={(e) => handleFilterChange('make', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="">All Makes</option>
          {config.makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filter.category')}
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="">All Categories</option>
          {config.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="No limit"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filter.rating')}
        </label>
        <select
          value={filters.minRating || ''}
          onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ ⭐⭐⭐⭐⭐</option>
          <option value="4.0">4.0+ ⭐⭐⭐⭐</option>
          <option value="3.5">3.5+ ⭐⭐⭐</option>
          <option value="3.0">3.0+ ⭐⭐⭐</option>
        </select>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="">All Cities</option>
          {config.popularCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const cleared = { country: countryCode };
          setFilters(cleared);
          router.push(`/${countryCode.toLowerCase()}`);
          if (onFiltersChange) {
            onFiltersChange(cleared);
          }
        }}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}
