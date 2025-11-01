'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { FiStar, FiPhone, FiGlobe, FiMessageCircle } from 'react-icons/fi';
import { formatCurrency, getCountryConfig } from '@/lib/config/countries';

export interface Listing {
  id: string;
  name: string;
  slug: string;
  category: string;
  make?: string;
  model?: string;
  price?: number;
  image?: string;
  rating: number;
  reviewCount: number;
  location: {
    city: string;
    province?: string;
    country: string;
  };
  contact?: {
    phone?: string;
    website?: string;
  };
  forumThreadId?: string;
  score?: {
    total: number;
  };
}

interface DirectoryListingProps {
  listings: Listing[];
  countryCode: string;
}

export default function DirectoryListing({ listings, countryCode }: DirectoryListingProps) {
  const { t } = useTranslation();
  const config = getCountryConfig(countryCode);

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">{t('listing.noResults') || 'No listings found'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
        >
          {/* Image */}
          <div className="relative h-48 bg-gray-200">
            {listing.image ? (
              <Image
                src={listing.image}
                alt={listing.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                🚗
              </div>
            )}
            {listing.score && listing.score.total >= 8 && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                ⭐ Top Rated
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <Link href={`/listings/${listing.slug}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                {listing.name}
              </h3>
            </Link>

            {/* Make/Model */}
            {(listing.make || listing.model) && (
              <p className="text-sm text-gray-600 mb-2">
                {[listing.make, listing.model].filter(Boolean).join(' ')}
              </p>
            )}

            {/* Price */}
            {listing.price && (
              <p className="text-xl font-bold text-primary-600 mb-2">
                {formatCurrency(listing.price, countryCode)}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center text-yellow-500">
                <FiStar className="fill-current w-4 h-4" />
                <span className="ml-1 font-semibold text-gray-900 text-sm">{listing.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({listing.reviewCount} {t('listing.reviews')})
              </span>
            </div>

            {/* Location */}
            <p className="text-sm text-gray-600 mb-4 flex items-center">
              📍 {listing.location.city}
              {listing.location.province && `, ${listing.location.province}`}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/listings/${listing.slug}`}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center text-sm font-semibold"
              >
                {t('listing.viewDetails')}
              </Link>
              
              {listing.forumThreadId && (
                <Link
                  href={`/forums/${listing.forumThreadId}`}
                  className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
                  title={t('listing.forum')}
                >
                  <FiMessageCircle className="w-5 h-5" />
                </Link>
              )}
              
              {listing.contact?.phone && (
                <a
                  href={`tel:${listing.contact.phone}`}
                  className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
                  title={t('listing.call')}
                >
                  <FiPhone className="w-5 h-5" />
                </a>
              )}
              
              {listing.contact?.website && (
                <a
                  href={listing.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
                  title={t('listing.website')}
                >
                  <FiGlobe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
