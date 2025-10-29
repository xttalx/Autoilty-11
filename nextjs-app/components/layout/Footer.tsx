import Link from 'next/link';
import { FiMail, FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/press', label: 'Press' },
      { href: '/careers', label: 'Careers' },
    ],
    resources: [
      { href: '/blog', label: 'Blog' },
      { href: '/guides', label: 'Guides' },
      { href: '/tools', label: 'Tools' },
      { href: '/faq', label: 'FAQ' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
      { href: '/accessibility', label: 'Accessibility' },
    ],
    forBusiness: [
      { href: '/business/claim', label: 'Claim Your Business' },
      { href: '/business/premium', label: 'Premium Listings' },
      { href: '/business/advertise', label: 'Advertise' },
      { href: '/business/api', label: 'API Access' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold text-white">
                🚗 Autoilty
              </div>
            </Link>
            <p className="text-sm mb-4">
              Canada's #1 Automotive Directory. Find trusted mechanics, dealerships, and auto services.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/autoilty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/autoilty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/autoilty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Business</h3>
            <ul className="space-y-2">
              {footerLinks.forBusiness.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Autoilty.com. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href="mailto:info@autoilty.com"
                className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center"
              >
                <FiMail className="w-4 h-4 mr-2" />
                info@autoilty.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Autoilty.com',
            url: 'https://autoilty.com',
            logo: 'https://autoilty.com/logo.png',
            sameAs: [
              'https://twitter.com/autoilty',
              'https://facebook.com/autoilty',
              'https://instagram.com/autoilty',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'info@autoilty.com',
              contactType: 'customer service',
            },
          }),
        }}
      />
    </footer>
  );
}
