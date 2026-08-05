const APPLICATIONS_KEY = "applications";

const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading applications from localStorage:", error);
    return [];
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving applications to localStorage:", error);
  }
};

export const getApplications = async () => {
  const apps = getStorage(APPLICATIONS_KEY);
  return Array.isArray(apps) ? apps : [];
};

export const getApplicationsByCandidate = async (candidateId) => {
  const apps = await getApplications();
  const safeApps = Array.isArray(apps) ? apps : [];
  return safeApps.filter(
    (app) => app.candidateId === candidateId || app.userId === candidateId
  );
};

export const addApplication = async (applicationData) => {
  const apps = await getApplications();
  const safeApps = Array.isArray(apps) ? apps : [];
  
  const newApp = {
    id: Date.now().toString(),
    ...applicationData,
    appliedAt: new Date().toISOString(),
    status: applicationData.status || "Pending",
  };

  safeApps.push(newApp);
  setStorage(APPLICATIONS_KEY, safeApps);
  return newApp;
};

export const updateApplicationStatus = async (id, status) => {
  const apps = await getApplications();
  const safeApps = Array.isArray(apps) ? apps : [];
  
  const updatedApps = safeApps.map((app) => {
    if (app.id === id || app._id === id) {
      return { ...app, status };
    }
    return app;
  });

  setStorage(APPLICATIONS_KEY, updatedApps);
  return updatedApps;
};