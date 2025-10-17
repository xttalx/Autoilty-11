import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import BusinessProfile from './pages/BusinessProfile';
import SearchResults from './pages/SearchResults';
import ProvincePage from './pages/ProvincePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Styles
import './styles/tailwind.css';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Apollo Client for GraphQL
const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/graphql`
    : 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('token') 
      ? `Bearer ${localStorage.getItem('token')}`
      : '',
  },
});

function App() {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/province/:province" element={<ProvincePage />} />
                  <Route path="/business/:slug" element={<BusinessProfile />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  );
}

export default App;


