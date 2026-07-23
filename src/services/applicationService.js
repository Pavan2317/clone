// Load applications from localStorage on initialization
let applications = JSON.parse(localStorage.getItem('applications') || '[]');

// Save applications to localStorage
const saveApplicationsToStorage = () => {
  localStorage.setItem('applications', JSON.stringify(applications));
};

export const getApplications = () => {
  return Promise.resolve([...applications]);
};

export const getApplicationById = (id) => {
  return Promise.resolve(applications.find(application => application.id === id));
};

export const addApplication = (applicationData) => {
  const newApplication = {
    id: Date.now().toString(),
    ...applicationData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  applications.push(newApplication);
  saveApplicationsToStorage();
  return Promise.resolve(newApplication);
};

export const updateApplication = (id, updatedData) => {
  const index = applications.findIndex(application => application.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Application not found'));
  }

  const updatedApplication = {
    ...applications[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };

  applications[index] = updatedApplication;
  saveApplicationsToStorage();
  return Promise.resolve(updatedApplication);
};

export const deleteApplication = (id) => {
  const initialLength = applications.length;
  applications = applications.filter(application => application.id !== id);
  saveApplicationsToStorage();

  if (applications.length === initialLength) {
    return Promise.reject(new Error('Application not found'));
  }

  return Promise.resolve({ success: true });
};

// Get applications by job ID (for companies)
export const getApplicationsByJobId = (jobId) => {
  return Promise.resolve(applications.filter(application => application.jobId === jobId));
};

// Get applications by company ID (for companies to see applications for their jobs)
export const getApplicationsByCompanyId = (companyId) => {
  return Promise.resolve(applications.filter(application => application.companyId === companyId));
};

// Get applications by candidate ID (for candidates to see their applications)
export const getApplicationsByCandidateId = (candidateId) => {
  return Promise.resolve(applications.filter(application => application.candidateId === candidateId));
};

// Search applications by keyword
export const searchApplications = (keyword) => {
  if (!keyword) return Promise.resolve([...applications]);

  const lowerKeyword = keyword.toLowerCase();
  return Promise.resolve(applications.filter(application =>
    application.jobTitle.toLowerCase().includes(lowerKeyword) ||
    application.company.toLowerCase().includes(lowerKeyword) ||
    application.candidateName.toLowerCase().includes(lowerKeyword) ||
    application.status.toLowerCase().includes(lowerKeyword)
  ));
};
