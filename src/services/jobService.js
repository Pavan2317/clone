import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get all jobs
export const getJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};

// Get job by ID
export const getJobById = async (id) => {
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};

// Add job
export const addJob = async (jobData) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

// Update job
export const updateJob = async (id, jobData) => {
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (id) => {
  const response = await axios.delete(`${API_URL}/jobs/${id}`);
  return response.data;
};

// Get jobs by company
export const getJobsByCompany = async (companyId) => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data.filter(job => job.companyId === companyId);
};

// Search jobs
export const searchJobs = async (keyword) => {
  const response = await axios.get(`${API_URL}/jobs`);

  if (!keyword) return response.data;

  return response.data.filter(job =>
    job.title.toLowerCase().includes(keyword.toLowerCase()) ||
    (job.company || "").toLowerCase().includes(keyword.toLowerCase()) ||
    job.location.toLowerCase().includes(keyword.toLowerCase())
  );
};
