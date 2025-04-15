import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { PiList } from "react-icons/pi";
import { IoClose } from "react-icons/io5";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

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

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-50 text-whitePrimary"
      >
        {isOpen ? <IoClose size={24} /> : <PiList size={24} />}
      </button>

      {/* Overlay bar */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-16 bg-blackPrimary/75 z-30" />
      )}

      {/* Navbar Content */}
      <div
        ref={navRef}
        className={`fixed top-16 z-40 w-full bg-blackPrimary/90 text-whitePrimary overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 p-4">
          <Link
            to="/"
            className="p-4 border-blackSecondary border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary/50 hover:border-grayPrimary"
          >
            <FaHome size={24} /> Home
          </Link>
          <Link
            to="/browse"
            className="p-4 border-blackSecondary border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary/50 hover:border-grayPrimary"
          >
            <MdExplore size={24} /> Browse
          </Link>
          <Link
            to="/bookings"
            className="p-4 border-blackSecondary border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary/50 hover:border-grayPrimary"
          >
            <FaCalendarAlt size={24} /> Bookings
          </Link>
          <Link
            to="/profile"
            className="p-4 border-blackSecondary border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary/50 hover:border-grayPrimary"
          >
            <FaUser size={24} /> Profile
          </Link>
          <Link
            to="/login"
            className="p-4 border-blackSecondary border-1 flex flex-row items-center gap-4 duration-150 hover:bg-blackPrimary/50 hover:border-grayPrimary"
          >
            <FiLogIn size={24} /> Log in
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
