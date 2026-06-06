
// import { Link, useNavigate } from "react-router-dom";
// import {

// // ... all imports remain same

// const AlumniNavbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {

//   const logout = () => {
//     localStorage.removeItem("token");

//   return (

//           {}
//           <div className="hidden md:flex items-center space-x-6 lg:space-x-8">

//             {}
//             <div className="relative" ref={toolsRef}>

//             {}
//             <Link

//           {}
//           <div className="md:hidden">

//       {}
//       {isMenuOpen && (

//             <div className="pt-4 border-t border-indigo-600/30 space-y-1">

//             <Link
//               to="/alumni-profile-page"

// export default AlumniNavbar;

import { Link, useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaCalendarPlus,
  FaBriefcase,
  FaHandshake,
  FaUsers,
  FaDonate,
  FaBookOpen,
  FaLightbulb,
  FaComments,
  FaNewspaper,
  FaChevronDown,
  FaTimes,
  FaBars,
  FaHome,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./pages/firebase";

const AlumniNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const navigate = useNavigate();
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ FIX #11: Properly sign out from Firebase AND clear localStorage
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-indigo-100/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          {}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/home')}>
            <FaUserGraduate className="h-8 w-8 text-indigo-600 drop-shadow" />
            <span className="text-2xl font-extrabold text-indigo-800 tracking-wide drop-shadow">
              Alumni<span className="text-blue-500">Connect</span>
            </span>
          </div>

          {}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/home" className="relative transition-colors text-sm font-semibold px-2 py-1 text-indigo-800 hover:text-blue-500">
              <FaHome className="inline mr-2" />
              Home
            </Link>
            <Link to="/events/manage" className="relative transition-colors text-sm font-semibold px-2 py-1 text-indigo-800 hover:text-blue-500">
              <FaCalendarPlus className="inline mr-2" />
              Events
            </Link>
            <Link to="/jobs/manage" className="relative transition-colors text-sm font-semibold px-2 py-1 text-indigo-800 hover:text-blue-500">
              <FaBriefcase className="inline mr-2" />
              Jobs
            </Link>
            <Link to="/alumni/mentorship-hub" className="relative transition-colors text-sm font-semibold px-2 py-1 text-indigo-800 hover:text-blue-500">
              <FaHandshake className="inline mr-2" />
              Mentorship
            </Link>
            <Link to="/alumni-directory" className="relative transition-colors text-sm font-semibold px-2 py-1 text-indigo-800 hover:text-blue-500">
              <FaUsers className="inline mr-2" />
              Directory
            </Link>

            {}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center text-indigo-800 hover:text-blue-500 px-3 py-2 transition-colors rounded-lg"
              >
                More{" "}
                <FaChevronDown className={`ml-2 text-sm transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>
              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-indigo-100/80 z-50 animate-fadeIn">
                  <div className="p-2 space-y-1">
                    {}
                    <Link to="/alumni-stories" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaBookOpen className="mr-3" /> Stories
                    </Link>
                    {}
                    <Link to="/alumni/feedback-forum" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaComments className="mr-3" /> Feedback
                    </Link>
                    {}
                    <Link to="/alumni-community" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaUsers className="mr-3" /> Community
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {}
            <Link
              to="/alumni-profile-page"
              className="ml-4 text-indigo-800 hover:text-blue-500 transition-colors transform hover:scale-110"
              title="Profile"
            >
              <FaUserGraduate className="h-6 w-6" />
            </Link>
            <button
              onClick={logout}
              className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 px-6 py-2 rounded-full text-white text-sm font-semibold transition shadow ml-4"
            >
              Logout
            </button>
          </div>

          {}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-indigo-800"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-indigo-100/80 py-4 animate-fadeIn">
            <div className="flex flex-col items-start space-y-3 px-4">
              <Link to="/home" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaHome className="inline mr-3" /> Home
              </Link>
              <Link to="/events/manage" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaCalendarPlus className="inline mr-3" /> Events
              </Link>
              <Link to="/jobs/manage" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaBriefcase className="inline mr-3" /> Jobs
              </Link>
              <Link to="/alumni/mentorship-hub" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaHandshake className="inline mr-3" /> Mentorship
              </Link>
              <Link to="/alumni-directory" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaUsers className="inline mr-3" /> Directory
              </Link>
              {}
              <Link to="/alumni-stories" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaBookOpen className="inline mr-3" /> Stories
              </Link>
              {}
              <Link to="/alumni/feedback-forum" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaComments className="inline mr-3" /> Feedback
              </Link>
              
              <Link to="/alumni-community" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaUsers className="inline mr-3" /> Community
              </Link>
              <Link
                to="/alumni-profile-page"
                className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserGraduate className="inline mr-3" /> Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 px-6 py-2 rounded-full text-white text-sm font-semibold transition w-full text-center mt-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      {}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-16px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </nav>
  );
};

export default AlumniNavbar;