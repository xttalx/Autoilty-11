'use client';

import { Suspense } from 'react';
import SearchFilters, { SearchFilters as SearchFiltersType } from './SearchFilters';

interface SearchFiltersWrapperProps {
  countryCode: string;
  filters: SearchFiltersType;
}

function SearchFiltersContent({ countryCode, filters }: SearchFiltersWrapperProps) {
  return <SearchFilters countryCode={countryCode} filters={filters} />;
}

export default function SearchFiltersWrapper({ countryCode, filters }: SearchFiltersWrapperProps) {
  return (
    <Suspense fallback={<div className="bg-white rounded-lg shadow-md p-6">Loading filters...</div>}>
      <SearchFiltersContent countryCode={countryCode} filters={filters} />
    </Suspense>
  );
}
