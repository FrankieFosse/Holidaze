import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import StatusMessage from "./StatusMessage"; // Make sure this path is correct

function DesktopNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

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

    // Show status message
    setMessage("You are now logged out");
    setMessageType("success");

    // Optionally clear after 3 seconds
    setTimeout(() => setMessage(null), 3000);

    navigate("/");
  };

  const userName = localStorage.getItem("name");
  const avatarUrl = localStorage.getItem("avatar.url");

  return (
    <>
      {/* Status message */}
      <StatusMessage message={message} type={messageType} />

      <nav className="hidden lg:flex lg:flex-col justify-between lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-72 bg-blackPrimary/80 text-sm z-40 py-2 gap-4 overflow-y-auto border-r border-grayPrimary">
        <div className="flex flex-col gap-2 2xl:gap-8 justify-center items-center">
          <div className="bg-blackSecondary w-full flex justify-center">
            <Link to="/">
              <img
                src="/images/Holidaze Logo v1.png"
                className="top-0 relative max-w-24 min-w-24 max-h-24 min-h-24 overflow-hidden hover:scale-105 duration-150"
              />
            </Link>
          </div>

          {isVenueManager && (
            <Link
              to="/create"
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary w-full"
            >
              <FaCirclePlus size={20} /> Create venue
            </Link>
          )}
          <Link
            to="/"
            className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary w-full"
          >
            <FaHome size={20} /> Home
          </Link>
          <Link
            to="/browse"
            className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary w-full"
          >
            <MdExplore size={20} /> Browse
          </Link>
        </div>

        <div className="flex flex-col gap-2 2xl:gap-8">
          {isLoggedIn && (
            <>
              <Link
                to="/bookings"
                className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary"
              >
                <FaCalendarAlt size={20} /> Bookings
              </Link>
              <Link
                to="/profile"
                className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary"
              >
                <FaUser size={20} /> Profile
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 w-full flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary cursor-pointer"
            >
              <FiLogIn size={20} /> Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-y-1 w-full flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary"
            >
              <FiLogIn size={20} /> Log in
            </Link>
          )}

          {isLoggedIn && (
            <div className="flex flex-row justify-evenly items-center bg-blackSecondary py-4">
              <img
                src={avatarUrl}
                className="min-w-16 max-w-16 min-h-16 max-h-16 rounded-full"
              />
              <p>{userName}</p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default DesktopNavbar;
