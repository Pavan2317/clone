import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCompanies } from "../services/companyService";

const FeaturedCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setCompanies(data);
        } else if (data && Array.isArray(data.companies)) {
          setCompanies(data.companies);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        console.error("Error loading featured companies:", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Safe array handling
  const safeCompanies = Array.isArray(companies) ? companies : [];

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        Loading featured companies...
      </div>
    );
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Featured Companies
        </h2>

        {safeCompanies.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No companies found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {safeCompanies.slice(0, 4).map((company, index) => {
              const companyId = company.id || company._id || `company-${index}`;
              return (
                <div
                  key={companyId}
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg text-center bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {company.name || company.companyName || "Company"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {company.location || "Global"}
                  </p>
                  <Link
                    to={`/companies/${companyId}`}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCompanies;
