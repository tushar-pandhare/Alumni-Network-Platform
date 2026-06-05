
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaUserGraduate,
//   FaCalendarPlus,
//   FaBriefcase,
//   FaHandshake,
//   FaUsers,
//   FaDonate,
//   FaBookOpen,
//   FaLightbulb,
//   FaComments,
//   FaHistory,
//   FaSignOutAlt,
//   FaChevronDown,
//   FaTimes,
//   FaBars,
//   FaHome,
//   FaNewspaper,
// } from "react-icons/fa";
// import { useState, useRef, useEffect } from "react";

// // ... all imports remain same

// const AlumniNavbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isToolsOpen, setIsToolsOpen] = useState(false);
//   const navigate = useNavigate();
//   const toolsRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (toolsRef.current && !toolsRef.current.contains(event.target)) {
//         setIsToolsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-gradient-to-r from-gray-900 to-gray-800 fixed w-full z-50 border-b border-indigo-600 shadow-xl">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Branding */}
//           <div className="flex items-center flex-shrink-0">
//             <Link to="/" className="flex items-center">
//               <FaUserGraduate className="h-8 w-8 text-indigo-400 transform hover:rotate-12 transition-transform" />
//               <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
//                 AlumniConnect
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
//             <Link to="/home" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors group">
//               <FaHome className="mr-2 group-hover:scale-110 transition-transform" />
//               Home
//             </Link>
//             <Link to="/events/manage" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors group">
//               <FaCalendarPlus className="mr-2 group-hover:scale-110 transition-transform" />
//               Events
//             </Link>
//             <Link to="/jobs/manage" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors group">
//               <FaBriefcase className="mr-2 group-hover:scale-110 transition-transform" />
//               Jobs
//             </Link>
//             <Link to="/alumni/mentorship-hub" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors group">
//               <FaHandshake className="mr-2 group-hover:scale-110 transition-transform" />
//               Mentorship
//             </Link>
//             <Link to="/alumni-directory" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors group">
//               <FaUsers className="mr-2 group-hover:scale-110 transition-transform" />
//               Directory
//             </Link>

//             {/* Tools Dropdown */}
//             <div className="relative" ref={toolsRef}>
//               <button
//                 onClick={() => setIsToolsOpen(!isToolsOpen)}
//                 className="flex items-center text-gray-300 hover:text-indigo-300 px-3 py-2 transition-colors"
//               >
//                 More{" "}
//                 <FaChevronDown className={`ml-2 text-sm transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
//               </button>
//               {isToolsOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-2xl border border-indigo-600/20 z-50">
//                   <div className="p-2 space-y-1">
//                     <Link to="/donation-portal" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaDonate className="mr-3" /> Donations
//                     </Link>
//                     <Link to="/alumni-stories" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaBookOpen className="mr-3" /> Stories
//                     </Link>
//                     <Link to="/alumni/startup-zone" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaLightbulb className="mr-3" /> Startups
//                     </Link>
//                     <Link to="/alumni/feedback-forum" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaComments className="mr-3" /> Feedback
//                     </Link>
//                     {/* <Link to="/cultural-archive" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaHistory className="mr-3" /> Archive
//                     </Link> */}
//                     <Link to="/alumni-news" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaNewspaper className="mr-3" /> News
//                     </Link>
//                     <Link to="/alumni-community" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg transition-colors">
//                       <FaUsers className="mr-3" /> Community
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Profile Icon Link */}
//             <Link
//               to="/alumni-profile-page"
//               className="ml-4 text-gray-300 hover:text-indigo-400 transition-colors transform hover:scale-110"
//               title="Profile"
//             >
//               <FaUserGraduate className="h-6 w-6" />
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 text-gray-300 hover:text-indigo-300 focus:outline-none transition-colors"
//             >
//               {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-gray-800 border-t border-indigo-600/30">
//           <div className="px-4 pt-2 pb-4 space-y-2">
//             <Link to="/home" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//               <FaHome className="inline mr-3" /> Home
//             </Link>
//             <Link to="/events/manage" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//               <FaCalendarPlus className="inline mr-3" /> Events
//             </Link>
//             <Link to="/jobs/manage" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//               <FaBriefcase className="inline mr-3" /> Jobs
//             </Link>
//             <Link to="/alumni/mentorship-hub" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//               <FaHandshake className="inline mr-3" /> Mentorship
//             </Link>
//             <Link to="/alumni-directory" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//               <FaUsers className="inline mr-3" /> Directory
//             </Link>

//             <div className="pt-4 border-t border-indigo-600/30 space-y-1">
//               <Link to="/donation-portal" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaDonate className="inline mr-3" /> Donations
//               </Link>
//               <Link to="/alumni-stories" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaBookOpen className="inline mr-3" /> Stories
//               </Link>
//               <Link to="/alumni/startup-zone" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaLightbulb className="inline mr-3" /> Startups
//               </Link>
//               <Link to="/alumni/feedback-forum" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaComments className="inline mr-3" /> Feedback
//               </Link>
//               {/* <Link to="/cultural-archive" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaHistory className="inline mr-3" /> Archive
//               </Link> */}
//               <Link to="/alumni-news" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaNewspaper className="inline mr-3" /> News
//               </Link>
//               <Link to="/alumni-community" className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                 <FaUsers className="inline mr-3" /> Community
//               </Link>
//             </div>

//             <Link
//               to="/alumni-profile-page"
//               className="block px-4 py-3 text-gray-300 hover:bg-indigo-600/10 rounded-lg"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <FaUserGraduate className="inline mr-3" /> Profile
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

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
          {/* Branding */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/home')}>
            <FaUserGraduate className="h-8 w-8 text-indigo-600 drop-shadow" />
            <span className="text-2xl font-extrabold text-indigo-800 tracking-wide drop-shadow">
              Alumni<span className="text-blue-500">Connect</span>
            </span>
          </div>

          {/* Desktop Navigation */}
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

            {/* Tools Dropdown */}
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
                    {/* <Link to="/donation-portal" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaDonate className="mr-3" /> Donations
                    </Link> */}
                    <Link to="/alumni-stories" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaBookOpen className="mr-3" /> Stories
                    </Link>
                    {/* <Link to="/alumni/startup-zone" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaLightbulb className="mr-3" /> Startups
                    </Link> */}
                    <Link to="/alumni/feedback-forum" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaComments className="mr-3" /> Feedback
                    </Link>
                    {/* <Link to="/alumni-news" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaNewspaper className="mr-3" /> News
                    </Link> */}
                    <Link to="/alumni-community" className="flex items-center px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                      <FaUsers className="mr-3" /> Community
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Icon Link */}
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

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
              {/* <Link to="/donation-portal" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaDonate className="inline mr-3" /> Donations
              </Link> */}
              <Link to="/alumni-stories" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaBookOpen className="inline mr-3" /> Stories
              </Link>
              {/* <Link to="/alumni/startup-zone" className="block px-4 py-3 text-indigo-800 hover:bg-indigo-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <FaLightbulb className="inline mr-3" /> Startups
              </Link> */}
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
      {/* Animation keyframes for dropdown */}
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