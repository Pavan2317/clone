import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(
          `https://backend-qwbt.onrender.com/api/applications/${id}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching candidate details:", err);
        setError("Failed to load application details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <p className="text-gray-600 dark:text-gray-300">
          Loading application details...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <p className="text-red-500">{error || "Application not found."}</p>
        <button
          onClick={() => navigate("/applications")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const candidate = data.candidateId || {};
  const job = data.jobId || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <button
        onClick={() => navigate("/applications")}
        className="mb-4 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        ← Back to Applications
      </button>

      <div className="max-w-2xl bg-white dark:bg-gray-800 border rounded shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Candidate Application Details
          </h2>
        </div>

        <div className="p-6 space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Candidate Name:</strong>{" "}
            {candidate.name || data.candidateName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {candidate.phone || "N/A"}
          </p>
          <p>
            <strong>Job Title:</strong>{" "}
            {job.title || data.jobTitle || "N/A"}
          </p>
          <p>
            <strong>Company:</strong> {data.company || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {data.status || "Pending"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
