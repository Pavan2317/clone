import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ setSearch }) => {

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim() === "" || location.trim() === "") {
      alert("Please enter both Skill/Designation and Location.");
      return;
    }

    setSearch({
      keyword,
      location,
      experience
    });

    navigate("/jobs");
  };

  return (
<section className="bg-gray-50 dark:bg-gray-950 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center">

<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find your dream job now
          </h1>

<p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Explore thousands of job opportunities from top companies
          </p>


          <div className="max-w-4xl mx-auto">
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                {/* Skills */}
                <div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Skills / Designation
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. React Developer"
                    value={keyword}
                    onChange={(e)=>setKeyword(e.target.value)}
className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>


                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Experience
                  </label>

                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                  </select>

                </div>


                {/* Location */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />

                </div>


                {/* Button */}
                <div>

                  <button
                    onClick={handleSearch}
                    className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 mt-6"
                  >
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