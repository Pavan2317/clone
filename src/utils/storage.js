// src/utils/storage.js

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// User-specific storage functions
export const getUsers = () => {
  return getItem('users') || [];
};

export const saveUsers = (users) => {
  return setItem('users', users);
};

export const getCurrentUser = () => {
  return getItem('currentUser');
};

export const saveCurrentUser = (user) => {
  return setItem('currentUser', user);
};

export const removeCurrentUser = () => {
  return removeItem('currentUser');
};

export const userExists = (username) => {
  const users = getUsers();
  return users.some(user => user.username === username);
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  return saveUsers(users);
};

export const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.username === username);
};
