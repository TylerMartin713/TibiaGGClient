import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("TibiaGG_token");
    navigate("/login");
    closeMenu();
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-emerald-400 text-xl font-bold hover:text-emerald-300 transition-colors duration-200"
              onClick={closeMenu}
            >
              TibiaGG
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/hunting-places"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-400 bg-gray-800"
                    : "text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
                }`
              }
            >
              Hunting Places
            </NavLink>
            <NavLink
              to="/quest-guides"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-400 bg-gray-800"
                    : "text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
                }`
              }
            >
              Quest Guides
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-400 bg-gray-800"
                    : "text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
                }`
              }
            >
              Profile
            </NavLink>

            {/* Auth Section */}
            {localStorage.getItem("TibiaGG_token") !== null ? (
              <button
                onClick={handleLogout}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <NavLink
                  to="/login"
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-emerald-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
          <NavLink
            to="/hunting-places"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive
                  ? "text-emerald-400 bg-gray-700"
                  : "text-gray-300 hover:text-emerald-400 hover:bg-gray-700"
              }`
            }
            onClick={closeMenu}
          >
            Hunting Places
          </NavLink>
          <NavLink
            to="/quest-guides"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive
                  ? "text-emerald-400 bg-gray-700"
                  : "text-gray-300 hover:text-emerald-400 hover:bg-gray-700"
              }`
            }
            onClick={closeMenu}
          >
            Quest Guides
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive
                  ? "text-emerald-400 bg-gray-700"
                  : "text-gray-300 hover:text-emerald-400 hover:bg-gray-700"
              }`
            }
            onClick={closeMenu}
          >
            Profile
          </NavLink>

          {/* Mobile Auth Section */}
          <div className="border-t border-gray-700 pt-4">
            {localStorage.getItem("TibiaGG_token") !== null ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-1">
                <NavLink
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-700 transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
