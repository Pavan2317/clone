import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ApplyModal from "../../components/ApplyModal";
import { getJobById } from "../../services/jobService";
import { getApplicationsByCandidateId, addApplication } from "../../services/applicationService";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const VALID_24_CHAR_ID = "64b0f1a23c4d5e6f7a8b9c0d";

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const candidateId = parsed._id || parsed.id || parsed.userId || parsed.candidateId;
        if (candidateId && candidateId.length === 24) return candidateId;
      }
    } catch (e) {
      console.error("Error reading localStorage user:", e);
    }
    return VALID_24_CHAR_ID;
  };

  useEffect(() => {
    const fetchJobAndApplicationStatus = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(id);
        setJob(jobData);

        const currentUserId = getCandidateId();
        if (currentUserId) {
          const userApps = await getApplicationsByCandidateId(currentUserId);
          
          // Check if candidate has already applied to this specific job ID
          const alreadyApplied = Array.isArray(userApps) && userApps.some((app) => {
            const appliedJobId = app.jobId?._id || app.jobId || app.job;
            return String(appliedJobId) === String(id);
          });

          setHasApplied(alreadyApplied);
        }
      } catch (err) {
        console.error("Error checking application status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicationStatus();
  }, [id]);

  const handleApplySubmit = async (formData) => {
    // Block duplicate submission attempt
    if (hasApplied) {
      toast.error("You have already applied for this job!");
      setIsModalOpen(false);
      return;
    }

    const validCandidateId = getCandidateId();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const payload = {
        jobId: id,
        candidateId: validCandidateId,
        candidateName: formData.fullName || storedUser.name || "Pavan",
        jobTitle: job?.title || "Frontend Devloper",
        company: job?.company || "Company",
        email: formData.email || storedUser.email || "pavan@gmail.com",
        phone: formData.phone || "1234567890",
        resume: formData.resume || "https://example.com/resume.pdf",
      };

      await addApplication(payload);
      toast.success("Application submitted successfully!");
      setHasApplied(true); // Locks button permanently for this session
      setIsModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to submit application");
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Loading...</div>;
  if (!job) return <div className="p-10 text-center dark:text-white">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">{job.title}</h1>

          {hasApplied ? (
            <button
              disabled
              className="bg-gray-400 text-white font-medium px-5 py-2 rounded cursor-not-allowed opacity-80"
            >
              ✓ Applied
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition"
            >
              Apply Now
            </button>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Company:</strong> {job.company}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Location:</strong> {job.location}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4"><strong>Salary:</strong> {job.salary}</p>
        <div className="text-gray-700 dark:text-gray-300 mt-4">{job.description}</div>

        {!hasApplied && (
          <ApplyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleApplySubmit}
          />
        )}
      </div>
    </div>
  );
};

export default JobDetails;