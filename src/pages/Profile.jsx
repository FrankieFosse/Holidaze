import { useState, useRef, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileEditor from "../components/ProfileEditor";
import VenuesByProfile from "../components/VenuesByProfile";
import BookingsByProfile from "../components/BookingsByProfile";


const Profile = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const editorRef = useRef(null);

  const toggleEditorVisibility = () => {
    setIsEditorVisible((prevState) => !prevState);
  };
  
    useEffect(() => {
      document.title = `${localStorage.getItem("name")} | Holidaze`;
    }, []);  

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

// Add this inside your component, before return
const [activeTab, setActiveTab] = useState("venues");


  return (
    <div className="mt-16">
      <div className="absolute top-16 left-0 w-full z-0">
        <img
          src={localStorage.getItem("banner.url")}
          alt={localStorage.getItem("banner.alt") || "Banner"}
          className="w-full h-92 object-cover brightness-75"
        />
      </div>

      {/* Profile Details */}
      <div className="w-full flex justify-center items-center">
      <div className="relative z-10 mt-3 mx-4 h-86 w-full md:w-2/3 xl:w-2/4 bg-blackPrimary/25 border border-blackSecondary p-4 flex flex-col justify-center items-center lg:flex-row">
        <div className="w-2/4 flex justify-center items-center">
          <img
            src={localStorage.getItem("avatar.url")}
            alt={localStorage.getItem("avatar.alt") || "User avatar"}
            className="rounded-full min-h-16 min-w-16 max-h-16 max-w-16 lg:min-h-36 lg:min-w-36 object-cover border-1 border-blackSecondary"
          />
        </div>
        <div className="w-2/4 flex flex-col justify-between items-center">
        <div className="text-center pt-2">
          <h1 className="text-xl font-bold">{localStorage.getItem("name")}</h1>
          {localStorage.getItem("bio") && localStorage.getItem("bio") !== "null" && (
            <p className="font-thin text-xs break-all overflow-hidden line-clamp-6 min-w-36">{localStorage.getItem("bio")}</p>
          )}
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
      </div>

      {/* Profile Editor */}
      <div
        ref={editorRef}
        className={`transition-all duration-500 ${isEditorVisible ? "max-h-full" : "max-h-0"} overflow-hidden`}
      >
        <ProfileEditor onCancel={toggleEditorVisibility} />
      </div>

      {/* Tab Controls */}
      <div className="mt-18">
        <div className="flex justify-center gap-4 border-b border-blackSecondary mb-4">
          <button
            onClick={() => setActiveTab("venues")}
            className={`px-4 py-2 border-b-1 border-blackPrimary cursor-pointer duration-150 hover:border-b-1 hover:border-grayPrimary font-semibold ${activeTab === "venues" ? "border-b-1 border-whitePrimary" : "text-grayPrimary"}`}
          >
            Venues
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 border-b-1 border-blackPrimary cursor-pointer duration-150 hover:border-b-1 hover:border-grayPrimary font-semibold ${activeTab === "bookings" ? "border-b-1 border-whitePrimary" : "text-grayPrimary"}`}
          >
            Bookings
          </button>
        </div>

        {/* Conditional Rendering */}
        {activeTab === "venues" ? <VenuesByProfile /> : <BookingsByProfile />}
      </div>

    </div>
  );
};

export default Profile;
