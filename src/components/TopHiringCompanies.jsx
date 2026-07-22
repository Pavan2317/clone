import React from 'react';
import { useNavigate } from "react-router-dom";
import { companies } from '../data/companies';

const TopHiringCompanies = () => {
  const navigate = useNavigate();

  return (
<section className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Top Hiring Companies</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {companies.slice(0, 4).map((company) => (
            <div key={company.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div className="flex-1">
<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{company.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
<span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{company.rating} rating</span>
                </div>
<p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{company.description}</p>
<p className="text-sm text-gray-500 dark:text-gray-300">{company.jobs} current job openings</p>
              </div>

<button
  onClick={() => navigate("/jobs")}
  className="bg-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300 flex-shrink-0"
>
  View Jobs
</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopHiringCompanies;