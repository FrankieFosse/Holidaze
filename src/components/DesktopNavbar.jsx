import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";

function DesktopNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
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
    navigate("/", { state: { message: "You are now logged out" } });
  };

  return (
    <nav className="hidden lg:flex lg:flex-col justify-between lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-72 bg-blackPrimary/80 text-sm z-40 p-4 gap-4 overflow-y-auto border-r border-grayPrimary">
        <div className="flex flex-col gap-8 justify-center items-center">
        <Link to="/">
                <img src="/images/Holidaze Logo v1.png" className="top-1 relative max-w-24 min-w-24 max-h-24 min-h-24 overflow-hidden hover:scale-105 duration-150"></img>
            </Link>
      {isVenueManager && (
        <Link
          to="/create"
          className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded w-full"
        >
          <FaCirclePlus size={20} /> Create venue
        </Link>
      )}
      <Link
        to="/"
        className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded w-full"
      >
        <FaHome size={20} /> Home
      </Link>
      <Link
        to="/browse"
        className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded w-full"
      >
        <MdExplore size={20} /> Browse
      </Link>
    </div>
    <div className="flex flex-col gap-8">
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
          className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 w-full flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary cursor-pointer rounded"
        >
          <FiLogIn size={20} /> Log out
        </button>
      ) : (
        <Link
          to="/login"
          className="p-2 h-10 border-blackSecondary bg-buttonPrimary/50 border-1 w-full flex flex-row items-center gap-4 duration-150 hover:bg-buttonPrimary hover:border-whitePrimary rounded"
        >
          <FiLogIn size={20} /> Log in
        </Link>
      )}
      </div>
    </nav>
  );
}

export default DesktopNavbar;
