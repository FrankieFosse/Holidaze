import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileEditor from "../components/ProfileEditor";
import VenuesByProfile from "../components/VenuesByProfile";

const Profile = () => {
  // State to manage the visibility of the ProfileEditor
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const toggleEditorVisibility = () => {
    setIsEditorVisible((prevState) => !prevState);
  };

  return (
    <div>
      <div className="absolute top-0 left-0 w-full z-0">
        <img
          src={localStorage.getItem("banner.url")}
          alt={localStorage.getItem("banner.alt") || "Banner"}
          className="w-full h-88 object-cover brightness-75"
        />
      </div>

      {/* Profile Details - on top of banner */}
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

      {/* Profile Editor - Slide in/out effect */}
      <div
        className={`transition-all duration-500 ${isEditorVisible ? "max-h-screen" : "max-h-0"} overflow-hidden`}
      >
        <ProfileEditor onCancel={toggleEditorVisibility} />
      </div>

      {/* Venues Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Venues</h2>
        <VenuesByProfile />
      </div>
    </div>
  );
};

export default Profile;
