import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { PiList } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import StatusMessage from "./StatusMessage"; // Make sure the import path is correct

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const venueManager = localStorage.getItem("venueManager");
    setIsLoggedIn(!!(token && email));
    setIsVenueManager(venueManager === "true");
  }, [location]);

  // Close navbar on screen resize when it hits lg breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsOpen(false);

    // Show message
    setMessage("You are now logged out");
    setMessageType("success");

    // Optionally hide message after 3 seconds
    setTimeout(() => setMessage(null), 3000);

    navigate("/");
  };

  return (
    <>
      {/* Status Message */}
      <StatusMessage message={message} type={messageType} />

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-2 right-5 z-50 lg:hidden cursor-pointer"
      >
        {isOpen ? <IoClose size={24} /> : <PiList size={24} />}
      </button>

      {/* Overlay bar */}
      {isOpen && (
        <div id="overlayBar" className="fixed top-0 left-0 w-full h-10 bg-blackPrimary z-30" />
      )}

      {/* Navbar Content */}
      <div
        ref={navRef}
        className={`fixed top-10 z-90 w-full h-max bg-blackPrimary/90 backdrop-blur-xs overflow-hidden text-sm transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 p-4 sm:grid grid-cols-3">
          {isVenueManager && (
            <Link
              to="/create"
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
            >
              <FaCirclePlus size={20} /> Create venue
            </Link>
          )}
          <Link
            to="/"
            className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
          >
            <FaHome size={20} /> Home
          </Link>
          <Link
            to="/browse"
            className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
          >
            <MdExplore size={20} /> Browse
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/bookings"
                className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
              >
                <FaCalendarAlt size={20} /> Bookings
              </Link>
              <Link
                to="/profile"
                className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
              >
                <FaUser size={20} /> Profile
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary cursor-pointer rounded"
            >
              <FiLogIn size={20} /> Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
            >
              <FiLogIn size={20} /> Log in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
