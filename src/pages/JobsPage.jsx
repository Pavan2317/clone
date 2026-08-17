import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/jobService";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Jobs</h1>
        {safeJobs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No jobs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeJobs.map((job, index) => {
              const jobId = job.id || job._id || `job-${index}`;
              return (
                <div key={jobId} className="bg-white dark:bg-gray-800 p-6 rounded shadow">
                  <h2 className="text-xl font-bold dark:text-white">{job.title || "Untitled"}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{job.company || "N/A"}</p>
                  <Link
                    to={`/jobs/${jobId}`}
                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm"
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
