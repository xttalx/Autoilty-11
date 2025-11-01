import { getCountryConfig } from '@/lib/config/countries';
import geoip from 'geoip-lite';

export interface GeoLocation {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
}

/**
 * Detect user's country from IP address (server-side)
 * Falls back to headers or default country
 */
export function detectCountry(ip?: string, headers?: Headers): string {
  // Try geoip detection first
  if (ip) {
    try {
      const geo = geoip.lookup(ip);
      if (geo && geo.country) {
        // Map common country codes to supported countries
        const countryMap: Record<string, string> = {
          CA: 'CA',
          SG: 'SG',
          MY: 'MY',
          ID: 'ID',
          TH: 'TH',
        };
        return countryMap[geo.country] || 'CA';
      }
    } catch (error) {
      console.error('GeoIP detection failed:', error);
    }
  }

  // Fallback to headers (CF-IPCountry for Cloudflare, etc.)
  if (headers) {
    const cfCountry = headers.get('cf-ipcountry');
    if (cfCountry && ['CA', 'SG', 'MY', 'ID', 'TH'].includes(cfCountry)) {
      return cfCountry;
    }

    const acceptLanguage = headers.get('accept-language');
    if (acceptLanguage) {
      // Try to detect from language preference
      if (acceptLanguage.includes('ms')) return 'MY';
      if (acceptLanguage.includes('id')) return 'ID';
      if (acceptLanguage.includes('th')) return 'TH';
    }
  }

  // Default to Canada
  return 'CA';
}

/**
 * Get user's IP address from request headers
 */
export function getClientIP(headers?: Headers): string | undefined {
  if (!headers) return undefined;

  // Check various headers (Cloudflare, AWS, etc.)
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) return xRealIP;

  return undefined;
}

/**
 * Get full geo location info
 */
export function getGeoLocation(ip?: string, headers?: Headers): GeoLocation {
  const countryCode = detectCountry(ip, headers);
  const config = getCountryConfig(countryCode);

  let geo: GeoLocation = {
    country: config.name,
    countryCode,
    region: '',
    city: '',
    timezone: '',
  };

  if (ip) {
    try {
      const geoData = geoip.lookup(ip);
      if (geoData) {
        geo.region = geoData.region || '';
        geo.city = geoData.city || '';
        geo.timezone = geoData.timezone || '';
      }
    } catch (error) {
      console.error('GeoIP lookup failed:', error);
    }
  }

  return geo;
}

