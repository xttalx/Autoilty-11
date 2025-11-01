import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { detectCountry, getClientIP } from '@/lib/utils/geoip';
import { headers } from 'next/headers';

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
  // Detect country and redirect to country-specific page
  try {
    const headersList = await headers();
    let countryCode = 'ca'; // Default to Canada
    
    try {
      const clientIP = getClientIP(headersList);
      countryCode = detectCountry(clientIP, headersList).toLowerCase();
      
      // Validate country code
      if (!['ca', 'sg', 'my', 'id', 'th'].includes(countryCode)) {
        countryCode = 'ca';
      }
    } catch (error) {
      console.error('GeoIP detection failed:', error);
      countryCode = 'ca';
    }
    
    redirect(`/${countryCode}`);
  } catch (error) {
    // Ultimate fallback
    redirect('/ca');
  }
}
