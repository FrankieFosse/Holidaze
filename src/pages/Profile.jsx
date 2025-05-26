import { useState, useRef, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileEditor from "../components/ProfileEditor";
import VenuesByProfile from "../components/VenuesByProfile";
import BookingsByProfile from "../components/BookingsByProfile";

const Profile = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("venues");

  useEffect(() => {
    document.title = `${localStorage.getItem("name")} | Holidaze`;
  }, []);

  useEffect(() => {
    if (isEditorVisible && editorRef.current) {
      setTimeout(() => {
        editorRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    }
  }, [isEditorVisible]);

  const toggleEditorVisibility = () => {
    setIsEditorVisible((prev) => !prev);
  };

  const name = localStorage.getItem("name");
  const avatarUrl = localStorage.getItem("avatar.url");
  const avatarAlt = localStorage.getItem("avatar.alt") || "User avatar";
  const bannerUrl = localStorage.getItem("banner.url");
  const bannerAlt = localStorage.getItem("banner.alt") || "Banner";
  const bio = localStorage.getItem("bio");

  return (
    <div className="mt-16">
      <div className="absolute top-16 left-0 w-full z-0">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={bannerAlt}
            className="w-full h-92 object-cover brightness-75"
          />
        )}
      </div>

      {/* Profile Details */}
      <div className="w-full flex justify-center items-center">
        <div className="relative z-10 mt-3 mx-4 h-86 w-full md:w-2/3 xl:w-2/4 bg-blackPrimary/25 border border-blackSecondary p-4 flex flex-col justify-center items-center lg:flex-row">
          <div className="w-2/4 flex justify-center items-center">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={avatarAlt}
                className="rounded-full min-h-16 min-w-16 max-h-16 max-w-16 lg:min-h-36 lg:min-w-36 object-cover border-1 border-blackSecondary"
              />
            )}
          </div>
          <div className="w-2/4 flex flex-col justify-between items-center">
            <div className="text-center pt-2">
              <h1 className="text-xl font-bold">{name}</h1>
              {bio && bio !== "null" && (
                <p className="font-thin text-xs break-all overflow-hidden line-clamp-6 min-w-36">{bio}</p>
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
            className={`px-4 py-2 cursor-pointer duration-150 font-semibold ${
              activeTab === "venues"
                ? "border-b-1 border-whitePrimary"
                : "text-grayPrimary hover:border-b-1 hover:border-grayPrimary"
            }`}
          >
            Venues
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 cursor-pointer duration-150 font-semibold ${
              activeTab === "bookings"
                ? "border-b-1 border-whitePrimary"
                : "text-grayPrimary hover:border-b-1 hover:border-grayPrimary"
            }`}
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
