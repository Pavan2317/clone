export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateJobData = (jobData) => {
  const errors = {};

  if (!jobData.title || jobData.title.trim().length < 3) {
    errors.title = 'Job title must be at least 3 characters';
  }

  if (!jobData.description || jobData.description.trim().length < 10) {
    errors.description = 'Job description must be at least 10 characters';
  }

  if (!jobData.location || jobData.location.trim().length < 2) {
    errors.location = 'Location must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCompanyData = (companyData) => {
  const errors = {};

  if (!companyData.companyName || companyData.companyName.trim().length < 2) {
    errors.companyName = 'Company name must be at least 2 characters';
  }

  if (!companyData.website || !/^https?:\/\/.+\..+/.test(companyData.website)) {
    errors.website = 'Please enter a valid website URL (e.g., https://example.com)';
  }

  if (!companyData.location || companyData.location.trim().length < 2) {
    errors.location = 'Location must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
