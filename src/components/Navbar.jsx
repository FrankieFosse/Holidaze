import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { PiList } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const venueManager = localStorage.getItem("venueManager");
    setIsLoggedIn(!!(token && email));
    setIsVenueManager(venueManager === "true");
  }, [location]);

  // Close navbar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate("/", { state: { message: "You are now logged out" } });
  };
  

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-50 text-whitePrimary cursor-pointer"
      >
        {isOpen ? <IoClose size={24} /> : <PiList size={24} />}
      </button>

      {/* Overlay bar */}
      {isOpen && (
        <div id="overlayBar" className="fixed top-0 left-0 w-full h-16 bg-blackPrimary z-30" />
      )}

      {/* Navbar Content */}
      <div
        ref={navRef}
        className={`fixed top-16 z-90 w-full bg-blackPrimary/95 text-whitePrimary overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 p-4">
            {isVenueManager && (
            <Link
                to="/create"
                className="p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary hover:border-grayPrimary"
            >
                <FaCirclePlus size={24} /> Create venue
            </Link>
            )}
          <Link
            to="/"
            className="p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary hover:border-grayPrimary"
          >
            <FaHome size={24} /> Home
          </Link>
          <Link
            to="/browse"
            className="p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary hover:border-grayPrimary"
          >
            <MdExplore size={24} /> Browse
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/bookings"
                className="p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary hover:border-grayPrimary"
              >
                <FaCalendarAlt size={24} /> Bookings
              </Link>
              <Link
                to="/profile"
                className="p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary hover:border-grayPrimary"
              >
                <FaUser size={24} /> Profile
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <button
                onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                }}              
                className="text-left w-full p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 cursor-pointer hover:bg-blackPrimary hover:border-grayPrimary"
            >
              <FiLogIn size={24} /> Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="p-4 border-blackSecondary bg-blackPrimary/90 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary hover:border-grayPrimary"
            >
              <FiLogIn size={24} /> Log in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
