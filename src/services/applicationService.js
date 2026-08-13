import axios from "axios";
import { getItem, setItem } from "../utils/storage";

// Update port 5000 if your backend runs on a different port
const API_URL = "http://localhost:5000/api/applications";

// Helper function to attach JWT Token to requests safely using storage utility
const getAuthHeader = () => {
  const token = getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
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
      const candidateId = user.id || user._id;
      if (!candidateId) {
        console.warn("Candidate ID is missing, skipping API call to avoid 'undefined'");
        return getItem("applications", []);
      }

      const response = await axios.get(
        `${API_URL}/candidate/${candidateId}`,
        getAuthHeader()
      );
      setItem("applications", response.data);
      return response.data;
    }

    // Admin / employer / company: fetch all applications
    const response = await axios.get(API_URL, getAuthHeader());
    setItem("applications", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications from MongoDB, checking local storage:", error);
    return getItem("applications", []);
  }
};

/**
 * Get applications for a specific candidate
 */
export const getApplicationsByCandidateId = async (candidateId) => {
  if (!candidateId) {
    console.warn("getApplicationsByCandidateId called with missing/undefined ID");
    return [];
  }

  try {
    const response = await axios.get(
      `${API_URL}/candidate/${candidateId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate applications, checking local storage:", error);
    const allApps = getItem("applications", []);
    return allApps.filter(app => app.candidateId === candidateId || app.userId === candidateId);
  }
};

// Alias for candidate-specific calls
export const getApplicationsByCandidate = getApplicationsByCandidateId;

/**
 * Get applications for a specific company
 */
export const getApplicationsByCompanyId = async (companyId) => {
  if (!companyId) {
    console.warn("getApplicationsByCompanyId called with missing/undefined ID");
    return [];
  }

  try {
    const response = await axios.get(
      `${API_URL}/company/${companyId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company applications, checking local storage:", error);
    const allApps = getItem("applications", []);
    return allApps.filter(app => app.companyId === companyId);
  }
};

/**
 * Add a new application
 */
export const addApplication = async (applicationData) => {
  try {
    const response = await axios.post(API_URL, applicationData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error adding application, saving locally:", error);
    
    // Save locally so the action doesn't break user flow
    const localApps = getItem("applications", []);
    const newApp = { ...applicationData, _id: Date.now().toString(), status: "Pending" };
    localApps.push(newApp);
    setItem("applications", localApps);
    
    return newApp;
  }
};

// Alias export for components importing 'createApplication'
export const createApplication = addApplication;

/**
 * Retrieve a specific application by its ID
 */
export const getApplicationById = async (id) => {
  if (!id) {
    console.warn("getApplicationById called with missing/undefined ID");
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching application from server:", error);
    const localApps = getItem("applications", []);
    return localApps.find(app => (app._id === id || app.id === id)) || null;
  }
};

/**
 * Update application status in MongoDB
 */
export const updateApplicationStatus = async (id, status) => {
  if (!id) {
    console.warn("updateApplicationStatus called with missing/undefined ID");
    return null;
  }

  try {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating application status, applying local fallback:", error);
    
    const localApps = getItem("applications", []);
    const updatedApps = localApps.map(app => 
      (app._id === id || app.id === id) ? { ...app, status } : app
    );
    setItem("applications", updatedApps);
    
    return { _id: id, status, updatedLocally: true };
  }
};

/**
 * Delete an application by ID
 */
export const deleteApplication = async (id) => {
  if (!id) {
    console.warn("deleteApplication called with missing/undefined ID");
    return null;
  }

  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error deleting application, applying local fallback:", error);
    
    const localApps = getItem("applications", []);
    const updatedApps = localApps.filter(app => app._id !== id && app.id !== id);
    setItem("applications", updatedApps);
    
    return { success: true, id, deletedLocally: true };
  }
};

// Alias export for components importing 'getUserApplications'
export const getUserApplications = getApplications;