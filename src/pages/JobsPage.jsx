import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/jobService";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read current user directly from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const isEmployer = user?.role === "employer" || user?.role === "admin" || user?.role === "company";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Error loading jobs page:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  if (loading) {
    return <div className="p-10 text-center dark:text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jobs</h1>
          {isEmployer && (
            <Link
              to="/jobs/add"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow transition"
            >
              + Post / Add Job
            </Link>
          )}
        </div>

        {safeJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded shadow text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No jobs available.</p>
            {isEmployer && (
              <Link
                to="/jobs/add"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
              >
                Add First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeJobs.map((job, index) => {
              const jobId = job.id || job._id || `job-${index}`;
              return (
                <div key={jobId} className="bg-white dark:bg-gray-800 p-6 rounded shadow flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">{job.title || "Untitled"}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{job.company || "N/A"}</p>
                    {job.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                    )}
                  </div>
                  <Link
                    to={`/jobs/${jobId}`}
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded text-sm transition"
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

export default JobsPage;