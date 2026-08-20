import React, { useState, useEffect } from "react";
import { getApplicationsByCandidateId } from "../../services/applicationService";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getApplicationsByCandidateId();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Applications fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const query = search.toLowerCase();
    const title = (app.jobTitle || app.jobId?.title || "").toLowerCase();
    const company = (app.company || app.jobId?.company || "").toLowerCase();
    return title.includes(query) || company.includes(query);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applications</h1>

        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
        />

        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-md shadow text-gray-500 dark:text-gray-400">
            No applications found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app._id || app.id}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {app.jobTitle || app.jobId?.title || "Frontend Devloper"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <strong>Company:</strong> {app.company || app.jobId?.company || "Company"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <strong>Applied Date:</strong>{" "}
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                  </p>
                </div>

                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 capitalize">
                  {app.status || "Submitted"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;