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
    const countryCookie = request.cookies.get('country')?.value;
    const clientIP = getClientIP(request.headers);
    const detectedCountry = countryCookie?.toUpperCase() || detectCountry(clientIP, request.headers);
    const countryCode = detectedCountry.toLowerCase();
    
    const response = NextResponse.redirect(new URL(`/${countryCode}`, request.url));
    
    // Set country cookie if not already set
    if (!countryCookie) {
      response.cookies.set('country', countryCode, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }
    
    return response;
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

