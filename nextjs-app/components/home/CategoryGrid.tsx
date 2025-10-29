'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Mechanics',
    slug: 'mechanics',
    icon: '🔧',
    description: 'Trusted auto repair shops and mechanics',
    color: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'Dealerships',
    slug: 'dealerships',
    icon: '🚗',
    description: 'New and used car dealerships',
    color: 'from-green-500 to-green-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'Auto Parts',
    slug: 'auto-parts',
    icon: '⚙️',
    description: 'Quality parts and accessories',
    color: 'from-yellow-500 to-yellow-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'Detailing',
    slug: 'detailing',
    icon: '✨',
    description: 'Professional car detailing services',
    color: 'from-purple-500 to-purple-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'Tire Centers',
    slug: 'tire-centers',
    icon: '🛞',
    description: 'Tire sales and services',
    color: 'from-red-500 to-red-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'EV Chargers',
    slug: 'ev-chargers',
    icon: '⚡',
    description: 'Electric vehicle charging stations',
    color: 'from-indigo-500 to-indigo-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'Body Shops',
    slug: 'body-shops',
    icon: '🔨',
    description: 'Collision repair and body work',
    color: 'from-orange-500 to-orange-600',
    gradient: 'bg-gradient-to-br',
  },
  {
    name: 'Performance',
    slug: 'performance-shops',
    icon: '🏁',
    description: 'Performance tuning and upgrades',
    color: 'from-pink-500 to-pink-600',
    gradient: 'bg-gradient-to-br',
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={`/category/${category.slug}`}
            className={`${category.gradient} ${category.color} rounded-xl p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl block h-full`}
          >
            <div className="text-5xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-4">{category.description}</p>
            <div className="flex items-center text-sm font-semibold">
              Explore <span className="ml-2 group-hover:ml-4 transition-all">→</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
