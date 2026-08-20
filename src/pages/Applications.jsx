import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applicationService";

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
        const data = await getApplications();
        setApplications(Array.isArray(data) ? data : data?.applications || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const previousApplications = [...applications];

    setApplications((prev) =>
      prev.map((app) =>
        app._id === id || app.id === id ? { ...app, status: newStatus } : app
      )
    );

    try {
      if (typeof updateApplicationStatus === "function") {
        await updateApplicationStatus(id, newStatus);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setApplications(previousApplications);
      alert("Failed to update status on server.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    const title = (
      app.title ||
      app.jobTitle ||
      app.job?.title ||
      app.job ||
      ""
    ).toLowerCase();
    const company = (
      app.company ||
      app.companyName ||
      app.company?.companyName ||
      ""
    ).toLowerCase();
    const candidate = (
      app.candidate ||
      app.candidateName ||
      app.applicantName ||
      app.user?.name ||
      ""
    ).toLowerCase();

    return (
      title.includes(term) || company.includes(term) || candidate.includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Applications
          </h1>
          <div className="text-gray-500">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Applications
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 shadow-sm"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Table layout */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-800 text-sm font-semibold border-b border-gray-200">
                  <th className="py-4 px-6 font-semibold">Job</th>
                  <th className="py-4 px-6 font-semibold">Company</th>
                  <th className="py-4 px-6 font-semibold">Candidate</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-gray-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const appId = app._id || app.id;
                    const currentStatus = app.status || "Pending";
                    const jobTitle =
                      app.title || app.jobTitle || app.job?.title || app.job || "Job Title";
                    const companyName =
                      app.company ||
                      app.companyName ||
                      app.company?.companyName ||
                      "Company";
                    const candidateName =
                      app.candidate ||
                      app.candidateName ||
                      app.applicantName ||
                      app.user?.name ||
                      "Candidate";

                    return (
                      <tr
                        key={appId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-900">
                          {jobTitle}
                        </td>
                        <td className="py-4 px-6 text-gray-800">
                          {companyName}
                        </td>
                        <td className="py-4 px-6 text-gray-800">
                          {candidateName}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleStatusChange(appId, e.target.value)
                            }
                            className="bg-white border border-gray-200 text-gray-800 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-gray-400 cursor-pointer shadow-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => navigate(`/applications/${appId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-5 py-1.5 rounded shadow-sm transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;