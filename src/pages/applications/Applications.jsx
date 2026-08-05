import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getApplications,
  getApplicationsByCandidateId,
  getApplicationsByCompanyId,
  deleteApplication,
} from "../../services/applicationService";

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        let data = [];

        // Route API call based on user role
        if (user?.role === "admin") {
          data = await getApplications(user);
        } else if (
          user?.role === "employer" ||
          user?.role === "recruiter" ||
          user?.role === "company"
        ) {
          // Pass full user object so fallback matching by name works
          data = await getApplications(user);
        } else {
          // Default to Candidate / JobSeeker
          data = await getApplicationsByCandidateId(user?.id || user?._id);
        }

        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("ERROR fetching applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        setApplications(
          applications.filter((app) => app.id !== id && app._id !== id)
        );
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const filteredApplications = applications.filter((app) => {
    const searchString = (
      (app.jobTitle || app.job?.title || "") +
      (app.company || app.companyId?.name || "") +
      (app.candidateName || app.candidateId?.name || "") +
      (app.status || "")
    ).toLowerCase();

    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <h2 className="p-10 text-xl dark:text-white">Loading applications...</h2>;
  }

  if (error) {
    return <h2 className="p-10 text-red-500">{error}</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Applications
      </h1>

      <input
        type="text"
        placeholder="Search applications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-5 px-4 py-2 border rounded w-full max-w-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />

      {filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded text-center shadow">
          <p className="text-gray-600 dark:text-gray-300">
            No applications found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <tr>
                <th className="p-3">Job</th>
                <th className="p-3">Company</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application, index) => {
                const appId = application.job?._id || application.job || application._id || `app-${index}`;
                return (
                  <tr
                    key={appId}
                    className="border-b dark:border-gray-700 dark:text-white"
                  >
                    <td className="p-3">
                      {application.jobTitle || application.job?.title || "N/A"}
                    </td>
                    <td className="p-3">
                      {application.company || application.companyId?.name || "N/A"}
                    </td>
                    <td className="p-3">
                      {application.candidateName ||
                        application.candidateId?.name ||
                        "N/A"}
                    </td>
                    <td className="p-3">{application.status || "Pending"}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/jobs/${
                              application.jobId?._id ||
                              application.jobId ||
                              application.job?._id || application.job
                            }`
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                      >
                        View
                      </button>

                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleDelete(appId)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
