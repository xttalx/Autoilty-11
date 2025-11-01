'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiPhone, FiGlobe, FiClock, FiStar, FiShare2, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BusinessDetailsProps {
  business: any;
  countryCode: string;
}

export default function BusinessDetails({ business, countryCode }: BusinessDetailsProps) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);

  const {
    name,
    category,
    description,
    location,
    contact,
    score,
    aggregateRating,
    hours,
    images,
    canadianFactors,
    priceRange,
    isPremium,
    verified,
    forumThreadId,
  } = business;

  const primaryImage = images?.[0]?.url || '/default-business.jpg';
  const scoreClass = score?.total >= 8 ? 'score-excellent' : score?.total >= 6 ? 'score-good' : score?.total >= 4 ? 'score-average' : 'score-poor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/category/${category}`} className="text-gray-500 hover:text-primary-600 capitalize">{category.replace('-', ' ')}</Link></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate">{name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        {/* Image Gallery */}
        <div className="relative h-64 md:h-96 bg-gray-200">
          <Image
            src={primaryImage}
            alt={name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {isPremium && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ Premium
              </span>
            )}
            {verified && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
              <FiShare2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-full shadow-md hover:shadow-lg transition-shadow ${
                saved ? 'bg-primary-600 text-white' : 'bg-white'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center">
                  <FiMapPin className="mr-1" />
                  {location?.address?.city}, {location?.address?.province}
                </span>
                <span className="text-gray-400">•</span>
                <span className="capitalize">{category.replace('-', ' ')}</span>
                <span className="text-gray-400">•</span>
                <span>{priceRange || '$$'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Score Display */}
              <div className={`score-display ${scoreClass}`}>
                {score?.total?.toFixed(1) || '0.0'}
              </div>
              {/* Rating */}
              <div className="text-center">
                <div className="flex items-center text-yellow-500 mb-1">
                  <FiStar className="fill-current" />
                  <span className="ml-1 font-semibold text-gray-900">
                    {aggregateRating?.average?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  ({aggregateRating?.count || 0} reviews)
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <FiPhone />
                {t('listing.call')}
              </a>
            )}
            {contact?.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <FiGlobe />
                {t('listing.website')}
              </a>
            )}
            {forumThreadId && (
              <Link
                href={`/forums/${forumThreadId}`}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <FiMessageCircle />
                {t('listing.forum')}
              </Link>
            )}
            <a
              href={`https://maps.google.com/?q=${location?.address?.street}, ${location?.address?.city}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <FiMapPin />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {description && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Autoilty Score Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Reviews (40%)</span>
                <span className="font-bold">{score?.reviews?.toFixed(1) || '0.0'}/4.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Community (30%)</span>
                <span className="font-bold">{score?.community?.toFixed(1) || '0.0'}/3.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Social Signals (20%)</span>
                <span className="font-bold">{score?.socialSignals?.toFixed(1) || '0.0'}/2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Local Factors (10%)</span>
                <span className="font-bold">{score?.canadianFactors?.toFixed(1) || '0.0'}/1.0</span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <p className="text-gray-600">Reviews will be displayed here...</p>
            {/* Review component to be added */}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Hours */}
          {hours && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FiClock className="mr-2" />
                Hours
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(hours).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}</span>
                    <span className="text-gray-600">
                      {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {location?.coordinates && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <div className="h-48 bg-gray-200 rounded-lg">
                {/* Google Maps embed */}
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location.coordinates[1]},${location.coordinates[0]}`}
                ></iframe>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {location.address?.street}, {location.address?.city}, {location.address?.province}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
