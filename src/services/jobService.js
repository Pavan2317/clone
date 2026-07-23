// Load jobs from localStorage on initialization
let jobs = JSON.parse(localStorage.getItem('jobs') || '[]');

// Save jobs to localStorage
const saveJobsToStorage = () => {
  localStorage.setItem('jobs', JSON.stringify(jobs));
};

export const getJobs = () => {
  return Promise.resolve([...jobs]);
};

export const getJobById = (id) => {
  return Promise.resolve(jobs.find(job => job.id === id));
};

export const addJob = (jobData) => {
  const newJob = {
    id: Date.now().toString(),
    ...jobData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  jobs.push(newJob);
  saveJobsToStorage();
  return Promise.resolve(newJob);
};

export const updateJob = (id, updatedData) => {
  const index = jobs.findIndex(job => job.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Job not found'));
  }

  const updatedJob = {
    ...jobs[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };

  jobs[index] = updatedJob;
  saveJobsToStorage();
  return Promise.resolve(updatedJob);
};

export const deleteJob = (id) => {
  const initialLength = jobs.length;
  jobs = jobs.filter(job => job.id !== id);
  saveJobsToStorage();

  if (jobs.length === initialLength) {
    return Promise.reject(new Error('Job not found'));
  }

  return Promise.resolve({ success: true });
};

// Get jobs by company (for company users)
export const getJobsByCompany = (companyId) => {
  return Promise.resolve(jobs.filter(job => job.companyId === companyId));
};

// Search jobs by keyword
export const searchJobs = (keyword) => {
  if (!keyword) return Promise.resolve([...jobs]);

  const lowerKeyword = keyword.toLowerCase();
  return Promise.resolve(jobs.filter(job =>
    job.title.toLowerCase().includes(lowerKeyword) ||
    job.company.toLowerCase().includes(lowerKeyword) ||
    job.location.toLowerCase().includes(lowerKeyword) ||
    job.description.toLowerCase().includes(lowerKeyword)
  ));
};
