import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import JobsPage from "./pages/JobsPage";

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PopularSearches from './components/PopularSearches';
import FeaturedCompanies from './components/FeaturedCompanies';
import PopularCategories from './components/PopularCategories';
import FeaturedJobs from './components/FeaturedJobs';
import TopHiringCompanies from './components/TopHiringCompanies';
import Testimonials from './components/Testimonials';
import AppDownload from './components/AppDownload';
import Footer from './components/Footer';


function Home({setSearch}) {

  return (
    <>
      <Navbar />

      <main>

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
    experience: ""
  });


  return (

    <Routes>

      <Route
        path="/"
        element={
          <Home setSearch={setSearch} />
        }
      />


      <Route
        path="/jobs"
        element={
          <JobsPage search={search} />
        }
      />


    </Routes>

  );
}


export default App;