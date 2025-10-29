import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoilty.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/regions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/financing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/value-estimator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic pages - provinces
  const provinces = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'NU', 'YT'];
  const provincePages: MetadataRoute.Sitemap = provinces.map((province) => ({
    url: `${baseUrl}/regions/${province.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Dynamic pages - categories
  const categories = [
    'mechanics',
    'dealerships',
    'auto-parts',
    'detailing',
    'tire-centers',
    'ev-chargers',
    'body-shops',
    'performance-shops',
  ];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Dynamic pages - businesses/listings
  let businessPages: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${apiUrl}/api/businesses?limit=10000&status=active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        businessPages = data.data.map((business: any) => ({
          url: `${baseUrl}/listings/${business.slug}`,
          lastModified: business.updatedAt ? new Date(business.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: business.isPremium ? 0.9 : 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Failed to fetch businesses for sitemap:', error);
  }

  return [...staticPages, ...provincePages, ...categoryPages, ...businessPages];
}
