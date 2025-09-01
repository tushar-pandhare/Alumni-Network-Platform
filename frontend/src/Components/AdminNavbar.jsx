// Components/AdminNavbar.jsx
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">Alumni Portal</span>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/mentorship" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md">
              Mentorship
            </Link>
            <Link to="/directory" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md">
              Directory
            </Link>
            <Link to="/donate" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md">
              Donations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;