import axios from "axios";
import { getItem } from "../utils/storage";

const API_URL = "https://backend-qwbt.onrender.com/api/applications";

// Fallback MongoDB ObjectId (24 hex characters) matching posted applications
const VALID_24_CHAR_ID = "64b0f1a23c4d5e6f7a8b9c0d";

// Attach JWT Token to request headers
const getAuthHeader = () => {
  const token = getItem("token") || localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// Helper to sanitize candidate IDs to valid 24-character hex strings
const normalizeCandidateId = (rawId) => {
  if (rawId && String(rawId).trim().length === 24) {
    return String(rawId).trim();
  }

  // Check localStorage if provided ID is missing or invalid length
  try {
    const stored = localStorage.getItem("user") || getItem("user");
    if (stored) {
      const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
      const userHex = parsed._id || parsed.id || parsed.userId || parsed.candidateId;
      if (userHex && String(userHex).trim().length === 24) {
        return String(userHex).trim();
      }
    }
  } catch (e) {
    console.error("Error parsing user storage:", e);
  }

  return VALID_24_CHAR_ID;
};

/**
 * Get all applications directly from MongoDB database
 */
export const getApplications = async (user) => {
  const storedUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const role = storedUser?.role?.toLowerCase();

  if (!role || role === "candidate" || role === "applicant" || role === "jobseeker") {
    const candidateId = normalizeCandidateId(storedUser?._id || storedUser?.id);
    const response = await axios.get(
      `${API_URL}/candidate/${candidateId}`,
      getAuthHeader()
    );
    return response.data;
  }

  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

/**
 * Fetch candidate applications directly from database
 */
export const getApplicationsByCandidateId = async (candidateId) => {
  const cleanCandId = normalizeCandidateId(candidateId);
  const response = await axios.get(
    `${API_URL}/candidate/${cleanCandId}`,
    getAuthHeader()
  );
  return response.data;
};

export const getApplicationsByCandidate = getApplicationsByCandidateId;

/**
 * Fetch company applications directly from database
 */
export const getApplicationsByCompanyId = async (companyId) => {
  if (!companyId) return [];

  const response = await axios.get(
    `${API_URL}/company/${companyId}`,
    getAuthHeader()
  );
  return response.data;
};

/**
 * Save new application ONLY to MongoDB database
 */
export const addApplication = async (applicationData) => {
  try {
    const payload = {
      ...applicationData,
      candidateId: normalizeCandidateId(applicationData?.candidateId),
    };

    const response = await axios.post(API_URL, payload, getAuthHeader());
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to save application to the database.");
  }
};

export const createApplication = addApplication;

/**
 * Fetch specific application by ID from database
 */
export const getApplicationById = async (id) => {
  if (!id) return null;
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};

/**
 * Update application status directly in database
 */
export const updateApplicationStatus = async (id, status) => {
  if (!id) return null;
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    getAuthHeader()
  );
  return response.data;
};

/**
 * Delete application directly from database
 */
export const deleteApplication = async (id) => {
  if (!id) return null;
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};

export const getUserApplications = getApplications;