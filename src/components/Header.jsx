import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaHome } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import StatusMessage from "./StatusMessage";
import Modal from "./Modal";
import Navbar from "./Navbar";

function Header() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const venueManager = localStorage.getItem("venueManager");

    setIsLoggedIn(!!(token && email));
    setIsVenueManager(venueManager === "true");
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setMessage("You are now logged out");
    setMessageType("success");
    setTimeout(() => setMessage(null), 3000);
    navigate("/");
  };

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (isVenueManager) {
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

  const userName = localStorage.getItem("name");
  const avatarUrl = localStorage.getItem("avatar.url");

  return (
    <header>
      <StatusMessage message={message} type={messageType} />

      <Modal isOpen={showVenueModal} onClose={handleCloseModal}>
        <div className="flex flex-col items-center gap-4 p-6">
          <h2 className="text-lg font-semibold">Become a Venue Manager?</h2>
          <p>This will let you create and manage venues.</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBecomeVenueManager}
              className="bg-buttonPrimary hover:bg-buttonSecondary px-4 py-2 rounded disabled:opacity-50 cursor-pointer duration-150"
              disabled={loading}
            >
              {loading ? "Updating..." : "Yes, make me one"}
            </button>
            <button
              onClick={handleCloseModal}
              className="border border-grayPrimary px-4 py-2 rounded hover:bg-grayPrimary/20 cursor-pointer duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div
        id="headerBar"
        className={`w-full h-16 flex items-center justify-between fixed top-0 left-0 z-40 px-6 transition-colors duration-1000 ${
          scrolled ? "bg-blackPrimary/75 backdrop-blur-xs" : "bg-blackPrimary/0"
        }`}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src="/images/Holidaze Logo v1.png"
            className="w-20 max-h-16 mb-0.5"
            alt="Holidaze logo"
          />
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
          <Link to="/" className="nav-link"><FaHome size={20} /> Home</Link>
          <Link to="/browse" className="nav-link"><MdExplore size={20} /> Browse</Link>
          <button onClick={handleCreateClick} className="nav-link">
            <FaCirclePlus size={20} /> Create venue
          </button>
        </div>


        {/* User profile */}
        {isLoggedIn && (
          <Link
            to={`/profile/`}
            className="ml-auto flex items-center gap-3 px-3 py-2 rounded-lg mr-10 transition-colors duration-150"
          >
            <p className="font-thin text-xs xl:text-sm hidden sm:block">{userName}</p>
            <img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full object-cover" />
          </Link>
        )}
      </div>

      {/* Mobile Navbar */}
      <Navbar />
    </header>
  );
}

export default Header;
