const APPLICATIONS_KEY = 'applications';

// Helper function to safely fetch applications from local storage
const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Helper function to safely write applications to local storage
const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * Fetch applications filtered by current user role
 */
export const getApplications = async (user) => {
  const apps = getStorage(APPLICATIONS_KEY);

  if (!user) return [];

  // Candidate View: Filter applications submitted by the candidate
  if (user.role === 'candidate') {
    return apps.filter(
      (app) =>
        app.candidateId === user.id ||
        app.candidateId === user._id ||
        (user.email && app.candidateEmail === user.email)
    );
  }

  // Company / Employer View: Filter applications for jobs posted by this company
  if (user.role === 'company' || user.role === 'employer') {
    return apps.filter(
      (app) =>
        app.companyId === user.id ||
        app.companyId === user._id ||
        (app.company && user.name && app.company.toLowerCase() === user.name.toLowerCase()) ||
        (app.company && user.companyName && app.company.toLowerCase() === user.companyName.toLowerCase())
    );
  }

  // Admin View: Return all applications
  return apps;
};

/**
 * Fetch applications by candidate ID
 */
export const getApplicationsByCandidateId = async (candidateId) => {
  const apps = getStorage(APPLICATIONS_KEY);
  return apps.filter(
    (app) => app.candidateId === candidateId || app.candidateId === candidateId?._id
  );
};

/**
 * Fetch applications by company ID
 */
export const getApplicationsByCompanyId = async (companyId) => {
  const apps = getStorage(APPLICATIONS_KEY);
  return apps.filter(
    (app) => app.companyId === companyId || app.companyId === companyId?._id
  );
};

// Alias exports for candidate-specific calls
export const getUserApplications = getApplications;

/**
 * Save a new application to local storage
 */
export const addApplication = async (applicationData) => {
  const apps = getStorage(APPLICATIONS_KEY);
  const newApp = {
    id: Date.now().toString(),
    ...applicationData,
    createdAt: new Date().toISOString(),
  };
  apps.push(newApp);
  setStorage(APPLICATIONS_KEY, apps);
  return newApp;
};

// Alias export for components importing 'createApplication'
export const createApplication = addApplication;

/**
 * Retrieve a specific application by its ID
 */
export const getApplicationById = async (id) => {
  const apps = getStorage(APPLICATIONS_KEY);
  return apps.find((app) => app.id === id || app._id === id) || null;
};

/**
 * Update an application status (e.g., 'pending', 'accepted', 'rejected')
 */
export const updateApplicationStatus = async (id, status) => {
  const apps = getStorage(APPLICATIONS_KEY);
  const updatedApps = apps.map((app) => {
    if (app.id === id || app._id === id) {
      return { ...app, status, updatedAt: new Date().toISOString() };
    }
    return app;
  });
  setStorage(APPLICATIONS_KEY, updatedApps);
  return true;
};

/**
 * Delete an application by ID
 */
export const deleteApplication = async (id) => {
  const apps = getStorage(APPLICATIONS_KEY);
  const filteredApps = apps.filter((app) => app.id !== id && app._id !== id);
  setStorage(APPLICATIONS_KEY, filteredApps);
  return true;
};