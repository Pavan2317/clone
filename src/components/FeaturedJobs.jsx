import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/jobService";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Error loading featured jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Safe array handling
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        Loading featured jobs...
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Jobs
          </h2>
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
          >
            View All Jobs →
          </Link>
        </div>

        {safeJobs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No jobs available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeJobs.slice(0, 6).map((job, index) => {
              const jobId = job.id || job._id || `job-${index}`;
              return (
                <div
                  key={jobId}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {job.title || job.jobTitle || "Untitled Job"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {job.company || job.companyName || "Company Secret"}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{job.location || "Remote"}</span>
                    <span>{job.type || job.jobType || "Full-time"}</span>
                  </div>
                  <Link
                    to={`/jobs/${jobId}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
