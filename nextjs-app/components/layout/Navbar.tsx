'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiSettings, FiGlobe } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { getCountryConfig } from '@/lib/config/countries';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/regions', label: 'Regions' },
    { href: '/brands', label: 'Brands' },
    { href: '/tools', label: 'Tools' },
    { href: '/blog', label: 'Blog' },
    { href: '/forum', label: 'Forum' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              🚗 Autoilty
            </div>
            <span className="hidden sm:inline text-sm text-gray-600 font-medium">
              Canada's #1 Auto Directory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Country Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <FiGlobe className="w-5 h-5" />
                <span className="hidden sm:inline">Country</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link href="/ca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  🇨🇦 Canada
                </Link>
                <Link href="/sg" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  🇸🇬 Singapore
                </Link>
                <Link href="/my" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  🇲🇾 Malaysia
                </Link>
                <Link href="/id" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  🇮🇩 Indonesia
                </Link>
                <Link href="/th" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  🇹🇭 Thailand
                </Link>
              </div>
            </div>

            {/* Search Button */}
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {session.user?.name || 'Account'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiSettings className="inline mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile/saved"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Saved Listings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="inline mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4">
          <div className="px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
