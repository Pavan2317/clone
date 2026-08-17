const COMPANIES_KEY = "companies";

const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading companies from localStorage:", error);
    return [];
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving companies to localStorage:", error);
  }
};

export const getCompanies = async () => {
  const companies = getStorage(COMPANIES_KEY);
  return Array.isArray(companies) ? companies : [];
};

export const getCompanyById = async (id) => {
  const companies = await getCompanies();
  return companies.find((c) => c.id === id || c._id === id) || null;
};

export const addCompany = async (companyData) => {
  const companies = await getCompanies();
  const newCompany = {
    id: Date.now().toString(),
    ...companyData,
    createdAt: new Date().toISOString(),
  };
  companies.push(newCompany);
  setStorage(COMPANIES_KEY, companies);
  return newCompany;
};

export const updateCompany = async (id, companyData) => {
  const companies = await getCompanies();
  const updatedCompanies = companies.map((c) =>
    c.id === id || c._id === id ? { ...c, ...companyData } : c
  );
  setStorage(COMPANIES_KEY, updatedCompanies);
  return updatedCompanies;
};

export const deleteCompany = async (id) => {
  const companies = await getCompanies();
  const updatedCompanies = companies.filter(
    (c) => c.id !== id && c._id !== id
  );
  setStorage(COMPANIES_KEY, updatedCompanies);
  return updatedCompanies;
};
