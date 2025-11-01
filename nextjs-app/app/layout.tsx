import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
// i18n will be initialized client-side in providers

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Autoilty.com - Canada\'s #1 Automotive Directory | Best Mechanics, Dealerships & Auto Services',
    template: '%s | Autoilty.com - Canada\'s #1 Automotive Directory',
  },
  description: 'Discover Canada\'s top-rated automotive businesses. Find trusted mechanics, dealerships, auto parts stores, tire centers, and more. Verified reviews, expert ratings, and community-driven scoring.',
  keywords: [
    'best mechanics in Canada',
    'top auto repair shops',
    'car dealerships Canada',
    'auto parts stores',
    'best mechanics Toronto',
    'best mechanics Vancouver',
    'best mechanics Montreal',
    'best mechanics Calgary',
    'top auto services',
    'Canadian automotive directory',
    'car forums Canada',
    'vehicle financing calculator',
    'best cars in Canada',
    'top auto parts Calgary'
  ],
  authors: [{ name: 'Autoilty Team' }],
  creator: 'Autoilty.com',
  publisher: 'Autoilty.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://autoilty.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-CA': '/en',
      'fr-CA': '/fr',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://autoilty.com',
    siteName: 'Autoilty.com',
    title: 'Autoilty.com - Canada\'s #1 Automotive Directory',
    description: 'Discover Canada\'s top-rated automotive businesses. Find trusted mechanics, dealerships, and auto services.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Autoilty.com - Canada\'s Premier Automotive Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autoilty.com - Canada\'s #1 Automotive Directory',
    description: 'Discover Canada\'s top-rated automotive businesses.',
    images: ['/og-image.jpg'],
    creator: '@autoilty',
  },
  robots: {
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Hotjar */}
        {process.env.NEXT_PUBLIC_HOTJAR_ID && (
          <Script id="hotjar" strategy="afterInteractive">
            {`
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>
        )}

        {/* Structured Data for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Autoilty.com',
              url: 'https://autoilty.com',
              logo: 'https://autoilty.com/logo.png',
              description: 'Canada\'s #1 Automotive Directory',
              sameAs: [
                'https://twitter.com/autoilty',
                'https://facebook.com/autoilty',
                'https://instagram.com/autoilty',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-XXX-XXX-XXXX',
                contactType: 'customer service',
                areaServed: 'CA',
                availableLanguage: ['en', 'fr'],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
