import React from 'react';
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

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <PopularSearches />
        <FeaturedCompanies />
        <PopularCategories />
        <FeaturedJobs />
        <TopHiringCompanies />
        <Testimonials />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
};

export default App;