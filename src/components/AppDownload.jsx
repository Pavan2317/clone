import React from 'react';

const AppDownload = () => {
  return (
    <section className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Search jobs anytime, anywhere</h2>
            <p className="text-lg mb-8">Download our mobile app and find your dream job on the go.</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition duration-300">
                <span className="mr-2">🍎</span>
                Download on App Store
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition duration-300">
                <span className="mr-2">▶️</span>
                Get it on Google Play
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-6xl">📱</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;