import React from 'react';
import { jobs } from '../data/jobs';

const FeaturedJobs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Jobs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.slice(0, 6).map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{job.experience}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{job.salary}</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{job.location}</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{skill}</span>
                ))}
              </div>

              <button className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;