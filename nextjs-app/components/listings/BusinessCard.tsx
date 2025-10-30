'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar, FiPhone, FiExternalLink } from 'react-icons/fi';

interface BusinessCardProps {
  business: any;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const {
    name,
    slug,
    category,
    location,
    score,
    aggregateRating,
    contact,
    verified,
    isPremium,
    priceRange,
    images,
    canadianFactors,
  } = business;

  const primaryImage = images?.[0]?.url || '/default-business.jpg';

  const categoryIcons: Record<string, string> = {
    mechanics: '🔧',
    dealerships: '🚗',
    'auto-parts': '⚙️',
    detailing: '✨',
    'tire-centers': '🛞',
    'ev-chargers': '⚡',
    'body-shops': '🔨',
    'performance-shops': '🏁',
    'oil-change': '🛢️',
    'glass-repair': '🪟',
    'rust-proofing': '🛡️',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={primaryImage}
          alt={name}
          fill
          className="object-cover"
        />
        {isPremium && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ⭐ Premium
          </div>
        )}
        {verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center mb-2">
          <span className="text-xl mr-2">{categoryIcons[category] || '🚗'}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            {category?.replace('-', ' ')}
          </span>
        </div>

        {/* Business Name */}
        <Link href={`/listings/${slug}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Score */}
        <div className="flex items-center mb-3">
          <div className="bg-primary-600 text-white px-3 py-1 rounded-md font-bold text-lg">
            {score?.total?.toFixed(1) || '0.0'}
          </div>
          <div className="ml-3">
            <div className="flex items-center text-yellow-500">
              <FiStar className="fill-current" />
              <span className="ml-1 font-semibold text-gray-900">
                {aggregateRating?.average?.toFixed(1) || 'N/A'}
              </span>
              <span className="ml-1 text-gray-500 text-sm">
                ({aggregateRating?.count || 0})
              </span>
            </div>
            <div className="text-xs text-gray-500">{priceRange || '$$'}</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start text-gray-600 text-sm mb-3">
          <FiMapPin className="mt-1 mr-2 flex-shrink-0" />
          <span className="line-clamp-2">
            {location?.address?.city}, {location?.address?.province}
          </span>
        </div>

        {/* Canadian Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {canadianFactors?.winterServices && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              ❄️ Winter Ready
            </span>
          )}
          {canadianFactors?.evReadiness?.evCertified && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              ⚡ EV Certified
            </span>
          )}
          {canadianFactors?.bilingualService?.french && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              🇫🇷 Bilingual
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href={`/listings/${slug}`}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center text-sm font-semibold"
          >
            View Details
          </Link>
          {contact?.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
              title="Call"
            >
              <FiPhone />
            </a>
          )}
          {contact?.website && (
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
              title="Website"
            >
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
