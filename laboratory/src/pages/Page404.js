import React from 'react'
import { Link } from 'react-router-dom';
// import { FaFlask } from 'react-icons/fa';
function Page404() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="flex flex-col items-center">
        {/* <FaFlask className="text-6xl text-blue-600 mb-4" /> */}
        <h1 className="text-8xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Oops! Page Not Found</h2>
        <p className="text-lg text-center mb-8 max-w-md">
          It seems like you're lost in the lab! The page you're looking for is not available.
          Let's get you back to work.
        </p>
        <Link 
          to="/" 
          style={{
            background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
          }}
            className="rounded text-lg font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
        >
         Go back
        </Link>
      </div>
    </div>
  );
};

export default Page404
