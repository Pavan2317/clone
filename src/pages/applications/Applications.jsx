import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getApplicationsByCandidateId, getApplicationsByCompanyId, deleteApplication } from '../../services/applicationService';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let applicationsData = [];

        if (user.role === 'admin') {
          // Admins can see all applications
          applicationsData = await getApplications();
        } else if (user.role === 'company') {
          // Companies can only see applications for their jobs
          applicationsData = await getApplicationsByCompanyId(user.id);
        } else if (user.role === 'candidate') {
          // Candidates can only see their own applications
          applicationsData = await getApplicationsByCandidateId(user.id);
        }

        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again.');
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

  const handleDelete = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(applicationId);
        setApplications(applications.filter(app => app.id !== applicationId));
      } catch (error) {
        console.error('Error deleting application:', error);
        setError('Failed to delete application. Please try again.');
      }
    }
  };

  const filteredApplications = applications.filter(application =>
    application.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user can delete applications (admin only)
  const canDeleteApplications = user && user.role === 'admin';

   if (loading) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Applications</h1>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
             <p className="text-gray-600 dark:text-gray-300">Loading applications...</p>
           </div>
         </div>
       </div>
     );
   }

   if (error) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Applications</h1>
           <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative transition-colors duration-300">
             {error}
           </div>
         </div>
       </div>
     );
   }

   if (!user) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Applications</h1>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
             <p className="text-gray-600 dark:text-gray-300">Please log in to view applications.</p>
           </div>
         </div>
       </div>
     );
   }

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Applications</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
               <input
                 type="text"
                 placeholder="Search applications..."
                 className="w-full md:w-64 px-4 py-2 border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

         {filteredApplications.length === 0 ? (
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
             <p className="text-gray-600 dark:text-gray-300">No applications found.</p>
             {user.role === 'candidate' && (
               <p className="text-gray-500 dark:text-gray-300 mt-2">You haven't applied to any jobs yet. <a href="/jobs-list" className="text-indigo-600 hover:text-indigo-500">Browse jobs</a> to find opportunities.</p>
             )}
             {user.role === 'company' && (
               <p className="text-gray-500 dark:text-gray-300 mt-2">No one has applied to your jobs yet. <a href="/jobs-list" className="text-indigo-600 hover:text-indigo-500">View your jobs</a> or <a href="/jobs/add" className="text-indigo-600 hover:text-indigo-500">post new jobs</a>.</p>
             )}
           </div>
         ) : (
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                 <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Job Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                    {user.role === 'company' && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Candidate</th>
                    )}
                    {user.role === 'candidate' && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applied Date</th>
                    )}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredApplications.map((application) => (
                    <tr key={application.id}>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-gray-900 dark:text-white">{application.jobTitle}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-500 dark:text-gray-300">{application.company}</div>
                       </td>
                       {user.role === 'company' && (
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900 dark:text-white">{application.candidateName}</div>
                           <div className="text-xs text-gray-500 dark:text-gray-300">{application.candidateEmail}</div>
                         </td>
                       )}
                       {user.role === 'candidate' && (
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-500 dark:text-gray-300">{new Date(application.appliedDate).toLocaleDateString()}</div>
                         </td>
                       )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : application.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-3">
                        <button
                          onClick={() => navigate(`/jobs/${application.jobId}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View job details"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {canDeleteApplications && (
                          <button
                            onClick={() => handleDelete(application.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete application"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
