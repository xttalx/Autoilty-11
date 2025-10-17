import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const provinces = [
    { name: 'Ontario', code: 'ON' },
    { name: 'Quebec', code: 'QC' },
    { name: 'British Columbia', code: 'BC' },
    { name: 'Alberta', code: 'AB' },
    { name: 'Manitoba', code: 'MB' },
    { name: 'Saskatchewan', code: 'SK' },
  ];

  const categories = [
    { name: 'Mechanics', slug: 'mechanics' },
    { name: 'Dealerships', slug: 'dealerships' },
    { name: 'Auto Parts', slug: 'auto-parts' },
    { name: 'Detailing', slug: 'detailing' },
    { name: 'Tire Centers', slug: 'tire-centers' },
    { name: 'EV Chargers', slug: 'ev-chargers' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🚘</span>
              Autoilty.com
            </h3>
            <p className="text-sm mb-4">
              Canada's premier directory for automotive businesses. Discover trusted mechanics, 
              dealerships, and auto services with verified reviews and community ratings.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-red-500 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-red-500 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-red-500 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="mailto:info@autoilty.com"
                 className="hover:text-red-500 transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Browse by Province */}
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Browse by Province</h4>
            <ul className="space-y-2 text-sm">
              {provinces.map((province) => (
                <li key={province.code}>
                  <Link
                    to={`/province/${province.code}`}
                    className="hover:text-red-500 transition-colors"
                  >
                    {province.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="hover:text-red-500 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/claim-business" className="hover:text-red-500 transition-colors">
                  Claim Your Business
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-red-500 transition-colors">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-red-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-red-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>
              © {currentYear} Autoilty.com. All rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              🇨🇦 Proudly Canadian | PIPEDA Compliant
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


