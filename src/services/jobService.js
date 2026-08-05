const JOBS_KEY = "jobs";

const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading jobs from localStorage:", error);
    return [];
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing jobs to localStorage:", error);
  }
};

export const getJobs = async () => {
  const jobs = getStorage(JOBS_KEY);
  return Array.isArray(jobs) ? jobs : [];
};

export const getJobById = async (id) => {
  const jobs = await getJobs();
  return jobs.find((job) => job.id === id || job._id === id) || null;
};

export const createJob = async (jobData) => {
  const jobs = await getJobs();
  const newJob = {
    id: Date.now().toString(),
    ...jobData,
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  setStorage(JOBS_KEY, jobs);
  return newJob;
};

export const addJob = createJob;

export const updateJob = async (id, updatedData) => {
  const jobs = await getJobs();
  const index = jobs.findIndex((j) => j.id === id || j._id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedData };
    setStorage(JOBS_KEY, jobs);
    return jobs[index];
  }
  return null;
};

export const deleteJob = async (id) => {
  const jobs = await getJobs();
  const filtered = jobs.filter((j) => j.id !== id && j._id !== id);
  setStorage(JOBS_KEY, filtered);
  return true;
};