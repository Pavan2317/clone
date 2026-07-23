import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getJobById } from '../../services/jobService';
import { addApplication } from '../../services/applicationService';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(id);
        if (jobData) {
          setJob(jobData);
        } else {
          setError('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      setError('Please log in to apply for jobs.');
      return;
    }

    if (user.role !== 'candidate') {
      setError('Only candidates can apply for jobs.');
      return;
    }

    setIsApplying(true);
    try {
      const applicationData = {
        candidateId: user.id,
        candidateName: user.name,
        candidateEmail: user.username,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyId: job.companyId,
        status: 'pending',
        appliedDate: new Date().toISOString()
      };

      await addApplication(applicationData);
      setApplySuccess(true);

      // Redirect to applications after a brief delay
      setTimeout(() => {
        navigate('/applications');
      }, 2000);
    } catch (error) {
      console.error('Error applying for job:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  // Check if user can edit/delete jobs (company or admin)
  const canManageJobs = user && (user.role === 'company' || user.role === 'admin');
  // Check if this job belongs to the current user (for company users)
  const isJobOwner = user && job && user.id === job.companyId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Details</h1>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Details</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
            <button
              onClick={() => navigate('/jobs-list')}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Details</h1>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Job not found.</p>
            <button
              onClick={() => navigate('/jobs-list')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>

          <div className="flex space-x-3">
            {canManageJobs && isJobOwner && (
              <>
                <Link
                  to={`/jobs/edit/${job.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() => navigate('/jobs-list')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Back to List
                </button>
              </>
            )}
            {!canManageJobs && (
              <button
                onClick={() => navigate('/jobs-list')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Back to Jobs
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {job.company}
                </span>
                <span className="flex items-center">
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                {job.salary && (
                  <span className="flex items-center">
                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.555 16.225A2.5 2.5 0 0018 15.5v-1.5a2.5 2.5 0 00-5 0V15.5a2.5 2.5 0 005 0v1.5c0 .35.1.69.275.925M4.445 16.225A2.5 2.5 0 017 15.5v-1.5a2.5 2.5 0 015 0V15.5a2.5 2.5 0 01-5 0v1.5c0 .35-.1.69-.275.925M12 12.5a.5.5 0 01.5.5v.5a.5.5 0 01-1 0v-.5A.5.5 0 0112 12.5z" />
                    </svg>
                    {job.salary}
                  </span>
                )}
                {job.experience && (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {job.experience} Level
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc list-inside text-gray-600 whitespace-pre-line">
                  {job.requirements.split('\n').map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                <ul className="list-disc list-inside text-gray-600 whitespace-pre-line">
                  {job.benefits.split('\n').map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                  {job.updatedAt && job.updatedAt !== job.createdAt && (
                    <span className="ml-4">Updated on: {new Date(job.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {!canManageJobs && user && user.role === 'candidate' && (
                  <div className="flex space-x-3">
                    {applySuccess ? (
                      <button
                        disabled
                        className="bg-green-600 text-white px-6 py-2 rounded-md font-medium flex items-center"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Application Submitted!
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        disabled={isApplying}
                        className={`bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center ${isApplying ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isApplying ? (
                          <>
                            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20L20 4" />
                            </svg>
                            Applying...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Apply Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
