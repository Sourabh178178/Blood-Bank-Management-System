import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="px-3 py-2 text-gray-700 hover:text-primary">Home</Link>
          <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-primary">About</Link>
          <Link to="/contact" className="px-3 py-2 text-gray-700 hover:text-primary">Contact</Link>
          {/* Three login links */}
          <Link to="/login" className="px-3 py-2 text-primary font-semibold hover:underline">Login as Donor</Link>
          <Link to="/login" state={{ role: 'hospital' }} className="px-3 py-2 text-blue-700 font-semibold hover:underline">Login as Hospital</Link>
          <Link to="/login" state={{ role: 'admin' }} className="px-3 py-2 text-green-700 font-semibold hover:underline">Login as Admin</Link>
        </>
      );
    }

    switch (user.role) {
      case 'donor':
        return (
          <>
            <Link to="/donor/dashboard" className="px-3 py-2 text-gray-700 hover:text-primary">Dashboard</Link>
            <Link to="/donor/profile" className="px-3 py-2 text-gray-700 hover:text-primary">Profile</Link>
            <Link to="/donor/history" className="px-3 py-2 text-gray-700 hover:text-primary">Donation History</Link>
          </>
        );
      case 'hospital':
        return (
          <>
            <Link to="/hospital/dashboard" className="px-3 py-2 text-gray-700 hover:text-primary">Dashboard</Link>
            <Link to="/hospital/request-blood" className="px-3 py-2 text-gray-700 hover:text-primary">Request Blood</Link>
            <Link to="/hospital/request-history" className="px-3 py-2 text-gray-700 hover:text-primary">Request History</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" className="px-3 py-2 text-gray-700 hover:text-primary">Dashboard</Link>
            <Link to="/admin/inventory" className="px-3 py-2 text-gray-700 hover:text-primary">Inventory</Link>
            <Link to="/admin/requests" className="px-3 py-2 text-gray-700 hover:text-primary">Requests</Link>
            <Link to="/admin/statistics" className="px-3 py-2 text-gray-700 hover:text-primary">Statistics</Link>
            <Link to="/admin/directory" className="px-3 py-2 text-gray-700 hover:text-primary">Directory</Link> 
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="text-gray-800">Blood</span>Bank
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            {getNavLinks()}
            {user && (
              <button 
                onClick={handleLogout}
                className="ml-4 bg-primary text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 flex flex-col">
            {getNavLinks()}
            {user && (
              <button 
                onClick={handleLogout}
                className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
