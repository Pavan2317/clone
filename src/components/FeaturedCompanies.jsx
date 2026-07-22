import React from 'react';
import { useNavigate } from "react-router-dom";
import { companies } from '../data/companies';

const FeaturedCompanies = () => {
  const navigate = useNavigate();

  return (
<section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Featured Companies</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.slice(0, 8).map((company) => (
            <div key={company.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                className="w-20 h-20 object-contain mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{company.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{company.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{company.industry}</p>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-300">{company.jobs} open jobs</span>
<button
  onClick={() => navigate("/jobs")}
  className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-300"
>
  View Jobs
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;