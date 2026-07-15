import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find your dream job now
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore thousands of job opportunities from top companies
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Skills/Designation Input */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. React Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Experience Dropdown */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Select Experience</option>
                    <option>0-1 years</option>
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5-10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>

                {/* Location Input */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Search Button */}
                <div className="md:col-span-1">
                  <button className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition duration-300 mt-6 md:mt-6">
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;