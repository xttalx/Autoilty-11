import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiMapPin, FiPhone, FiGlobe, FiClock, FiDollarSign, FiThumbsUp, FiThumbsDown, FiShare2, FiBookmark } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'leaflet/dist/leaflet.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BusinessProfile = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business data
  const { data: businessData, isLoading, error } = useQuery(
    ['business', slug],
    async () => {
      const response = await axios.get(`${API_URL}/api/businesses/${slug}`);
      return response.data.data;
    }
  );

  // Vote mutation
  const voteMutation = useMutation(
    async ({ businessId, voteType }) => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to vote');
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/businesses/${businessId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    }
  );

  // Track clicks
  const trackClick = async (type) => {
    try {
      await axios.post(`${API_URL}/api/businesses/${businessData._id}/click/${type}`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-4">Business not found</p>
          <Link to="/" className="text-red-600 hover:text-red-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const business = businessData;
  const coordinates = business.location?.coordinates?.coordinates;

  // Score breakdown chart data
  const scoreChartData = {
    labels: ['Reviews', 'Community', 'Social Signals', 'Canadian Factors'],
    datasets: [{
      data: [
        business.score.reviews,
        business.score.community,
        business.score.socialSignals,
        business.score.canadianFactors
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(251, 146, 60)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 2
    }]
  };

  // Rating distribution chart
  const ratingDistribution = business.aggregateRating?.distribution || {};
  const ratingChartData = {
    labels: ['5⭐', '4⭐', '3⭐', '2⭐', '1⭐'],
    datasets: [{
      label: 'Number of Reviews',
      data: [
        ratingDistribution.five || 0,
        ratingDistribution.four || 0,
        ratingDistribution.three || 0,
        ratingDistribution.two || 0,
        ratingDistribution.one || 0
      ],
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1
    }]
  };

  return (
    <>
      <Helmet>
        <title>{business.name} - {business.location?.address?.city}, {business.location?.address?.province} | Autoilty</title>
        <meta name="description" content={business.description || `${business.name} in ${business.location?.address?.city}. Score: ${business.score.total}/10. ${business.aggregateRating.count} reviews.`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutomotiveBusiness",
            "name": business.name,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": business.location?.address?.street,
              "addressLocality": business.location?.address?.city,
              "addressRegion": business.location?.address?.province,
              "postalCode": business.location?.address?.postalCode,
              "addressCountry": "CA"
            },
            "telephone": business.contact?.phone,
            "url": business.contact?.website,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": business.aggregateRating.average,
              "reviewCount": business.aggregateRating.count
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {business.verified && (
                  <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </span>
                )}
                {business.isPremium && (
                  <span className="bg-yellow-500 px-3 py-1 rounded-full text-xs font-semibold">
                    ⭐ Premium
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{business.name}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <span className="flex items-center">
                  <FiMapPin className="mr-1" />
                  {business.location?.address?.city}, {business.location?.address?.province}
                </span>
                <span className="text-xl">
                  {business.priceRange}
                </span>
              </div>
            </div>

            {/* Score Badge */}
            <div className="mt-4 md:mt-0 bg-white text-gray-900 rounded-lg p-6 text-center shadow-xl">
              <div className="text-5xl font-bold text-red-600 mb-1">
                {business.score.total.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 font-semibold">Autoilty Score</div>
              <div className="flex items-center justify-center mt-2 text-yellow-500">
                <span className="text-lg mr-1">⭐</span>
                <span className="font-semibold">{business.aggregateRating.average.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({business.aggregateRating.count})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4 space-y-4 md:space-y-0">
            {/* Contact Actions */}
            <div className="flex flex-wrap gap-3">
              {business.contact?.phone && (
                <a
                  href={`tel:${business.contact.phone}`}
                  onClick={() => trackClick('phone')}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <FiPhone />
                  <span>Call Now</span>
                </a>
              )}
              {business.contact?.website && (
                <a
                  href={business.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('website')}
                  className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  <FiGlobe />
                  <span>Website</span>
                </a>
              )}
              {business.contact?.bookingUrl && (
                <a
                  href={business.contact.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('booking')}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <FiClock />
                  <span>Book Now</span>
                </a>
              )}
              {coordinates && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('directions')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <FiMapPin />
                  <span>Directions</span>
                </a>
              )}
            </div>

            {/* User Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => voteMutation.mutate({ businessId: business._id, voteType: 'upvote' })}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Upvote"
              >
                <FiThumbsUp />
                <span>{business.communityData?.userVotes?.upvotes || 0}</span>
              </button>
              <button
                onClick={() => voteMutation.mutate({ businessId: business._id, voteType: 'downvote' })}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Downvote"
              >
                <FiThumbsDown />
                <span>{business.communityData?.userVotes?.downvotes || 0}</span>
              </button>
              <button
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Bookmark"
              >
                <FiBookmark />
              </button>
              <button
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Share"
              >
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {['overview', 'reviews', 'photos', 'discussions'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 font-semibold capitalize transition-colors border-b-2 ${
                        activeTab === tab
                          ? 'border-red-600 text-red-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Description */}
                    {business.description && (
                      <div>
                        <h3 className="text-xl font-bold mb-3">About</h3>
                        <p className="text-gray-700">{business.description}</p>
                      </div>
                    )}

                    {/* Canadian Factors */}
                    <div>
                      <h3 className="text-xl font-bold mb-3">Canadian Excellence</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {business.canadianFactors?.winterServices && (
                          <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded">
                            <span className="text-2xl">❄️</span>
                            <span className="font-medium">Winter Services</span>
                          </div>
                        )}
                        {business.canadianFactors?.evReadiness?.evCertified && (
                          <div className="flex items-center space-x-2 bg-green-50 p-3 rounded">
                            <span className="text-2xl">⚡</span>
                            <span className="font-medium">EV Certified</span>
                          </div>
                        )}
                        {business.canadianFactors?.bilingualService?.french && (
                          <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded">
                            <span className="text-2xl">🇫🇷</span>
                            <span className="font-medium">Bilingual Service</span>
                          </div>
                        )}
                        {business.canadianFactors?.rustProofing && (
                          <div className="flex items-center space-x-2 bg-orange-50 p-3 rounded">
                            <span className="text-2xl">🛡️</span>
                            <span className="font-medium">Rust Proofing</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div>
                      <h3 className="text-xl font-bold mb-3">Score Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64">
                          <Doughnut 
                            data={scoreChartData} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: 'bottom' }
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Reviews</span>
                              <span className="font-bold">{business.score.reviews}/4.0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(business.score.reviews / 4.0) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Community</span>
                              <span className="font-bold">{business.score.community}/3.0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(business.score.community / 3.0) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Social Signals</span>
                              <span className="font-bold">{business.score.socialSignals}/2.0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full" 
                                style={{ width: `${(business.score.socialSignals / 2.0) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Canadian Factors</span>
                              <span className="font-bold">{business.score.canadianFactors}/1.0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(business.score.canadianFactors / 1.0) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div>
                      <h3 className="text-xl font-bold mb-3">Rating Distribution</h3>
                      <div className="h-64">
                        <Bar 
                          data={ratingChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: { beginAtZero: true }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {business.reviews && business.reviews.length > 0 ? (
                      business.reviews.slice(0, 10).map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">{review.author}</span>
                              <span className="text-gray-500 text-sm ml-2">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex text-yellow-500">
                              {'⭐'.repeat(Math.round(review.rating))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No reviews yet</p>
                    )}
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {business.images && business.images.length > 0 ? (
                      business.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={image.caption || business.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))
                    ) : (
                      <p className="col-span-3 text-gray-500 text-center py-8">No photos available</p>
                    )}
                  </div>
                )}

                {activeTab === 'discussions' && (
                  <div className="space-y-4">
                    {business.communityData?.forumThreads && business.communityData.forumThreads.length > 0 ? (
                      business.communityData.forumThreads.map((thread, index) => (
                        <a
                          key={index}
                          href={thread.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">{thread.title}</h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded ${
                              thread.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              thread.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {thread.sentiment}
                            </span>
                            <span>👍 {thread.votes}</span>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No forum discussions yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {business.location?.address && (
                  <div className="flex items-start">
                    <FiMapPin className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{business.location.address.street}</p>
                      <p className="text-gray-900">
                        {business.location.address.city}, {business.location.address.province} {business.location.address.postalCode}
                      </p>
                    </div>
                  </div>
                )}
                {business.contact?.phone && (
                  <div className="flex items-center">
                    <FiPhone className="mr-3 text-gray-400" />
                    <a href={`tel:${business.contact.phone}`} className="text-gray-900 hover:text-red-600">
                      {business.contact.phone}
                    </a>
                  </div>
                )}
                {business.contact?.website && (
                  <div className="flex items-center">
                    <FiGlobe className="mr-3 text-gray-400" />
                    <a 
                      href={business.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-red-600 truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Hours */}
            {business.hours && Object.keys(business.hours).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FiClock className="mr-2" />
                  Business Hours
                </h3>
                <div className="space-y-2">
                  {Object.entries(business.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-gray-600">
                        {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {coordinates && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Location</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[coordinates[1], coordinates[0]]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[coordinates[1], coordinates[0]]}>
                      <Popup>{business.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Certifications */}
            {business.canadianFactors?.certifications && business.canadianFactors.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Certifications</h3>
                <div className="space-y-2">
                  {business.canadianFactors.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-green-50 p-2 rounded">
                      {cert.verified && <span className="text-green-600">✓</span>}
                      <span className="text-sm font-medium">{cert.type.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessProfile;


