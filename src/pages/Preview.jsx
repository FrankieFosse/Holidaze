import SingleVenueHero from "../components/SingleVenueHero";
import Description from "../components/Description";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import Return from "../components/Return";
import StatusMessage from "../components/StatusMessage";

const Preview = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const location = useLocation();
  const navigate = useNavigate();
  const venue = location.state;

  if (!venue) {
    navigate("/create");
    return null;
  }

  const hasLocationValues = venue.location && Object.values(venue.location).some(Boolean);

  const owner = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar.url");

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("error");
  const [expanded, setExpanded] = useState(false);

  const showStatusMessage = (message, type = "error", duration = 3000) => {
    setStatusMessage(message);
    setStatusType(type);

    setTimeout(() => {
      setStatusMessage("");
    }, duration);
  };

  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleCreateVenue = async () => {
    const token = localStorage.getItem("token");

    if (!token || !owner) {
      showStatusMessage("You must be logged in to create a venue.");
      return;
    }

    const venueData = {
      name: venue.name,
      description: venue.description,
      media: venue.media,
      price: Number(venue.price),
      maxGuests: Number(venue.maxGuests),
      meta: venue.meta,
      location: venue.location,
    };

    try {
      showStatusMessage("Creating venue...", "loading");

      const response = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(venueData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to create venue.");
      }

      showStatusMessage("Venue created successfully!", "success");

      setTimeout(() => {
        localStorage.removeItem("draftVenue");
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Create venue error:", error);
      showStatusMessage(error.message || "Failed to create venue.");
    }
  };

  const handleImageError = (event) => {
    event.target.src = "/images/NoImagePlaceholder.jpg";
  };

  return (
    <>
      <SingleVenueHero media={venue.media} expanded={expanded} />

      <StatusMessage message={statusMessage} type={statusType} />

      <div className="absolute left-0 z-30 p-4 bottom-4 lg:bottom-16 lg:p-16 w-full flex justify-between items-center gap-4 pointer-events-none">
        <div className="text-left w-3/5 pointer-events-auto">
          <h2
            className={`font-bold break-words overflow-hidden text-ellipsis ${
              venue.name.length > 100 ? "text-sm lg:text-xl" : "text-xl lg:text-3xl"
            }`}
          >
            {venue.name}
          </h2>

          <Description text={venue.description} onExpandToggle={handleExpandToggle} />
        </div>
      </div>

      <Return />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:text-lg lg:text-xl xl:text-2xl gap-4 px-2 mt-4">

        {/* Price & Guests */}
        <div className="border border-blackSecondary p-4 flex flex-col items-center">
          <p>{venue.price} NOK / night</p>
          <p>Max Guests</p>
          <div className="border border-grayPrimary rounded-full w-16 h-16 flex items-center justify-center">{venue.maxGuests}</div>

          <div className="flex justify-evenly gap-4 xl:gap-10 scale-90 mt-4">
            {[
              { cond: venue.meta.wifi, icon: <FaWifi className="h-10 w-10 p-2 rounded-full bg-blackSecondary border border-blackSecondary text-grayPrimary" />, label: "WiFi included" },
              { cond: venue.meta.parking, icon: <MdLocalParking className="h-10 w-10 p-2 rounded-full bg-blackSecondary border border-blackSecondary text-grayPrimary" />, label: "Parking included" },
              { cond: venue.meta.breakfast, icon: <MdFreeBreakfast className="h-10 w-10 p-2 rounded-full bg-blackSecondary border border-blackSecondary text-grayPrimary" />, label: "Breakfast included" },
              { cond: venue.meta.pets, icon: <MdOutlinePets className="h-10 w-10 p-2 rounded-full bg-blackSecondary border border-blackSecondary text-grayPrimary" />, label: "Pets allowed" },
            ].map(({ cond, icon, label }, i) => cond && (
              <div key={i} className="flex flex-col items-center gap-2">
                {icon}
                <p className="text-xs lg:text-sm font-thin">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Owner Section */}
        <div className="border border-blackSecondary p-4 flex flex-col items-center">
          <h2 className="font-bold mb-2">Venue Owner</h2>
          <p className="font-semibold">{owner}</p>
          {avatar && (
            <img
              src={avatar}
              alt={`${owner}'s avatar`}
              className="w-16 h-16 rounded-full object-cover mt-2"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Location Details */}
        {hasLocationValues && (
          <div className="border border-blackSecondary p-4 text-whiteSecondary">
            <h2 className="font-bold mb-2">Location Details</h2>
            {venue.location.address && <p><strong>Address:</strong> {venue.location.address}</p>}
            {venue.location.city && <p><strong>City:</strong> {venue.location.city}</p>}
            {venue.location.zip && <p><strong>ZIP:</strong> {venue.location.zip}</p>}
            {venue.location.country && <p><strong>Country:</strong> {venue.location.country}</p>}
            {venue.location.continent && <p><strong>Continent:</strong> {venue.location.continent}</p>}
          </div>
        )}
      </div>

      {/* Media Section */}
      {venue.media?.length > 0 && (
        <div className="border border-blackSecondary mx-2 my-4 flex flex-col items-center p-4">
          <h2 className="mb-4">Media</h2>
          <div
            className={`grid gap-4 place-items-center ${
              venue.media.length <= 3
                ? `grid-cols-${venue.media.length}`
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {venue.media.map((mediaItem, index) => (
              <div key={index} className="overflow-hidden cursor-pointer">
                <img
                  src={mediaItem.url}
                  alt={`Media ${index + 1}`}
                  className="w-64 h-32 object-cover rounded-md"
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center items-center my-8">
        <button
          onClick={handleCreateVenue}
          className="bg-buttonPrimary hover:bg-buttonSecondary py-2 px-4 rounded duration-150 cursor-pointer"
        >
          Create Venue
        </button>
      </div>
    </>
  );
};

export default Preview;
