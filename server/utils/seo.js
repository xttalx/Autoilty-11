/**
 * SEO Utilities for Autoilty
 * Generates schema markup, sitemaps, and meta tags
 */

const Business = require('../models/Business');

/**
 * Generate Local Business Schema Markup
 */
const generateBusinessSchema = (business) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": business.name,
    "description": business.description || `${business.name} - ${business.category}`,
    "url": `https://autoilty.com/business/${business.slug}`,
    "telephone": business.contact?.phone,
    "email": business.contact?.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.location?.address?.street,
      "addressLocality": business.location?.address?.city,
      "addressRegion": business.location?.address?.province,
      "postalCode": business.location?.address?.postalCode,
      "addressCountry": "CA"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": business.aggregateRating.average,
      "reviewCount": business.aggregateRating.count,
      "bestRating": 5,
      "worstRating": 1
    },
    "priceRange": business.priceRange || "$$"
  };

  if (business.location?.coordinates?.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": business.location.coordinates.coordinates[1],
      "longitude": business.location.coordinates.coordinates[0]
    };
  }

  if (business.hours) {
    schema.openingHoursSpecification = Object.entries(business.hours).map(([day, hours]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
      "opens": hours.closed ? null : hours.open,
      "closes": hours.closed ? null : hours.close
    }));
  }

  if (business.images && business.images.length > 0) {
    const primaryImage = business.images.find(img => img.isPrimary) || business.images[0];
    schema.image = primaryImage.url;
  }

  return schema;
};

/**
 * Generate Breadcrumb Schema
 */
const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://autoilty.com${item.url}`
    }))
  };
};

/**
 * Generate Meta Tags
 */
const generateMetaTags = (business) => {
  return {
    title: `${business.name} - ${business.location?.address?.city}, ${business.location?.address?.province} | Autoilty`,
    description: business.description || 
      `${business.name} in ${business.location?.address?.city}. Autoilty Score: ${business.score.total.toFixed(1)}/10. ` +
      `${business.aggregateRating.count} reviews with ${business.aggregateRating.average.toFixed(1)}/5 rating.`,
    keywords: [
      business.name,
      business.category,
      business.location?.address?.city,
      business.location?.address?.province,
      'auto services',
      'Canada',
      'automotive',
      'car repair',
      'trusted mechanic'
    ].filter(Boolean).join(', '),
    ogTitle: `${business.name} - Rated ${business.score.total.toFixed(1)}/10`,
    ogDescription: `Discover ${business.name}, one of the best ${business.category} in ${business.location?.address?.city}`,
    ogImage: business.images?.find(img => img.isPrimary)?.url || 'https://autoilty.com/default-og-image.jpg',
    ogUrl: `https://autoilty.com/business/${business.slug}`,
    twitterCard: 'summary_large_image'
  };
};

/**
 * Generate Sitemap XML
 */
const generateSitemap = async () => {
  const businesses = await Business.find({ status: 'active' }).select('slug updatedAt');
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  xml += '  <url>\n';
  xml += '    <loc>https://autoilty.com/</loc>\n';
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';
  
  // Categories
  const categories = ['mechanics', 'dealerships', 'auto-parts', 'detailing', 'tire-centers', 
                     'ev-chargers', 'body-shops', 'performance-shops'];
  categories.forEach(category => {
    xml += '  <url>\n';
    xml += `    <loc>https://autoilty.com/category/${category}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });
  
  // Businesses
  businesses.forEach(business => {
    xml += '  <url>\n';
    xml += `    <loc>https://autoilty.com/business/${business.slug}</loc>\n`;
    xml += `    <lastmod>${business.updatedAt.toISOString()}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
};

/**
 * Generate robots.txt
 */
const generateRobotsTxt = () => {
  return `# Autoilty.com Robots.txt

User-agent: *
Allow: /

# Sitemap
Sitemap: https://autoilty.com/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /login
Disallow: /register

# Allow search engines to index business pages
Allow: /business/
Allow: /category/
Allow: /province/
`;
};

module.exports = {
  generateBusinessSchema,
  generateBreadcrumbSchema,
  generateMetaTags,
  generateSitemap,
  generateRobotsTxt
};


