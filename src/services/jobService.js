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
    console.error("Error saving jobs to localStorage:", error);
  }
};

export const getJobs = async () => {
  const jobs = getStorage(JOBS_KEY);
  return Array.isArray(jobs) ? jobs : [];
};

export const getJobById = async (id) => {
  const jobs = await getJobs();
  if (!id) return null;

  return (
    jobs.find((j) => {
      const targetId = String(id).trim();
      return (
        String(j.id) === targetId ||
        String(j._id) === targetId ||
        String(j.jobId) === targetId ||
        (j._id && String(j._id.$oid || j._id) === targetId)
      );
    }) || null
  );
};

export const addJob = async (jobData) => {
  const jobs = await getJobs();
  const newJob = {
    id: jobData.id || jobData._id || Date.now().toString(),
    ...jobData,
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  setStorage(JOBS_KEY, jobs);
  return newJob;
};

export const updateJob = async (id, jobData) => {
  const jobs = await getJobs();
  const updatedJobs = jobs.map((j) => {
    const targetId = String(id).trim();
    if (
      String(j.id) === targetId ||
      String(j._id) === targetId ||
      String(j.jobId) === targetId
    ) {
      return { ...j, ...jobData };
    }
    return j;
  });
  setStorage(JOBS_KEY, updatedJobs);
  return updatedJobs;
};

export const deleteJob = async (id) => {
  const jobs = await getJobs();
  const updatedJobs = jobs.filter((j) => {
    const targetId = String(id).trim();
    return (
      String(j.id) !== targetId &&
      String(j._id) !== targetId &&
      String(j.jobId) !== targetId
    );
  });
  setStorage(JOBS_KEY, updatedJobs);
  return updatedJobs;
};
