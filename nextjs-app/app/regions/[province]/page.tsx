import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import ProvinceListings from '@/components/regions/ProvinceListings';
import FilterSidebar from '@/components/listings/FilterSidebar';

interface PageProps {
  params: {
    province: string;
  };
  searchParams: {
    category?: string;
    city?: string;
    minScore?: string;
  };
}

const provinceNames: Record<string, string> = {
  on: 'Ontario',
  qc: 'Quebec',
  bc: 'British Columbia',
  ab: 'Alberta',
  mb: 'Manitoba',
  sk: 'Saskatchewan',
  ns: 'Nova Scotia',
  nb: 'New Brunswick',
  nl: 'Newfoundland',
  pe: 'Prince Edward Island',
  nt: 'Northwest Territories',
  nu: 'Nunavut',
  yt: 'Yukon',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const provinceCode = params.province.toUpperCase();
  const provinceName = provinceNames[params.province.toLowerCase()] || params.province;

  return generateSEOMetadata({
    title: `Best Automotive Services in ${provinceName} (${provinceCode}) | Autoilty.com`,
    description: `Find the best mechanics, dealerships, auto parts stores, and automotive services in ${provinceName}. Expert ratings, verified reviews, and community-driven scoring.`,
    keywords: [
      `best mechanics in ${provinceName}`,
      `top auto repair shops ${provinceCode}`,
      `car dealerships ${provinceName}`,
      `auto parts stores ${provinceCode}`,
      `automotive services ${provinceName}`,
    ],
    url: `/regions/${params.province}`,
  });
}

async function getProvinceBusinesses(
  province: string,
  category?: string,
  city?: string,
  minScore?: string
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const params = new URLSearchParams({
    province: province.toUpperCase(),
    status: 'active',
    limit: '50',
  });
  if (category) params.set('category', category);
  if (city) params.set('city', city);
  if (minScore) params.set('minScore', minScore);

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
    console.error('Failed to fetch businesses:', error);
    return [];
  }
}

export default async function ProvincePage({ params, searchParams }: PageProps) {
  const provinceCode = params.province.toUpperCase();
  const provinceName = provinceNames[params.province.toLowerCase()];

  if (!provinceName) {
    notFound();
  }

  const businesses = await getProvinceBusinesses(
    provinceCode,
    searchParams.category,
    searchParams.city,
    searchParams.minScore
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Regions', url: '/regions' },
    { name: provinceName, url: `/regions/${params.province}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProvinceListings
        province={provinceName}
        provinceCode={provinceCode}
        businesses={businesses}
        filters={searchParams}
      />
    </>
  );
}
