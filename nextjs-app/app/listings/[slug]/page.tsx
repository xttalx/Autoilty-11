import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEOMetadata, generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/seo';
import BusinessDetails from '@/components/listings/BusinessDetails';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getBusiness(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${apiUrl}/api/businesses/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch business:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await getBusiness(params.slug);

  if (!business) {
    return {
      title: 'Business Not Found',
      description: 'The business you are looking for could not be found.',
    };
  }

  return generateSEOMetadata({
    title: `${business.name} - ${business.location?.address?.city}, ${business.location?.address?.province} | Autoilty.com`,
    description: business.description || business.shortDescription || `${business.name} - ${business.category} in ${business.location?.address?.city}, ${business.location?.address?.province}. Rated ${business.score?.total?.toFixed(1)}/10.`,
    keywords: [
      business.name,
      `${business.category} ${business.location?.address?.city}`,
      `best ${business.category} in ${business.location?.address?.province}`,
    ],
    url: `/listings/${business.slug}`,
    type: 'website',
    image: business.images?.[0]?.url,
  });
}

export default async function BusinessPage({ params }: PageProps) {
  const business = await getBusiness(params.slug);

  if (!business) {
    notFound();
  }

  // Structured data for SEO
  const businessSchema = generateLocalBusinessSchema(business);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: business.category || 'Category', url: `/category/${business.category}` },
    { name: business.location?.address?.city || 'Location', url: `/regions/${business.location?.address?.province?.toLowerCase()}` },
    { name: business.name, url: `/listings/${business.slug}` },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <BusinessDetails business={business} />
    </>
  );
}

// Generate static params for top businesses (optional - for ISR)
export async function generateStaticParams() {
  // This is optional - can generate static pages for top businesses
  // For now, return empty array to use dynamic rendering
  return [];
}
