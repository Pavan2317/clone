// Load companies from localStorage on initialization
let companies = JSON.parse(localStorage.getItem('companies') || '[]');

// Save companies to localStorage
const saveCompaniesToStorage = () => {
  localStorage.setItem('companies', JSON.stringify(companies));
};

export const getCompanies = () => {
  return Promise.resolve([...companies]);
};

export const getCompanyById = (id) => {
  return Promise.resolve(companies.find(company => company.id === id));
};

export const addCompany = (companyData) => {
  const newCompany = {
    id: Date.now().toString(),
    ...companyData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  companies.push(newCompany);
  saveCompaniesToStorage();
  return Promise.resolve(newCompany);
};

export const updateCompany = (id, updatedData) => {
  const index = companies.findIndex(company => company.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Company not found'));
  }

  const updatedCompany = {
    ...companies[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };

  companies[index] = updatedCompany;
  saveCompaniesToStorage();
  return Promise.resolve(updatedCompany);
};

export const deleteCompany = (id) => {
  const initialLength = companies.length;
  companies = companies.filter(company => company.id !== id);
  saveCompaniesToStorage();

  if (companies.length === initialLength) {
    return Promise.reject(new Error('Company not found'));
  }

  return Promise.resolve({ success: true });
};

// Search companies by keyword
export const searchCompanies = (keyword) => {
  if (!keyword) return Promise.resolve([...companies]);

  const lowerKeyword = keyword.toLowerCase();
  return Promise.resolve(companies.filter(company =>
    company.companyName.toLowerCase().includes(lowerKeyword) ||
    company.location.toLowerCase().includes(lowerKeyword) ||
    company.website.toLowerCase().includes(lowerKeyword)
  ));
};
