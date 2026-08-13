import axios from 'axios';

// Change this base URL to match your backend port (e.g., http://localhost:5000/api)
const API_BASE_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
  try {
    // This axios line forces the browser to make a REAL Network API call
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    // This axios line forces the browser to make a REAL Network API call
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return { success: true, user: response.data.user || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('token');
  return { success: true };
};