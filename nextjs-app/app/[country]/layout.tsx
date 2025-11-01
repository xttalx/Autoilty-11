import { Metadata } from 'next';
import { getCountryConfig, countries } from '@/lib/config/countries';
import { detectCountry, getClientIP } from '@/lib/utils/geoip';
import { headers } from 'next/headers';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    country: string;
  };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const countryCode = params.country.toUpperCase();
  const config = getCountryConfig(countryCode);

  if (!countries[countryCode]) {
    return {};
  }

  return {
    title: {
      default: `Autoilty.com - ${config.name}'s #1 Automotive Directory`,
      template: `%s | Autoilty.com - ${config.name}`,
    },
    description: `Find trusted mechanics, dealerships, and auto services in ${config.name}. Expert ratings, verified reviews, and community-driven scoring.`,
    alternates: {
      canonical: `/${params.country}`,
      languages: {
        'en': `/${params.country}?lang=en`,
        'ms': `/${params.country}?lang=ms`,
        'id': `/${params.country}?lang=id`,
      },
    },
  };
}

export default async function CountryLayout({ children, params }: LayoutProps) {
  return <>{children}</>;
}

