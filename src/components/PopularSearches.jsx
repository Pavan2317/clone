import React from 'react';

const PopularSearches = () => {
  const searches = [
    'React Developer', 'Java', 'Python', 'UI Designer',
    'Full Stack', 'Data Analyst', 'DevOps', 'Remote Jobs'
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Searches</h2>
        <div className="flex flex-wrap gap-3">
          {searches.map((search, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition duration-300"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;