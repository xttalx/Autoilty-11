import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const categories = [
    { name: 'Mechanics', slug: 'mechanics', icon: '🔧' },
    { name: 'Dealerships', slug: 'dealerships', icon: '🚗' },
    { name: 'Auto Parts', slug: 'auto-parts', icon: '⚙️' },
    { name: 'Detailing', slug: 'detailing', icon: '✨' },
    { name: 'Tire Centers', slug: 'tire-centers', icon: '🛞' },
    { name: 'EV Chargers', slug: 'ev-chargers', icon: '⚡' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-2">🇨🇦</span>
                Canada's Premier Auto Business Directory
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="hover:text-red-100 flex items-center">
                    <FiUser className="mr-1" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="hover:text-red-100 flex items-center">
                    <FiLogOut className="mr-1" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-red-100">Login</Link>
                  <Link to="/register" className="hover:text-red-100">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🚘</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                Autoilty<span className="text-red-600">.com</span>
              </div>
              <div className="text-xs text-gray-500">Trusted Auto Businesses</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search mechanics, dealerships, auto services..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden md:flex space-x-1 pb-3 border-b border-gray-200">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center space-x-1"
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full px-4 py-2 pr-12 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600"
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Links */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


