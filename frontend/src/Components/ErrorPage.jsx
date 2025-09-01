import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition duration-300"
        >
          <FaArrowLeft className="mr-2" /> Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
