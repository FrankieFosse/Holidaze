import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import StatusMessage from "./StatusMessage";
import Modal from "./Modal";

function DesktopNavbar2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
        method: "PUT", // or PATCH if that's what your API supports
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
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

  const handleCloseModal = () => {
    setShowVenueModal(false);
  };

  const userName = localStorage.getItem("name");
  const avatarUrl = localStorage.getItem("avatar.url");

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
              className="bg-buttonPrimary hover:bg-buttonSecondary text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Yes, make me one"}
            </button>
            <button
              onClick={handleCloseModal}
              className="border border-grayPrimary px-4 py-2 rounded hover:bg-grayPrimary/20"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <nav className="fixed top-0 left-0 w-full h-16 text-sm z-40 flex justify-between items-center px-6 py-0 border-grayPrimary">
        {/* Centered nav links container */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
            <Link to="/" className="nav-link"><FaHome size={20} /> Home</Link>
            <Link to="/browse" className="nav-link"><MdExplore size={20} /> Browse</Link>
            <button onClick={handleCreateClick} className="nav-link">
            <FaCirclePlus size={20} /> Create venue
            </button>
        </div>

        {/* Right-aligned profile button */}
        {isLoggedIn && (
            <div id="profileButton" className="ml-auto flex items-center gap-3 bg-blackSecondary px-3 py-2 rounded-lg">
            <img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full" />
            <p className="text-whitePrimary font-semibold">{userName}</p>
            </div>
        )}
        </nav>

    </>
  );
}

export default DesktopNavbar2;
