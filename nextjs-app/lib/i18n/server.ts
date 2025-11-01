import { getServerSession } from 'next-auth';
import { detectCountry, getClientIP } from '@/lib/utils/geoip';
import { headers } from 'next/headers';

/**
 * Get user's country on the server side
 */
export async function getServerCountry(): Promise<string> {
  const headersList = await headers();
  const clientIP = getClientIP(headersList);
  return detectCountry(clientIP, headersList);
}

/**
 * Get user's preferred language from headers or country
 */
export async function getServerLanguage(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  
  // Detect from Accept-Language header
  if (acceptLanguage) {
    if (acceptLanguage.includes('ms')) return 'ms';
    if (acceptLanguage.includes('id')) return 'id';
    if (acceptLanguage.includes('th')) return 'th';
  }
  
  // Default to English
  return 'en';
}

