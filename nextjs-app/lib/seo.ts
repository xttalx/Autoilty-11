import { Metadata } from 'next';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  canonical?: string;
}

/**
 * Generate comprehensive SEO metadata for Next.js
 * Optimized for automotive directory searches in Canada
 */
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url,
  type = 'website',
  noindex = false,
  canonical,
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoilty.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Default keywords for automotive directory
  const defaultKeywords = [
    'best mechanics in Canada',
    'top auto repair shops',
    'car dealerships Canada',
    'auto parts stores',
    'Canadian automotive directory',
  ];

  const finalKeywords = [...defaultKeywords, ...keywords];

  return {
    title: {
      default: title,
      template: '%s | Autoilty.com',
    },
    description,
    keywords: finalKeywords,
    authors: [{ name: 'Autoilty Team' }],
    creator: 'Autoilty.com',
    publisher: 'Autoilty.com',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonical || url || '/',
      languages: {
        'en-CA': '/en',
        'fr-CA': '/fr',
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: fullUrl,
      siteName: 'Autoilty.com',
      images: [
        {
          url: image.startsWith('http') ? image : `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_CA',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${siteUrl}${image}`],
      creator: '@autoilty',
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Generate LocalBusiness schema markup for businesses
 */
export function generateLocalBusinessSchema(business: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoilty.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/listings/${business.slug}`,
    name: business.name,
    description: business.description || business.shortDescription,
    image: business.images?.[0]?.url || `${siteUrl}/default-business.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.location?.address?.street,
      addressLocality: business.location?.address?.city,
      addressRegion: business.location?.address?.province,
      postalCode: business.location?.address?.postalCode,
      addressCountry: 'CA',
    },
    geo: business.location?.coordinates && {
      '@type': 'GeoCoordinates',
      latitude: business.location.coordinates[1],
      longitude: business.location.coordinates[0],
    },
    telephone: business.contact?.phone,
    url: business.contact?.website || `${siteUrl}/listings/${business.slug}`,
    priceRange: business.priceRange || '$$',
    openingHoursSpecification: business.hours ? Object.entries(business.hours)
      .filter(([_, day]: any) => !day.closed)
      .map(([day, hours]: any) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens: hours.open,
        closes: hours.close,
      })) : undefined,
    aggregateRating: business.aggregateRating?.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: business.aggregateRating.average,
      reviewCount: business.aggregateRating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: business.reviews?.slice(0, 3).map((review: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author || 'Anonymous',
      },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema markup
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoilty.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate FAQ schema markup
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
