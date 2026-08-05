import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../../services/jobService";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs();
        
        // Ensure data is formatted as an array
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Guarantee jobs is an array before filtering
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const filteredJobs = safeJobs.filter((job) => {
    const searchString = (
      (job.title || job.jobTitle || "") +
      (job.company || job.companyName || "") +
      (job.location || "") +
      (job.type || job.jobType || "")
    ).toLowerCase();

    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="p-10 text-center text-xl dark:text-white">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          All Jobs
        </h1>

        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 px-4 py-2 border rounded w-full max-w-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        {filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded text-center shadow">
            <p className="text-gray-600 dark:text-gray-300">No jobs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => {
              const jobId = job.id || job._id || `job-${index}`;
              return (
                <div
                  key={jobId}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {job.title || job.jobTitle || "Untitled Job"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {job.company || job.companyName || "Company Secret"}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{job.location || "Remote"}</span>
                    <span>{job.type || job.jobType || "Full-time"}</span>
                  </div>
                  <Link
                    to={`/jobs/${jobId}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;