import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

import JobsPage from "./pages/JobsPage";
import ProductsPage from "./pages/ProductsPage";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PopularSearches from "./components/PopularSearches";
import FeaturedCompanies from "./components/FeaturedCompanies";
import PopularCategories from "./components/PopularCategories";
import FeaturedJobs from "./components/FeaturedJobs";
import TopHiringCompanies from "./components/TopHiringCompanies";
import Testimonials from "./components/Testimonials";
import AppDownload from "./components/AppDownload";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Jobs
import Jobs from "./pages/jobs/Jobs";
import AddJob from "./pages/jobs/AddJob";
import EditJob from "./pages/jobs/EditJob";
import JobDetails from "./pages/jobs/JobDetails";

// Companies
import Companies from "./pages/companies/Companies";
import AddCompany from "./pages/companies/AddCompany";
import EditCompany from "./pages/companies/EditCompany";
import CompanyDetails from "./pages/companies/CompanyDetails";

// Applications
import Applications from "./pages/applications/Applications";
import ApplicationDetails from "./pages/applications/ApplicationDetails";

function Home({ setSearch }) {
  return (
    <>
      <main className="w-full overflow-x-hidden">
        <HeroSection setSearch={setSearch} />
        <PopularSearches />
        <FeaturedCompanies />
        <PopularCategories />
        <FeaturedJobs />
        <TopHiringCompanies />
        <Testimonials />
        <AppDownload />
      </main>

      <Footer />
    </>
  );
}

function App() {
  const [search, setSearch] = useState({
    keyword: "",
    location: "",
    experience: "",
  });

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home setSearch={setSearch} />}
        />

        <Route
          path="/jobs"
          element={<JobsPage search={search} />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Jobs */}
        <Route
          path="/jobs-list"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/add"
          element={
            <RoleBasedRoute allowedRoles={["company", "admin"]}>
              <AddJob />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/jobs/edit/:id"
          element={
            <RoleBasedRoute allowedRoles={["company", "admin"]}>
              <EditJob />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* Companies */}
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies/add"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AddCompany />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/companies/edit/:id"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EditCompany />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/companies/:id"
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />

{/* Applications */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
