import axios from "axios";

// Update port 5000 if your backend runs on a different port
const API_URL = "http://localhost:5000/api/applications";

// Helper function to attach JWT Token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Get all applications for a user based on role
 * - admin / employer / company: fetch all applications
 * - candidate: fetch applications specific to the candidate
 */
export const getApplications = async (user) => {
  try {
    if (user?.role === "candidate" || user?.role === "applicant" || user?.role === "jobSeeker") {
      const response = await axios.get(
        `${API_URL}/candidate/${user.id || user._id}`,
        getAuthHeader()
      );
      return response.data;
    }

    // Admin / employer / company: fetch all applications
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching applications from MongoDB:", error);
    return [];
  }
};

/**
 * Get applications for a specific candidate
 */
export const getApplicationsByCandidateId = async (candidateId) => {
  try {
    const response = await axios.get(
      `${API_URL}/candidate/${candidateId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    return [];
  }
};

// Alias for candidate-specific calls
export const getApplicationsByCandidate = getApplicationsByCandidateId;

/**
 * Get applications for a specific company
 */
export const getApplicationsByCompanyId = async (companyId) => {
  try {
    const response = await axios.get(
      `${API_URL}/company/${companyId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company applications:", error);
    return [];
  }
};

/**
 * Add a new application (MongoDB creates the real _id)
 */
export const addApplication = async (applicationData) => {
  try {
    const response = await axios.post(API_URL, applicationData, getAuthHeader());
    return response.data; // Returned object has real MongoDB _id
  } catch (error) {
    console.error("Error adding application:", error);
    throw error;
  }
};

// Alias export for components importing 'createApplication'
export const createApplication = addApplication;

/**
 * Retrieve a specific application by its ID
 */
export const getApplicationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching application:", error);
    return null;
  }
};

/**
 * Update application status in MongoDB
 */
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

/**
 * Delete an application by ID
 */
export const deleteApplication = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

// Alias export for components importing 'getUserApplications'
export const getUserApplications = getApplications;

