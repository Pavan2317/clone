import {
  getUserByUsername,
  saveCurrentUser,
  removeCurrentUser,
  userExists,
  addUser
} from './storage';
import { validateEmail, validatePassword, validateName } from './validation';

export const loginUser = async (username, password) => {
  try {
    const user = getUserByUsername(username);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    saveCurrentUser(user);
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerUser = async (userData) => {
  try {
    // Validate form data
    if (!validateName(userData.name)) {
      return { success: false, error: 'Name must be at least 2 characters' };
    }

    if (!validateEmail(userData.email)) {
      return { success: false, error: 'Please enter a valid email' };
    }

    if (!validatePassword(userData.password)) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (userData.password !== userData.confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    // Check if username already exists
    if (userExists(userData.email)) {
      return { success: false, error: 'Username already exists' };
    }

    // Create user object
    const newUser = {
      id: Date.now().toString(),
      username: userData.email,
      name: userData.name,
      password: userData.password,
      role: userData.role,
      createdAt: new Date().toISOString()
    };

    // Save user
    addUser(newUser);
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
};

export const logoutUser = () => {
  try {
    removeCurrentUser();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed' };
  }
};
