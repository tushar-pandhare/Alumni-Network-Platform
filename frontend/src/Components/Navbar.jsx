import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";

const navLinks = [
  { to: "/home", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/jobs", label: "Jobs" },
  { to: "/mentors", label: "Mentors" },
  // { to: "/community", label: "Community" },
  { to: "/stories", label: "Alumni Stories" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
  }
  const profileImage = user?.imageUrl || null;

  useEffect(() => {
    setMenuOpen(false); // Close menu on route change
    setProfileDropdown(false);
  }, [location]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileDropdown) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileDropdown]);

  const navLinkClass = ({ isActive }) =>
    `relative transition-colors text-sm font-semibold px-2 py-1
      ${isActive ? "text-blue-500" : "text-white hover:text-blue-400"}
      `;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  return (
    <nav className="fixed w-full z-50 bg-white/10 backdrop-blur-lg border-b border-indigo-100/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => navigate("/home")}
          >
            <span className="text-2xl font-extrabold text-blue-500 tracking-wide drop-shadow">
              Alumni<span className="text-indigo-400">Connect</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-2 items-center">
            {navLinks.map((nav) => (
              <NavLink key={nav.to} to={nav.to} className={navLinkClass}>
                {({ isActive }) => (
                  <span className="relative">
                    {nav.label}
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 rounded transition-all"></span>
                    )}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Profile/Logout */}
            {profileImage ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <img
                  src={profileImage}
                  alt="Profile"
                  onClick={() => setProfileDropdown((v) => !v)}
                  className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover cursor-pointer hover:scale-105 transition-transform shadow"
                />
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white/90 rounded-xl shadow-xl border border-indigo-100/60 py-2 z-50 animate-fadeIn">
                    <button
                      onClick={() => {
                        setProfileDropdown(false);
                        navigate("/profileview");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-indigo-700 hover:bg-indigo-50 transition rounded-t-xl"
                    >
                      <User size={18} /> View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition rounded-b-xl"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-2 rounded-full text-white text-sm font-semibold transition shadow"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-4 bg-white/90 rounded-xl shadow-xl border border-indigo-100/60 py-4 animate-fadeIn">
            <div className="flex flex-col items-start space-y-3 px-4">
              {navLinks.map((nav) => (
                <NavLink
                  key={nav.to}
                  to={nav.to}
                  className={navLinkClass}
                  onClick={toggleMenu}
                >
                  {nav.label}
                </NavLink>
              ))}

              {profileImage ? (
                <div className="flex items-center gap-3 mt-2 w-full">
                  <img
                    src={profileImage}
                    alt="Profile"
                    onClick={() => {
                      toggleMenu();
                      navigate("/profileview");
                    }}
                    className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover cursor-pointer hover:scale-105 transition"
                  />
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-sm text-red-400 hover:text-red-500 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-2 rounded-full text-white text-sm font-semibold transition w-full text-center mt-2"
                >
                  Logout
                </button>
              )}
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

export default Navbar;
