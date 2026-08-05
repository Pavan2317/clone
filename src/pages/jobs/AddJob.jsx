import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addJob } from '../../services/jobService';
import { getCompanies } from '../../services/companyService';
import { validateJobData } from '../../utils/validation';

const AddJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyId: user?.id || user?._id || '',
    location: '',
    salary: '',
    experience: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data || []);
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };
    loadCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company") {
      const selectedCompany = companies.find(
        (comp) => comp.companyName === value
      );

      setFormData((prev) => ({
        ...prev,
        company: value,
        companyId: selectedCompany ? (selectedCompany._id || selectedCompany.id) : (user?.id || user?._id || '')
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage('');

    const validation = validateJobData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await addJob(formData);
      setSuccessMessage('Job added successfully!');

      setFormData({
        title: '',
        company: '',
        companyId: user?.id || user?._id || '',
        location: '',
        salary: '',
        experience: '',
        description: '',
        requirements: '',
        benefits: ''
      });

      setTimeout(() => {
        navigate('/jobs-list');
      }, 2000);
    } catch (error) {
      console.error('Error adding job:', error);
      setErrors({ form: 'Failed to add job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Job</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {errors.form && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Company</option>

                  {companies.map((company) => (
                    <option
                      key={company._id || company.id}
                      value={company.companyName}
                    >
                      {company.companyName}
                    </option>
                  ))}
                </select>
                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="e.g., $100,000 - $150,000 per year"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level
                </label>
                <select
                  id="experience"
                  name="experience"
                  className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="">Select Experience</option>
                  <option value="0 Years (Fresher)">0 Years (Fresher)</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-7 Years">5-7 Years</option>
                  <option value="7-10 Years">7-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                placeholder="Describe the job responsibilities, requirements, and benefits"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="List required skills, education, and experience"
                value={formData.requirements}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Benefits
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="List benefits like health insurance, 401k, remote work, etc."
                value={formData.benefits}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/jobs-list')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? 'Adding...' : 'Add Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;