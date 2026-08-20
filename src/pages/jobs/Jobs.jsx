import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobService';

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(Array.isArray(data) ? data : data?.jobs || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    return (
      (job.title || '').toLowerCase().includes(term) ||
      (job.company || '').toLowerCase().includes(term) ||
      (job.location || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Jobs</h1>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Jobs</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
              No jobs found.
            </div>
          ) : (
            filteredJobs.map((job) => {
              const jobId = job._id || job.id;

              return (
                <div
                  key={jobId}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {job.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {job.company}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <span>{job.location}</span>
                      <span>{job.jobType || job.type || 'Full-time'}</span>
                    </div>
                  </div>

                  {/* Actions: View Details and Edit */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/jobs/${jobId}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/jobs/edit/${jobId}`)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsList;