'use client';

import Link from 'next/link';
import BusinessCard from '@/components/listings/BusinessCard';

interface FeaturedListingsProps {
  title: string;
  businesses: any[];
  category: string;
  categoryName: string;
}

export default function FeaturedListings({
  title,
  businesses,
  category,
  categoryName,
}: FeaturedListingsProps) {
  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <Link
            href={`/category/${category}`}
            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2"
          >
            See All {categoryName} <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.slice(0, 6).map((business) => (
            <BusinessCard key={business._id || business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
}
