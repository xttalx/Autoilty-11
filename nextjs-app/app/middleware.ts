import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { detectCountry, getClientIP } from '@/lib/utils/geoip';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If accessing root, check cookie first, then detect country
  if (pathname === '/') {
    try {
      const countryCookie = request.cookies.get('country')?.value;
      let countryCode = 'ca'; // Default to Canada
      
      if (countryCookie && ['ca', 'sg', 'my', 'id', 'th'].includes(countryCookie.toLowerCase())) {
        countryCode = countryCookie.toLowerCase();
      } else {
        // Try to detect country, fallback to CA on error
        try {
          const clientIP = getClientIP(request.headers);
          const detectedCountry = detectCountry(clientIP, request.headers);
          countryCode = detectedCountry.toLowerCase();
        } catch (error) {
          console.error('GeoIP detection failed, defaulting to CA:', error);
          countryCode = 'ca';
        }
      }
      
      const response = NextResponse.redirect(new URL(`/${countryCode}`, request.url));
      
      // Set country cookie if not already set
      if (!countryCookie) {
        response.cookies.set('country', countryCode, {
          maxAge: 60 * 60 * 24 * 365, // 1 year
          path: '/',
        });
      }
      
      return response;
    } catch (error) {
      // Fallback: redirect to Canada if anything fails
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/ca', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

