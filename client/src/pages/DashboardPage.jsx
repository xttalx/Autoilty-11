import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBookmark, FiThumbsUp, FiUser } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const { data: userData, isLoading } = useQuery('currentUser', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  });

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-4 text-white text-3xl">
              <FiUser />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">{userData.username}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {userData.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Bookmarks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userData.bookmarks?.length || 0}
                </p>
              </div>
              <FiBookmark className="text-4xl text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Votes Cast</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userData.votes?.length || 0}
                </p>
              </div>
              <FiThumbsUp className="text-4xl text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Reviews</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userData.reviews?.length || 0}
                </p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <p className="text-gray-900">{userData.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{userData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-900">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


