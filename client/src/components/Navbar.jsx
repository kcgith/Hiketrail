import { useState , useRef, useEffect} from "react";
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
  const desktopButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDrawerRef = useRef(null);

useEffect(() => {
  if (!menuOpen) return;

  function handleClick(e) {
    // 1. Check if the click was on the hamburger button itself 
    // (to prevent double-toggling)
    if (desktopButtonRef.current?.contains(e.target)) return;
    // if (e.target.closest('button') && e.target.innerText === '☰') return;
    if (e.target.closest('.hamburger-btn')) return;

    // 2. See if the click landed inside either the desktop dropdown OR the mobile drawer
    const insideDesktop = dropdownRef.current?.contains(e.target);
    const insideMobile = mobileDrawerRef.current?.contains(e.target);

    // 3. ONLY close if the click was outside BOTH
    if (!insideDesktop && !insideMobile) {
      setMenuOpen(false);
    }
  }

  // Use 'click' instead of 'mousedown'—mousedown is often too fast 
  // and fires before the Link component can process the 'click' event.
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, [menuOpen]);

return (
  <>
    <nav
      className={`
        w-full px-6 py-3 fixed top-0 left-0 z-40 transition-all
        ${isLanding ? "bg-white/15 backdrop-blur-md" : "bg-white shadow-md"}
      `}
    >
      <div className="flex items-center justify-between">

        {/* LOGO */}
        <div className="flex gap-4 items-center">
          <Link to="/" className="relative inline-block">
      {/* subtle local background for contrast */}
          <span
            className="
              absolute inset-0
              bg-white/40 backdrop-blur-md
              rounded-lg
              -z-10
            "
          />

          {/* brand text */}
          <span
            className="
              relative
              px-2 py-1
              text-2xl font-bold tracking-tight
              text-gray-900
            "
          >
            Outside
            <span className="text-green-800 font-extrabold">R</span>
            <span className="text-red-700">.</span>
          </span>
        </Link>
        <Link to="/home" className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
          Explore
        </Link>
        </div>
        

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
                className="hover:bg-white/10 text-black  bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg"
              >
                Log In
              </button>

              <button
                onClick={() => setAuthModal("register")}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative flex">

              <Link
                to="/activities/create"
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 mr-2"
              >
                New Activity
              </Link>

              <button
                ref={desktopButtonRef}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/40"}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
                <span className={`text-sm font-medium ${isLanding? "text-white": "text-black"}`}>
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div ref={dropdownRef}
                className="absolute right-0 mt-12 w-35 z-50  bg-white shadow-lg rounded-lg flex flex-col
                  bg-gradient-to-b from-gray-50 via-gray to-gray-200 p-3
                     items-center">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className=" w-full text-center px-2 py-1 rounded-xl hover:bg-gray-300"
                    >
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-center px-2 py-1 rounded-xl hover:bg-gray-300"
                    >
                      Settings
                    </Link>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="w-full text-center px-2 py-1 rounded-xl hover:bg-gray-300 hover:cursor-pointer"
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
          <button className="hamburger-btn" onClick={() => setMenuOpen(true)}>
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
    {/* MOBILE DRAWER */}
 {menuOpen && (
  <div className="fixed inset-0 z-50 md:hidden">
    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={() => setMenuOpen(false)}
    />

    {/* DRAWER */}
    <div
      ref={mobileDrawerRef}
      // onClick={(e) => e.stopPropagation()}
      className="
        absolute right-0 top-0 h-fit w-50
        bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200
        shadow-2xl p-5 rounded-l-2xl
        transform transition-transform duration-300 ease-out
        translate-x-0
      "
    >
      {!user ? (
        <div className="flex flex-col gap-4  bg-gray-50">
          <button
            onClick={() => {
              setAuthModal('login');
              setMenuOpen(false); 
            }}
            className=" font-medium text-gray-700 hover:cursor-pointer py-2  bg-gray-300 rounded-lg"
          >
            Log In
          </button>
          <button
            onClick={() => {
              setAuthModal('register');
              setMenuOpen(false); 
            }}
            className="bg-emerald-600 text-white py-2 rounded-lg hover:cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-6">
          {/* USER INFO */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={user.avatar || 'https://i.pravatar.cc/40'}
              className="w-10 h-10 rounded-full"
              alt="avatar"
            />
            <span className="text-sm font-medium">{user.name}</span>
          </div>

          {/* LINKS — ADDED onClick={() => setMenuOpen(false)} */}
          <Link
            to="/activities/create"
            onClick={() => setMenuOpen(false)}
            className="w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg"
          >
            New Activity
          </Link>

          <Link 
            to="/profile" 
            onClick={() => setMenuOpen(false)} 
            className="text-sm font-medium"
          >
            Profile
          </Link>

          <Link 
            to="/settings" 
            onClick={() => setMenuOpen(false)} 
            className="text-sm font-medium"
          >
            Settings
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
              setMenuOpen(false); // Close menu after logout
            }}
            className="text-sm font-medium text-gray-600 mt-2 hover:cursor-pointer"
          >
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
