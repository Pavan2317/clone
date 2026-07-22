import React from 'react';
import { categories } from '../data/categories';

const PopularCategories = () => {
  return (
<section className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Popular Job Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
className="bg-white dark:bg-gray-800 border dark:border-gray-700 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
<p className="text-sm text-gray-600 dark:text-gray-300">{category.jobs} jobs available</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;