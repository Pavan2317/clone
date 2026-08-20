import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user: contextUser } = useAuth();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || localStorage.getItem("userData") || "{}"
  );
  const user = contextUser || storedUser;

  const role = String(
    user?.role || user?.userType || user?.type || ""
  ).toLowerCase();

  const isAdmin = role === "admin" || user?.isAdmin === true;
  const isCompany =
    role === "company" ||
    role === "employer" ||
    role === "recruiter" ||
    user?.isCompany === true;

  const [adminStats] = useState({
    usersCount: 6,
    jobsCount: 1,
    companiesCount: 0,
  });

  // Helper for consistent card styling
  const DashboardCard = ({ title, description, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      {children}
    </div>
  );

  // ---------------- ADMIN VIEW ----------------
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Admin Dashboard" description="Welcome, Admin! Here's the system overview." />
            <DashboardCard title="Total Users" description="Manage all users in the system.">
              <p className="text-3xl font-bold text-gray-900 mt-2">{adminStats.usersCount}</p>
            </DashboardCard>
            <DashboardCard title="Total Jobs" description="All job postings in the system.">
              <p className="text-3xl font-bold text-gray-900 mt-2">{adminStats.jobsCount}</p>
            </DashboardCard>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Total Companies" description="Registered companies in the system.">
              <p className="text-3xl font-bold text-gray-900 mt-2">{adminStats.companiesCount}</p>
            </DashboardCard>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
              <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/jobs-list" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition">Manage Jobs</Link>
                <Link to="/companies" className="bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded transition">Manage Companies</Link>
                <Link to="/applications" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded transition">View Applications</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- COMPANY VIEW ----------------
  if (isCompany) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title={`Welcome back, ${user?.name || user?.companyName || "Employer"}!`} description="Here's your company dashboard overview." />
            <DashboardCard title="Your Job Postings" description="Manage your posted jobs and applications.">
              <Link to="/jobs-list" className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm">Manage Jobs →</Link>
            </DashboardCard>
            <DashboardCard title="Applications Received" description="View applications for your job postings.">
              <Link to="/applications" className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm">View Applications →</Link>
            </DashboardCard>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex gap-3">
              <Link to="/jobs/add" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition">Post New Job</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- CANDIDATE VIEW ----------------
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title={`Welcome back, ${user?.name || "User"}!`} description="Here's your candidate dashboard overview." />
          <DashboardCard title="Job Applications" description="View and manage your job applications.">
            <Link to="/applications" className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm">View Applications →</Link>
          </DashboardCard>
          <DashboardCard title="Saved Jobs" description="Jobs you've saved for later.">
            <Link to="/jobs" className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm">Browse Jobs →</Link>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;