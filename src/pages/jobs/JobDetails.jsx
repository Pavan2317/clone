import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getJobById } from "../../services/jobService";
import { addApplication } from "../../services/applicationService";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        console.error("Error loading job details:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addApplication({
        jobId: job.id || job._id,
        jobTitle: job.title || job.jobTitle,
        company: job.company || job.companyName,
        candidateId: user.id || user._id,
        candidateName: user.name || user.email,
        candidateEmail: user.email,
        status: "Pending",
      });
      setApplied(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to apply. Please try again.");
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Loading job...</div>;
  if (error || !job) return <div className="p-10 text-center text-red-500">{error || "Job not found."}</div>;

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === "string"
    ? job.requirements.split("\n").filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h1 className="text-3xl font-bold dark:text-white mb-2">
          {job.title || job.jobTitle || "Untitled Job"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          {job.company || job.companyName || "Company Secret"}
        </p>

        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>📍 {job.location || "Remote"}</span>
          <span>💼 {job.type || job.jobType || "Full-time"}</span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold dark:text-white mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {job.description || "No description provided."}
          </p>
        </div>

        {requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold dark:text-white mb-2">Requirements</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {user?.role !== "company" && user?.role !== "employer" && (
          <button
            onClick={handleApply}
            disabled={applied}
            className={`px-6 py-2 rounded text-white font-medium ${
              applied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {applied ? "Applied!" : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;