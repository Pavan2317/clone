import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCompanyById } from '../../services/companyService';

const CompanyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await getCompanyById(id);
        if (companyData) {
          setCompany(companyData);
        } else {
          setError('Company not found');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        setError('Failed to load company details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Check if user is admin (only admins can edit/delete companies)
  const isAdmin = user && user.role === 'admin';

   if (loading) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Company Details</h1>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
             <p className="text-gray-600 dark:text-gray-300">Loading company details...</p>
           </div>
         </div>
       </div>
     );
   }

   if (error) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Company Details</h1>
           <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative transition-colors duration-300">
             {error}
             <button
               onClick={() => navigate('/companies')}
               className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
             >
               Back to Companies
             </button>
           </div>
         </div>
       </div>
     );
   }

   if (!company) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Company Details</h1>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
             <p className="text-gray-600 dark:text-gray-300">Company not found.</p>
             <button
               onClick={() => navigate('/companies')}
               className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
             >
               Back to Companies
             </button>
           </div>
         </div>
       </div>
     );
   }

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Details</h1>

          <div className="flex space-x-3">
            {isAdmin && (
              <>
                <Link
                  to={`/companies/edit/${company.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() => navigate('/companies')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Back to List
                </button>
              </>
            )}
            {!isAdmin && (
              <button
                onClick={() => navigate('/companies')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Back to Companies
              </button>
            )}
          </div>
        </div>

         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
           <div className="p-6">
             <div className="mb-6">
               <div className="flex items-center mb-4">
                 {company.logo ? (
                   <img src={company.logo} alt={`${company.companyName} logo`} className="h-16 w-16 rounded-full object-contain mr-4" />
                 ) : (
                   <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                     <span className="text-xl font-bold text-gray-600 dark:text-gray-300">{company.companyName.charAt(0)}</span>
                   </div>
                 )}
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{company.companyName}</h2>
                   <div className="flex items-center mt-1">
                     <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900">
                       {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                     </a>
                   </div>
                 </div>
               </div>

               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                 <span className="flex items-center">
                   <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   {company.location}
                 </span>
                {company.industry && (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {company.industry}
                  </span>
                )}
                {company.employeeCount && (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {company.employeeCount} employees
                  </span>
                )}
                {company.foundedYear && (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Founded {company.foundedYear}
                  </span>
                )}
              </div>
            </div>

             {company.description && (
               <div className="mb-6">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About {company.companyName}</h3>
                 <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{company.description}</p>
               </div>
             )}

             <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
               <div className="flex justify-between items-center">
                 <div className="text-sm text-gray-500 dark:text-gray-300">
                   {company.createdAt && (
                     <span>Added on: {new Date(company.createdAt).toLocaleDateString()}</span>
                   )}
                   {company.updatedAt && company.updatedAt !== company.createdAt && (
                     <span className="ml-4">Updated on: {new Date(company.updatedAt).toLocaleDateString()}</span>
                   )}
                 </div>

                <div className="flex space-x-3">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
