import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getApplications,
  getApplicationsByCandidateId,
  getApplicationsByCompanyId,
  updateApplicationStatus,
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
      // Safely extract nested user data and ID
      const currentUser = user?.user || user?.data || user;
      const userId = currentUser?.id || currentUser?._id;
      const userRole = (currentUser?.role || "candidate").toLowerCase();

      // Guard clause: if candidate role exists but ID isn't ready yet, wait
      if (userRole === "candidate" && !userId) {
        return;
      }

      try {
        setLoading(true);
        let data = [];

        // Route API call based on user role
        if (userRole === "admin") {
          data = await getApplications(currentUser);
        } else if (
          userRole === "employer" ||
          userRole === "recruiter" ||
          userRole === "company"
        ) {
          data = await getApplications(currentUser);
        } else {
          // Default to Candidate / JobSeeker
          data = await getApplicationsByCandidateId(userId);
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

  // Extract current user details for status checks
  const currentUser = user?.user || user?.data || user;
  const userRole = (currentUser?.role || "").toLowerCase();

  // Whether the user can update application status
  const canUpdateStatus =
    userRole === "admin" ||
    userRole === "employer" ||
    userRole === "recruiter" ||
    userRole === "company";

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      // Update local state so UI reflects the new status
      setApplications((prev) =>
        prev.map((app) =>
          (app._id === appId || app.id === appId) ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
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
                const appId = application._id || application.id || `app-${index}`;
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
                    <td className="p-3">
                      {canUpdateStatus ? (
                        <select
                          value={application.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(
                              application._id || application.id,
                              e.target.value
                            )
                          }
                          className="border p-1 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        application.status || "Pending"
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/applications/${
                              application._id || application.id
                            }`
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                      >
                        View
                      </button>

                      {userRole === "admin" && (
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