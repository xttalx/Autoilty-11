'use client';

interface StatsProps {
  totalBusinesses?: number;
  totalMembers?: number;
  totalReviews?: number;
  avgRating?: number;
}

export default function StatsSection({ stats }: { stats?: StatsProps }) {
  // Default values for placeholder
  const displayStats = {
    totalBusinesses: stats?.totalBusinesses ?? 0,
    totalMembers: stats?.totalMembers ?? 50000,
    totalReviews: stats?.totalReviews ?? 0,
    avgRating: stats?.avgRating ?? 4.5,
  };

  const statItems = [
    {
      label: 'Listed Businesses',
      value: displayStats.totalBusinesses.toLocaleString('en-CA'),
      icon: '🏢',
      color: 'text-blue-600',
    },
    {
      label: 'Community Members',
      value: displayStats.totalMembers.toLocaleString('en-CA'),
      icon: '👥',
      color: 'text-green-600',
    },
    {
      label: 'Verified Reviews',
      value: displayStats.totalReviews.toLocaleString('en-CA'),
      icon: '⭐',
      color: 'text-yellow-600',
    },
    {
      label: 'Average Rating',
      value: displayStats.avgRating.toFixed(1),
      icon: '📊',
      color: 'text-purple-600',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
