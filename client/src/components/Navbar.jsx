import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import SearchAutocomplete from "../components/SearchAutocomplete";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

export default function Navbar() {
  const { user, logout, setAuthModal } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  

return (
  <>
    <nav
      className={`
        w-full px-6 py-3 fixed top-0 left-0 z-40 transition-all
        ${isLanding ? "bg-transparent text-white" : "bg-white shadow-md"}
      `}
    >
      <div className="flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-green-600">
          OutsideR
        </Link>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-4">

          {/* SEARCH ICON — NOT ON LANDING */}
          {!isLanding && (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Search"
            >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-gray-700"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
            </button>
          )}

          {!user ? (
            <>
              <button
                onClick={() => setAuthModal("login")}
                className="hover:text-green-600"
              >
                Login
              </button>

              <button
                onClick={() => setAuthModal("register")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative flex">

              <Link
                to="/activities/create"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
              >
                New Activity
              </Link>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/40"}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
                <span className="text-sm font-medium">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg text-gray-700 rounded-lg p-2 z-50">
                  <Link to="/profile" className="block px-3 py-2 hover:bg-gray-100">Profile</Link>
                  
                  <Link to="/settings" className="block px-3 py-2 hover:bg-gray-100">Settings</Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE RIGHT */}
        <div className="md:hidden flex items-center gap-4">

          {/* SEARCH ICON — NOT ON LANDING */}
          {!isLanding && (
            <button onClick={() => setSearchOpen(true)}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-gray-700"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
            </button>
          )}

          {/* HAMBURGER */}
          <button onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>
      </div>
    </nav>

    {/* ================= SEARCH OVERLAY ================= */}
    {searchOpen && (
      <div className="fixed inset-0 z-[60]">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSearchOpen(false)}
        />

        {/* Search container */}
        <div className="relative bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xl"
            >
              ←
            </button>

            <div className="flex-1">
              <SearchAutocomplete autoFocus />
            </div>
          </div>
        </div>
      </div>
    )}


    {/* ================= MOBILE SIDE DRAWER ================= */}
    {menuOpen && (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setMenuOpen(false)}
        />

        <div className="absolute right-0 top-0 h-full w-50 bg-white shadow-xl p-4">
          {!user ? (
            <div className="flex flex-col gap-4">
              <button onClick={() => setAuthModal("login")}>Login</button>
              <button
                onClick={() => setAuthModal("register")}
                className="bg-green-600 text-white py-2 rounded"
              >
                Sign Up
              </button>
            </div>
          ) : (

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 ">
                <img
                    src={user.avatar || "https://i.pravatar.cc/40"}
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />
                  <span className="text-sm font-medium ">
                    {user.name}
                  </span>
              </div>
              <Link
                to="/activities/create"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
              >
                New Activity
              </Link>
              <Link to="/profile">Profile</Link>
              
              <Link to="/settings">Settings</Link>
              <button onClick={logout} className="text-left">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);
}
