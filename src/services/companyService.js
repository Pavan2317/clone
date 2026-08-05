import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get all companies
export const getCompanies = async () => {
  const response = await axios.get(`${API_URL}/companies`);
  return response.data;
};

// Get company by ID
export const getCompanyById = async (id) => {
  const response = await axios.get(`${API_URL}/companies/${id}`);
  return response.data;
};

// Add company
export const addCompany = async (companyData) => {
  const response = await axios.post(`${API_URL}/companies`, companyData);
  return response.data;
};

// Update company
export const updateCompany = async (id, companyData) => {
  const response = await axios.put(`${API_URL}/companies/${id}`, companyData);
  return response.data;
};

// Delete company
export const deleteCompany = async (id) => {
  const response = await axios.delete(`${API_URL}/companies/${id}`);
  return response.data;
};

// Search companies
export const searchCompanies = async (keyword) => {
  const response = await axios.get(`${API_URL}/companies`);

  if (!keyword) return response.data;

  return response.data.filter(company =>
    (company.companyName || "").toLowerCase().includes(keyword.toLowerCase()) ||
    (company.location || "").toLowerCase().includes(keyword.toLowerCase()) ||
    (company.website || "").toLowerCase().includes(keyword.toLowerCase())
  );
};