import { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedListings from '@/components/home/FeaturedListings';
import BrowseByProvince from '@/components/home/BrowseByProvince';
import HowItWorks from '@/components/home/HowItWorks';
import SearchBar from '@/components/search/SearchBar';

export const metadata: Metadata = {
  title: 'Canada\'s #1 Automotive Directory - Find Best Mechanics, Dealerships & Auto Services',
  description: 'Discover Canada\'s top-rated automotive businesses. Find trusted mechanics, dealerships, auto parts stores, tire centers, and more. Expert ratings, verified reviews, and community-driven scoring.',
  keywords: [
    'best mechanics in Canada',
    'top auto repair shops',
    'car dealerships Canada',
    'auto parts stores',
    'best mechanics Toronto',
    'best mechanics Vancouver',
    'best mechanics Montreal',
    'best mechanics Calgary',
    'Canadian automotive directory',
    'car forums Canada',
    'vehicle financing calculator',
  ],
  openGraph: {
    title: 'Autoilty.com - Canada\'s #1 Automotive Directory',
    description: 'Discover Canada\'s top-rated automotive businesses. Expert ratings and verified reviews.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  // Fetch initial data server-side for SEO
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Fetch platform stats
  let stats = null;
  try {
    const statsRes = await fetch(`${apiUrl}/api/analytics/stats`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (statsRes.ok) {
      stats = await statsRes.json();
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }

  // Fetch top businesses
  let topMechanics = [];
  let topDealerships = [];
  try {
    const [mechanicsRes, dealershipsRes] = await Promise.all([
      fetch(`${apiUrl}/api/businesses/top/mechanics?limit=6`, {
        next: { revalidate: 1800 }, // Revalidate every 30 minutes
      }),
      fetch(`${apiUrl}/api/businesses/top/dealerships?limit=6`, {
        next: { revalidate: 1800 },
      }),
    ]);

    if (mechanicsRes.ok) {
      const data = await mechanicsRes.json();
      topMechanics = data.data || [];
    }
    if (dealershipsRes.ok) {
      const data = await dealershipsRes.json();
      topDealerships = data.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch top businesses:', error);
  }

  // Structured data for homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Autoilty.com',
    url: 'https://autoilty.com',
    description: 'Canada\'s #1 Automotive Directory',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://autoilty.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Autoilty.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://autoilty.com/logo.png',
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
        <SearchBar />
      </div>

      {/* Stats Section */}
      {stats?.data?.overview && (
        <StatsSection stats={stats.data.overview} />
      )}

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect automotive service for your needs
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Top Mechanics */}
      {topMechanics.length > 0 && (
        <FeaturedListings
          title="🔧 Top-Rated Mechanics"
          businesses={topMechanics}
          category="mechanics"
          categoryName="Mechanics"
        />
      )}

      {/* Top Dealerships */}
      {topDealerships.length > 0 && (
        <FeaturedListings
          title="🚗 Top-Rated Dealerships"
          businesses={topDealerships}
          category="dealerships"
          categoryName="Dealerships"
        />
      )}

      {/* Browse by Province */}
      <BrowseByProvince />

      {/* How It Works */}
      <HowItWorks />
    </>
  );
}
