import SingleVenueHero from "../components/SingleVenueHero";
import Description from "../components/Description";
import Rating from "../components/Rating";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import Return from "../components/Return";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venue = location.state;

  const hasLocationValues = venue.location && Object.values(venue.location).some(value => value);

  const owner = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar.url")

    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("error");

    // Handle status message
    const showStatusMessage = (message, type = "error") => {
        setStatusMessage(message);
        setStatusType(type);
    
        // Clear status message after 3 seconds
        setTimeout(() => {
          setStatusMessage("");
        }, 3000); // 3 seconds
      };

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleCreateVenue = async () => {
    const token = localStorage.getItem("token");
  
    if (!token || !owner) {
      alert("You must be logged in to create a venue.");
      return;
    }
  
    const venueData = {
      name: venue.name,
      description: venue.description,
      media: venue.media,
      price: parseFloat(venue.price),
      maxGuests: parseInt(venue.maxGuests),
      meta: venue.meta,
      location: venue.location,
    };
  
    try {
      const response = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
        },
        body: JSON.stringify(venueData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to create venue.");
      }

      showStatusMessage("Creating venue...", "loading"); // Spinner & message appear

      setTimeout(() => {
        navigate("/profile");
        localStorage.removeItem("draftVenue");
      }, 2000);

    } catch (error) {
      alert(error.message);
      console.error("Create venue error:", error);
    }
  };
  

  const handleImageError = (event) => {
    event.target.src = "/images/NoImagePlaceholder.jpg"; // Use the fallback image
  };

  // If no state is passed, redirect back to Create page
  if (!venue) {
    navigate("/create");
    return null;
  }

  console.log(venue)

  return (
    <>
      <SingleVenueHero media={venue.media} expanded={expanded} />

      <div className="absolute left-0 z-30 p-4 bottom-4 lg:bottom-16 lg:p-16 w-full lg:pl-80 overflow-hidden flex flex-row justify-between items-center gap-4 pointer-events-none">
        <div className="text-left w-3/5 pointer-events-auto">
          <h2 className={`font-bold break-words overflow-hidden text-ellipsis ${venue.name.length > 100 ? "text-sm lg:text-xl" : "text-xl lg:text-3xl"}`}>
            {venue.name}
          </h2>

          <Description text={venue.description} onExpandToggle={handleExpandToggle} />
        </div>
      </div>

      <Return />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:text-lg lg:text-xl xl:text-2xl">

<div className="border-1 border-blackSecondary mx-2 my-4">
  <div className="flex flex-row justify-evenly items-center my-4 mx-2 gap-4">
    <p className="">{venue.price} NOK / night</p>

  </div>

  {/* Display other venue details like max guests, amenities, etc. */}
  <div className="flex flex-col justify-center items-center">
    <p>Max Guests</p>
    <div className="border-1 border-grayPrimary rounded-full min-w-16 min-h-16 p-2 flex items-center justify-center">{venue.maxGuests}</div>
  </div>
  <div className="flex flex-row justify-evenly my-4 gap-4 scale-80">
    {[{ condition: venue.meta.wifi, icon: <FaWifi className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "WiFi included" },
      { condition: venue.meta.parking, icon: <MdLocalParking className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Parking included" },
      { condition: venue.meta.pets, icon: <MdFreeBreakfast className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Breakfast included" },
      { condition: venue.meta.breakfast, icon: <MdOutlinePets className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Pets allowed" }].map(({ condition, icon, label }, index) => condition && (
        <div key={index} className="flex flex-col items-center gap-2">
          {icon}
          <p className="text-xs md:text-lg font-thin">{label}</p>
        </div>
      ))}
  </div>
</div>

{/* Owner Section */}
<div className="border-1 border-blackSecondary mx-2 my-4 p-4 flex-col justify-center items-center">
  <h2 className="font-bold mb-2">Venue Owner</h2>
  <div className="justify-center items-center flex flex-col">
  <p className="font-semibold">{owner}</p>
  <img src={avatar} className="min-h-16 max-h-16 min-w-16 max-w-16 rounded-full" />
  </div>
</div>

{hasLocationValues && (
  <div className="border-1 border-blackSecondary mx-2 my-4 p-4">
    <h2 className="font-bold mb-2">Location Details</h2>
    <div className="text-whiteSecondary">
      {venue.location.address && <p><strong>Address:</strong> {venue.location.address}</p>}
      {venue.location.city && <p><strong>City:</strong> {venue.location.city}</p>}
      {venue.location.zip && <p><strong>ZIP:</strong> {venue.location.zip}</p>}
      {venue.location.country && <p><strong>Country:</strong> {venue.location.country}</p>}
      {venue.location.continent && <p><strong>Continent:</strong> {venue.location.continent}</p>}
    </div>
  </div>
)}







</div>

{/* Media Section */}
{venue.media && venue.media.length > 0 && (
<div className="border-1 border-blackSecondary mx-2 my-4 flex justify-center items-center flex-col h-max">
<h2>Media</h2>
<div
  className={`grid gap-4 p-4 place-items-center ${
    venue.media.length === 1
      ? 'grid-cols-1'
      : venue.media.length === 2
      ? 'grid-cols-2'
      : venue.media.length === 3
      ? 'grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }`}
>
  {venue.media.map((mediaItem, index) => (
    <div
      key={index}
      className="overflow-hidden cursor-pointer"
    >
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

    </>
  );
};

export default Preview;
