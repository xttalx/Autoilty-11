'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const provinces = [
  { name: 'Ontario', code: 'ON', icon: '🏙️', slug: 'ontario' },
  { name: 'Quebec', code: 'QC', icon: '🏛️', slug: 'quebec' },
  { name: 'British Columbia', code: 'BC', icon: '🏔️', slug: 'british-columbia' },
  { name: 'Alberta', code: 'AB', icon: '🛢️', slug: 'alberta' },
  { name: 'Manitoba', code: 'MB', icon: '🌾', slug: 'manitoba' },
  { name: 'Saskatchewan', code: 'SK', icon: '🌻', slug: 'saskatchewan' },
  { name: 'Nova Scotia', code: 'NS', icon: '🌊', slug: 'nova-scotia' },
  { name: 'New Brunswick', code: 'NB', icon: '🍁', slug: 'new-brunswick' },
  { name: 'Newfoundland', code: 'NL', icon: '🐟', slug: 'newfoundland' },
  { name: 'Prince Edward Island', code: 'PE', icon: '🏖️', slug: 'prince-edward-island' },
  { name: 'Northwest Territories', code: 'NT', icon: '❄️', slug: 'northwest-territories' },
  { name: 'Nunavut', code: 'NU', icon: '🧊', slug: 'nunavut' },
  { name: 'Yukon', code: 'YT', icon: '🏔️', slug: 'yukon' },
];

export default function BrowseByProvince() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🇨🇦 Browse by Province</h2>
          <p className="text-xl text-gray-300">
            Find the best automotive services near you
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {provinces.map((province, index) => (
            <motion.div
              key={province.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/regions/${province.code.toLowerCase()}`}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors block h-full"
              >
                <div className="text-4xl mb-2">{province.icon}</div>
                <div className="font-semibold mb-1">{province.name}</div>
                <div className="text-sm text-gray-400">{province.code}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
