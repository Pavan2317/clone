import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { getCompanies } from '../../services/companyService';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobs = await getJobs();
        const companies = await getCompanies();

        // Safely parse users from localStorage
        let users = [];
        try {
          const rawUsers = localStorage.getItem("users");
          users = rawUsers ? JSON.parse(rawUsers) : [];
        } catch (e) {
          console.error("Error reading users from localStorage:", e);
          users = [];
        }

        // Ensure arrays before reading length
        const safeJobs = Array.isArray(jobs)
          ? jobs
          : jobs && Array.isArray(jobs.jobs)
          ? jobs.jobs
          : [];

        const safeCompanies = Array.isArray(companies)
          ? companies
          : companies && Array.isArray(companies.companies)
          ? companies.companies
          : [];

        const safeUsers = Array.isArray(users) ? users : [];

        setJobCount(safeJobs.length);
        setCompanyCount(safeCompanies.length);
        setUserCount(safeUsers.length);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    loadData();
  }, []);

  const renderCandidateDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Welcome back, {user?.name || "Candidate"}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Here's your candidate dashboard overview.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Job Applications</h2>
        <p className="text-gray-600 dark:text-gray-300">View and manage your job applications.</p>
        <Link to="/applications" className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block">
          View Applications →
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Saved Jobs</h2>
        <p className="text-gray-600 dark:text-gray-300">Jobs you've saved for later.</p>
        <Link to="/jobs-list" className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block">
          Browse Jobs →
        </Link>
      </div>
    </div>
  );

  const renderCompanyDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Welcome back, {user?.name || "Employer"}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Here's your company dashboard overview.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your Job Postings</h2>
        <p className="text-gray-600 dark:text-gray-300">Manage your posted jobs and applications.</p>
        <Link to="/jobs-list" className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block">
          Manage Jobs →
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Applications Received</h2>
        <p className="text-gray-600 dark:text-gray-300">View applications for your job postings.</p>
        <Link to="/applications" className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block">
          View Applications →
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:col-span-2 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link to="/jobs/add" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Post New Job
          </Link>
          <Link to="/companies" className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
            Manage Companies
          </Link>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">Welcome, {user?.name || "Admin"}! Here's the system overview.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Users</h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{userCount}</p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage all users in the system.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Jobs</h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{jobCount}</p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">All job postings in the system.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Companies</h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{companyCount}</p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Registered companies in the system.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:col-span-2 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link to="/jobs-list" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Manage Jobs
          </Link>
          <Link to="/companies" className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
            Manage Companies
          </Link>
          <Link to="/applications" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
            View Applications
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {user?.role === 'candidate' && renderCandidateDashboard()}
        {(user?.role === 'company' || user?.role === 'employer') && renderCompanyDashboard()}
        {user?.role === 'admin' && renderAdminDashboard()}

        {!user && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
            <p className="text-gray-600 dark:text-gray-300">Please log in to view your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;