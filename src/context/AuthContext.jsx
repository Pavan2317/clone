import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser } from '../utils/auth';
import { getCurrentUser } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Normalize user object to ensure both .id and ._id exist
  const formatUser = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      id: userData.id || userData._id,
      _id: userData._id || userData.id
    };
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(formatUser(currentUser));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const result = await loginUser(username, password);

      if (result.success) {
        const normalizedUser = formatUser(result.user);
        setUser(normalizedUser);
        navigate('/dashboard');
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const result = await registerUser(userData);

      if (result.success) {
        navigate('/login');
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed');
      return { success: false, error: 'Logout failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;