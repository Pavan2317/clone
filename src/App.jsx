import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import JobsPage from "./pages/JobsPage";
import ProductsPage from "./pages/ProductsPage";

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

    <>
      <Navbar />

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


      <Route path="/products" element={<ProductsPage />} />

    </Routes>

    </>

  );
}


export default App;