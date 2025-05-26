import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { PiList } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import StatusMessage from "./StatusMessage";
import Modal from "./Modal";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const venueManager = localStorage.getItem("venueManager");
    setIsLoggedIn(!!(token && email));
    setIsVenueManager(venueManager === "true");
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsOpen(false);
    setMessage("You are now logged out");
    setMessageType("success");
    setTimeout(() => setMessage(null), 3000);
    navigate("/");
  };

  const handleCreateClick = () => {
    setIsOpen(false); // Close the Navbar first
  
    if (isVenueManager) {
      navigate("/create");
    } else {
      setShowVenueModal(true);
    }
  };
  

  const handleBecomeVenueManager = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({ venueManager: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(data.errors?.[0]?.message || "Failed to update profile");
      } else {
        localStorage.setItem("venueManager", "true");
        setIsVenueManager(true);
        setMessageType("success");
        setMessage("You're now a venue manager!");
        setShowVenueModal(false);
        navigate("/create");
      }
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCloseModal = () => setShowVenueModal(false);

  return (
    <>
      <StatusMessage message={message} type={messageType} />

      <Modal isOpen={showVenueModal} onClose={handleCloseModal}>
        <div className="flex flex-col items-center gap-4 text-whitePrimary p-6">
          <h2 className="text-lg font-semibold">Become a Venue Manager?</h2>
          <p>This will let you create and manage venues.</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBecomeVenueManager}
              className="bg-buttonPrimary hover:bg-buttonSecondary px-4 py-2 rounded disabled:opacity-50 duration-150"
              disabled={loading}
            >
              {loading ? "Updating..." : "Yes, make me one"}
            </button>
            <button
              onClick={handleCloseModal}
              className="border border-grayPrimary px-4 py-2 rounded hover:bg-grayPrimary/20 duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4.5 right-5 z-50 cursor-pointer"
      >
        {isOpen ? <IoClose size={24} /> : <PiList size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="overlayBar"
            className="fixed top-0 left-0 w-full h-16 bg-blackPrimary z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>


      <div
        ref={navRef}
        className={`fixed rounded-bl top-16 z-90 w-full lg:w-1/4 lg:right-0 h-max bg-blackPrimary/90 border-b-1 border-l-1 border-blackSecondary backdrop-blur-xs overflow-hidden text-sm transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 p-4 sm:grid grid-cols-3 lg:flex">
        {isLoggedIn && (
          <button
            onClick={handleCreateClick}
            className="lg:hidden p-2 h-10 border-blackSecondary cursor-pointer bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
          >
            <FaCirclePlus size={20} /> Create venue
          </button>
        )}
          <Link to="/" className="lg:hidden p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary rounded">
            <FaHome size={20} /> Home
          </Link>
          <Link to="/browse" className="lg:hidden p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary rounded">
            <MdExplore size={20} /> Browse
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/bookings" className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary rounded">
                <FaCalendarAlt size={20} /> Bookings
              </Link>
              <Link to="/profile" className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary rounded">
                <FaUser size={20} /> Profile
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary cursor-pointer rounded"
            >
              <FiLogIn size={20} /> Log out
            </button>
          ) : (
            <Link to="/login" className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 hover:bg-buttonPrimary hover:border-whitePrimary rounded">
              <FiLogIn size={20} /> Log in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
