import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const BookIcon = () => {
  <svg
    className="w-4 h-4 text-gray-700"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>;
};

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experiance", path: "/" },
    { name: "About", path: "/" },
  ];

  // const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, navigate, isOwner, setShowHotelReg, logout } = useAppContext();
 

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setIsScrolled(window.scrollY > 50);
      } else {
        setIsScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between 
                px-4 md:px-16 lg:px-24 xl:px-32 z-50 transition-all duration-500 
                ${isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-md py-3 md:py-4"
          : "bg-transparent text-white py-4 md:py-6"
        }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"
              }`}
          >
            {link.name}
            <div
              className={`${isScrolled ? "bg-gray-700" : "bg-white"
                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
        {user && (
          <button
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? "text-black" : "text-white"
              } transition-all`}
            onClick={() => isOwner ? navigate("/owner") : setShowHotelReg(true)}
          >
            {isOwner ? 'DashBoard' : "List Your Hotel"}
          </button>
        )
        }
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${isScrolled && "invert"}`}
        ></img>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group relative cursor-pointer">
              <img src={assets.userIcon} alt="user" className="w-8 h-8 rounded-full border border-gray-300" />
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="bg-white text-gray-800 shadow-lg rounded-lg py-2 w-32 border border-gray-100">
                  <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-50 transition">My Bookings</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition">Logout</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <img src={assets.userIcon} alt="user" className="w-8 h-8 rounded-full border border-gray-300" />
        )}

        <img
          src={assets.menuIcon}
          alt=""
          className={`${isScrolled && "invert"} h-4`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        ></img>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close-menu" className="h-6"></img>
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {user && (
          <button
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
            onClick={() => isOwner ? navigate("/owner") : setShowHotelReg(true)}

          >
            {isOwner ? 'DashBoard' : "List Your Hotel"}

          </button>
        )}

        {!user && (
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </Link>
        )}

        {user && (
          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="bg-red-600 text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
