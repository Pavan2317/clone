import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getJobById } from '../../services/jobService';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  // Get current logged-in user session
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  
  // Check user role (adjust "company" or "employer" based on your auth structure)
  const isCompany = currentUser.role === 'company' || currentUser.role === 'employer';
  const isCandidate = currentUser.role === 'candidate' || currentUser.role === 'applicant' || !currentUser.role;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (id) {
          const foundJob = await getJobById(id);
          setJob(foundJob);
        }
      } catch (err) {
        console.error('Error loading job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!job) return;

    try {
      const applicationPayload = {
        jobId: job._id || job.id || id,
        candidateId: currentUser._id || currentUser.id || String(Date.now()),
        companyId: job.companyId || 'N/A',
        jobTitle: job.title || job.jobTitle || 'Job Title',
        company: job.company || 'Company Name',
        candidateName: currentUser.name || currentUser.username || 'Candidate',
        status: 'pending',
      };

      await axios.post('https://backend-qwbt.onrender.com/api/applications', applicationPayload);

      setApplied(true);
      alert('Application successfully saved to database!');
    } catch (error) {
      console.error('Failed to save application:', error);
      alert('Error submitting application to MongoDB.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!job) return <div className="p-8 text-center text-red-500">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/jobs-list" className="text-indigo-600 hover:underline">
          ← Back to Jobs
        </Link>

        {/* Hide Apply button if logged in as a Company */}
        {isCompany ? (
          <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium">
            Employer View
          </span>
        ) : (
          <button
            onClick={handleApply}
            disabled={applied}
            className={`px-6 py-2.5 rounded-md font-semibold text-white transition duration-200 ${
              applied
                ? 'bg-green-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md'
            }`}
          >
            {applied ? '✓ Applied' : 'Apply Now'}
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
        {job.title || job.jobTitle}
      </h1>
      <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-4">
        {job.company}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
        <div><strong>Location:</strong> {job.location || 'N/A'}</div>
        <div><strong>Type:</strong> {job.type || 'Full-time'}</div>
        <div><strong>Salary:</strong> {job.salary || 'Not specified'}</div>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Job Description
        </h2>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {job.description || 'No description provided.'}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;
