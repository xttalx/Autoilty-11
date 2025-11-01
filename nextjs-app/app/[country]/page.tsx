import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCountryConfig, countries, formatCurrency } from '@/lib/config/countries';
import { detectCountry, getClientIP } from '@/lib/utils/geoip';
import { generateSEOMetadata } from '@/lib/seo';
import DirectoryListing, { Listing } from '@/components/listings/DirectoryListing';
import SearchFiltersWrapper from '@/components/search/SearchFiltersWrapper';
import { SearchFilters as SearchFiltersType } from '@/components/search/SearchFilters';
import HeroSection from '@/components/home/HeroSection';
import { headers } from 'next/headers';

interface PageProps {
  params: {
    country: string;
  };
  searchParams: {
    make?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    city?: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(countries).map((code) => ({
    country: code.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const countryCode = params.country.toUpperCase();
  const config = getCountryConfig(countryCode);

  if (!countries[countryCode]) {
    return {
      title: 'Country Not Found',
    };
  }

  return generateSEOMetadata({
    title: `Autoilty.com - ${config.name}'s #1 Automotive Directory`,
    description: `Find trusted mechanics, dealerships, and auto services in ${config.name}. Expert ratings, verified reviews, and community-driven scoring.`,
    keywords: [
      `best mechanics in ${config.name}`,
      `car dealerships ${config.name}`,
      `auto parts ${config.name}`,
    ],
    url: `/${params.country}`,
  });
}

async function getListings(
  countryCode: string,
  filters: {
    make?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    city?: string;
  }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const params = new URLSearchParams({
    country: countryCode,
    status: 'active',
    limit: '24',
  });

  if (filters.make) params.set('make', filters.make);
  if (filters.category) params.set('category', filters.category);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.minRating) params.set('minRating', filters.minRating);
  if (filters.city) params.set('city', filters.city);

  try {
    const response = await fetch(`${apiUrl}/api/businesses?${params.toString()}`, {
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
}

async function getFeaturedDeals(countryCode: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${apiUrl}/api/businesses/featured?country=${countryCode}&limit=5`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch featured deals:', error);
    return [];
  }
}

export default async function CountryHomePage({ params, searchParams }: PageProps) {
  const headersList = await headers();
  const clientIP = getClientIP(headersList);
  const detectedCountry = detectCountry(clientIP, headersList);
  
  // Use country from URL, or detected country, or default to CA
  const countryCode = params.country
    ? params.country.toUpperCase()
    : detectedCountry;
  
  const config = getCountryConfig(countryCode);

  if (!countries[countryCode]) {
    notFound();
  }

  const filters = {
    make: searchParams.make,
    category: searchParams.category,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    minRating: searchParams.minRating,
    city: searchParams.city,
    country: countryCode,
  };

  const [listingsData, featuredDealsData] = await Promise.all([
    getListings(countryCode, filters),
    getFeaturedDeals(countryCode),
  ]);

  // Transform data to Listing format
  const listings: Listing[] = listingsData.map((item: any) => ({
    id: item._id || item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    make: item.make,
    model: item.model,
    price: item.price,
    image: item.images?.[0]?.url,
    rating: item.aggregateRating?.average || 0,
    reviewCount: item.aggregateRating?.count || 0,
    location: {
      city: item.location?.address?.city || '',
      province: item.location?.address?.province,
      country: countryCode,
    },
    contact: item.contact,
    forumThreadId: item.forumThreadId,
    score: item.score,
  }));

  const featuredDeals: Listing[] = featuredDealsData.map((item: any) => ({
    id: item._id || item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    price: item.price,
    image: item.images?.[0]?.url,
    rating: item.aggregateRating?.average || 0,
    reviewCount: item.aggregateRating?.count || 0,
    location: {
      city: item.location?.address?.city || '',
      country: countryCode,
    },
  }));

  // Structured data for listings
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listings.map((listing: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: listing.name,
        description: listing.description,
        image: listing.image,
        offers: listing.price ? {
          '@type': 'Offer',
          price: listing.price,
          priceCurrency: config.currency,
        } : undefined,
        aggregateRating: listing.rating ? {
          '@type': 'AggregateRating',
          ratingValue: listing.rating,
          reviewCount: listing.reviewCount,
        } : undefined,
      },
    })),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <HeroSection countryCode={countryCode} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SearchFiltersWrapper countryCode={countryCode} filters={filters} />
            </div>
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {/* Featured Deals Carousel */}
            {featuredDeals.length > 0 && (
              <div className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🔥 Featured Deals
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4">
                    {featuredDeals.map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/listings/${deal.slug}`}
                        className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="relative h-32 bg-gray-200">
                          {deal.image ? (
                            <img
                              src={deal.image}
                              alt={deal.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                              🚗
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{deal.name}</h3>
                          {deal.price && (
                            <p className="text-lg font-bold text-primary-600">
                              {formatCurrency(deal.price, countryCode)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {listings.length} {listings.length === 1 ? 'Listing' : 'Listings'} Found
              </h2>
            </div>

            {/* Listings Grid */}
            <DirectoryListing listings={listings} countryCode={countryCode} />
          </div>
        </div>
      </div>
    </>
  );
}


