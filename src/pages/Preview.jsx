import SingleVenueHero from "../components/SingleVenueHero";
import Description from "../components/Description";
import Rating from "../components/Rating";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venue = location.state;

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
    const owner = localStorage.getItem("name");
  
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

  return (
    <>
      <SingleVenueHero media={venue.media} expanded={expanded} />
      <div className="absolute z-30 text-white p-4 bottom-4 w-full overflow-hidden flex flex-row justify-between items-center gap-4">
        <div className="text-left w-3/5">
          <h2
            className={`font-bold break-words overflow-hidden text-ellipsis ${
              venue.name.length > 100 ? "text-sm" : "text-xl"
            }`}
          >
            {venue.name}
          </h2>

          <Description text={venue.description} onExpandToggle={handleExpandToggle} />
        </div>
      </div>

      <div className="fixed top-24 left-4 z-40 bg-blackPrimary/75 border-1 border-grayPrimary rounded-full px-4 py-2 cursor-pointer duration-150 hover:bg-blackPrimary/100">
              <div
              className="flex flex-col items-center justify-center"
              onClick={() => navigate(-1)}
              >
                  <FaLongArrowAltLeft />
                  <p className="text-xs">Go back</p>
              </div>
            </div>

      <div className="border-1 border-blackSecondary mx-2 my-4">
              <div className="flex flex-row justify-evenly items-center my-4 mx-2 gap-4">
                <p className="text-sm">{venue.price} NOK / night</p>
                <button className="flex items-center w-max py-2 px-2 bg-buttonPrimary hover:bg-buttonSecondary text-md duration-150 cursor-pointer gap-2">
                  Book now <FaLongArrowAltRight />
                </button>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p>Max Guests</p>
                <div className="border-1 border-grayPrimary rounded-full w-12 h-12 p-2 flex items-center justify-center">{venue.maxGuests}</div>
              </div>
              <div className="flex flex-row justify-evenly my-4 gap-4 scale-80">
                {[{ condition: venue.meta.wifi, icon: <FaWifi className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "WiFi included" },
                  { condition: venue.meta.parking, icon: <MdLocalParking className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Parking included" },
                  { condition: venue.meta.pets, icon: <MdFreeBreakfast className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Breakfast included" },
                  { condition: venue.meta.breakfast, icon: <MdOutlinePets className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Pets allowed" }]
                  .map(({ condition, icon, label }, index) => condition && (
                    <div key={index} className="flex flex-col items-center gap-2">
                      {icon}
                      <p className="text-xs font-thin">{label}</p>
                    </div>
                  ))}
              </div>
            </div>

                    {/* Media Section: Displaying all images only if media exists */}
        {venue.media && venue.media.length > 0 && (
        <div className="border-1 border-blackSecondary mx-2 my-4 flex justify-center items-center flex-col">
            <h2>Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-center items-center self-center">
            {venue.media.map((mediaItem, index) => (
                <div key={index} className="overflow-hidden">
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

        <div className="border-1 border-blackSecondary mx-2 p-8 my-8">
            <h2>Owner</h2>
            <div className="flex flex-row items-center justify-between gap-4">
            <img
                src={localStorage.getItem("avatar.url")}
                className="rounded-full border-1 border-grayPrimary max-h-24 min-h-24 max-w-24 min-w-24 object-cover"
                onError={handleImageError} // Handle error for the owner's avatar image
            />
            <p>{localStorage.getItem("name")}</p>
            </div>
        </div>

        <div className="flex justify-center items-center my-8">
        <button
            onClick={handleCreateVenue}
            className="bg-buttonPrimary hover:bg-buttonSecondary text-white py-2 px-4 rounded"
        >
            Create Venue
        </button>
        </div>

    </>
  );
};

export default Preview;
