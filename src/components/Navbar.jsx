import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const renderAuthButtons = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-primary px-4 py-2 text-sm font-medium">Login</Link>
          <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">Register</Link>
        </>
      );
    }

    return (
      <>
        <span className="text-gray-700 dark:text-gray-200 px-4 py-2 text-sm font-medium">Welcome, {user.name}</span>
        <button
          onClick={logout}
          className="text-gray-700 dark:text-gray-200 hover:text-primary px-4 py-2 text-sm font-medium"
        >
          Logout
        </button>
      </>
    );
  };

  const renderNavigationLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Home</Link>
          <Link to="/jobs" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Jobs</Link>
          <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Products</Link>
          <Link to="/companies" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Companies</Link>
        </>
      );
    }

    // Candidate menu
    if (user.role === 'candidate') {
      return (
        <>
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Home</Link>
          <Link to="/jobs" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Jobs</Link>
          <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Dashboard</Link>
        </>
      );
    }

    // Company menu
    if (user.role === 'company') {
      return (
        <>
          <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Dashboard</Link>
          <Link to="/jobs-list" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Jobs</Link>
          <Link to="/applications" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Applications</Link>
        </>
      );
    }

    // Admin menu
    if (user.role === 'admin') {
      return (
        <>
          <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Dashboard</Link>
          <Link to="/jobs-list" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Jobs</Link>
          <Link to="/companies" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Companies</Link>
          <Link to="/applications" className="text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">Applications</Link>
        </>
      );
    }

    return null;
  };

  return (
<nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
<h1 className="text-2xl font-bold text-primary dark:text-white">
  JobPortal
</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {renderNavigationLinks()}
            </div>
          </div>

          {/* Auth Buttons */}
<div className="flex items-center space-x-4">
  <ThemeToggle />
  {renderAuthButtons()}

            {/* Employer Dropdown */}
            <div className="relative">
<button className="text-gray-700 dark:text-gray-200 hover:text-primary px-4 py-2 text-sm font-medium flex items-center">
                For Employers
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
