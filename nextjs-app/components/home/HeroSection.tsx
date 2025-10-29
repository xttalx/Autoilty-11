'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Canada's #1
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              Automotive Directory
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Find trusted mechanics, dealerships, auto parts stores, and more.
            <br />
            Expert ratings, verified reviews, and community-driven scoring.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/regions"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore by Region
            </Link>
            <Link
              href="/tools/financing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Financing Calculator
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-primary-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span>10-Point Expert Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇨🇦</span>
              <span>Canadian Focused</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-white">
          <path d="M0,0 C300,60 900,60 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
