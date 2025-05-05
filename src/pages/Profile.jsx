import { useState, useRef, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileEditor from "../components/ProfileEditor";
import VenuesByProfile from "../components/VenuesByProfile";

const Profile = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const editorRef = useRef(null);

  const toggleEditorVisibility = () => {
    setIsEditorVisible((prevState) => !prevState);
  };

  useEffect(() => {
    if (isEditorVisible && editorRef.current) {
      // Delay slightly to allow transition
      setTimeout(() => {
        editorRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300); // matches the transition duration
    }
  }, [isEditorVisible]);

  // Inside the component
const [bookings, setBookings] = useState([]);
const [loadingBookings, setLoadingBookings] = useState(true);
const [bookingsError, setBookingsError] = useState(null);

useEffect(() => {
  const fetchBookings = async () => {
    const profileName = localStorage.getItem("name");

    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${profileName}/bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Noroff-API-Key": `178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.data);
    } catch (error) {
      setBookingsError(error.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  fetchBookings();
}, []);


  return (
    <div>
      <div className="absolute top-0 left-0 w-full z-0">
        <img
          src={localStorage.getItem("banner.url")}
          alt={localStorage.getItem("banner.alt") || "Banner"}
          className="w-full h-88 object-cover brightness-75"
        />
      </div>

      {/* Profile Details */}
      <div className="relative z-10 mt-20 mx-4 h-64 bg-blackPrimary/25 border border-blackSecondary p-4 flex flex-row">
        <div className="w-2/4 flex justify-center items-center">
          <img
            src={localStorage.getItem("avatar.url")}
            alt={localStorage.getItem("avatar.alt") || "User avatar"}
            className="rounded-full min-h-24 min-w-24 max-h-36 max-w-36 object-cover border-1 border-blackSecondary"
          />
        </div>
        <div className="w-2/4 flex flex-col justify-between items-center">
          <div className="text-center pt-8">
            <h1 className="text-xl font-bold">{localStorage.getItem("name")}</h1>
            <p className="font-thin text-xs">{localStorage.getItem("bio")}</p>
          </div>
          <button
            onClick={toggleEditorVisibility}
            className={`mt-4 flex flex-row justify-center border border-blackPrimary items-center gap-2 px-4 py-1 text-white rounded duration-150 cursor-pointer 
              ${isEditorVisible ? "bg-grayPrimary border-whitePrimary" : "bg-blackSecondary"} hover:border-grayPrimary hover:bg-blackPrimary`}
          >
            <FaRegEdit />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Editor */}
      <div
        ref={editorRef}
        className={`transition-all duration-500 ${isEditorVisible ? "max-h-full" : "max-h-0"} overflow-hidden`}
      >
        <ProfileEditor onCancel={toggleEditorVisibility} />
      </div>

      {/* Venues Section */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold">Venues</h2>
        <VenuesByProfile />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">All Bookings</h2>
        {loadingBookings && <p>Loading bookings...</p>}
        {bookingsError && <p className="text-red-500">Error: {bookingsError}</p>}

        {!loadingBookings && bookings.length === 0 && <p>No bookings found.</p>}

        <ul className="space-y-4 mt-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="border border-gray-200 p-4 rounded shadow-sm">
              <p><strong>Date From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
              <p><strong>Date To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              <p className="text-sm text-gray-500">Booked on: {new Date(booking.created).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Profile;
