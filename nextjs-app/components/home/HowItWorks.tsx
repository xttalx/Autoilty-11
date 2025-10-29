'use client';

import { FiSearch, FiStar, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const steps = [
  {
    icon: FiSearch,
    title: 'Search',
    description: 'Browse by category, location, or search for specific services using our powerful search engine.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: FiStar,
    title: 'Compare',
    description: 'View our 10-point Autoilty score, verified reviews, expert ratings, and community feedback.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: FiTrendingUp,
    title: 'Analyze',
    description: 'Check ratings breakdown, Canadian-specific factors (winter services, EV charging, bilingual), and pricing.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: FiCheckCircle,
    title: 'Connect',
    description: 'Contact trusted businesses directly, book appointments, or get directions with one click.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How Autoilty Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the best automotive services in Canada in four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className={`${step.bgColor} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Verified Businesses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-gray-600">Community Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">100K+</div>
            <div className="text-gray-600">Monthly Searches</div>
          </div>
        </div>
      </div>
    </section>
  );
}
