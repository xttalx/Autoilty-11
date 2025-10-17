import React from 'react';

const StatsSection = ({ stats }) => {
  const statItems = [
    {
      label: 'Businesses Listed',
      value: stats?.totalBusinesses?.toLocaleString() || '0',
      icon: '🏢',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Verified Businesses',
      value: stats?.verifiedBusinesses?.toLocaleString() || '0',
      icon: '✓',
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Total Reviews',
      value: stats?.totalReviews?.toLocaleString() || '0',
      icon: '⭐',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      label: 'Average Score',
      value: stats?.averageScore?.toFixed(1) || '0.0',
      icon: '📊',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform"
            >
              <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;


