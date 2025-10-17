import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ProvincePage = () => {
  const { province } = useParams();

  const provinceNames = {
    'AB': 'Alberta',
    'BC': 'British Columbia',
    'MB': 'Manitoba',
    'NB': 'New Brunswick',
    'NL': 'Newfoundland and Labrador',
    'NS': 'Nova Scotia',
    'NT': 'Northwest Territories',
    'NU': 'Nunavut',
    'ON': 'Ontario',
    'PE': 'Prince Edward Island',
    'QC': 'Quebec',
    'SK': 'Saskatchewan',
    'YT': 'Yukon'
  };

  const categories = [
    { name: 'Mechanics', slug: 'mechanics', icon: '🔧' },
    { name: 'Dealerships', slug: 'dealerships', icon: '🚗' },
    { name: 'Auto Parts', slug: 'auto-parts', icon: '⚙️' },
    { name: 'Detailing', slug: 'detailing', icon: '✨' },
    { name: 'Tire Centers', slug: 'tire-centers', icon: '🛞' },
    { name: 'EV Chargers', slug: 'ev-chargers', icon: '⚡' },
    { name: 'Body Shops', slug: 'body-shops', icon: '🔨' },
    { name: 'Performance Shops', slug: 'performance-shops', icon: '🏁' }
  ];

  return (
    <>
      <Helmet>
        <title>Auto Businesses in {provinceNames[province]} | Autoilty</title>
        <meta name="description" content={`Find the best auto businesses in ${provinceNames[province]}. Mechanics, dealerships, and more.`} />
      </Helmet>

      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Auto Businesses in {provinceNames[province]}
          </h1>
          <p className="text-xl text-red-100">
            Discover trusted automotive services across {provinceNames[province]}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}?province=${province}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-center"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                in {provinceNames[province]}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProvincePage;


