import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SingleVenueHero from "../components/SingleVenueHero";
import Rating from "../components/Rating";
import Description from "../components/Description";
import { FaLongArrowAltRight, FaWifi, FaLongArrowAltLeft } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import MediaViewer from "../components/MediaViewer";  // Importing MediaViewer

const SingleVenue = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);  // Set the clicked image index
    setIsModalOpen(true);
  };

  const handleNavigate = (newIndex) => {
    setSelectedImageIndex(newIndex);  // Update the image index
  };

  // Fallback image handler
  const handleImageError = (event) => {
    event.target.src = "/images/NoImagePlaceholder.jpg"; // Use the fallback image
  };

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true`);
        if (!response.ok) throw new Error("Failed to fetch venue");
        const json = await response.json();
        setVenue(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!venue) return <p>No venue found</p>;

  return (
    <>
      <SingleVenueHero media={venue.media} expanded={expanded} />

      <div className="absolute z-30 text-white p-4 bottom-24 w-full overflow-hidden flex flex-row justify-between items-center gap-4">
        <div className="text-left w-3/5">
          <h1 className="text-xl font-bold break-words overflow-hidden text-ellipsis">{venue.name}</h1>
          <Description text={venue.description} onExpandToggle={handleExpandToggle} />
        </div>
        <div>
          <Rating venue={venue} />
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
        <p className="text-sm font-thin opacity-50">Created {venue.created.slice(0, 10).split('-').reverse().join('.')}</p>
      </div>

        {/* Media Section: Displaying all images only if media exists */}
        {venue.media && venue.media.length > 0 && (
        <div className="border-1 border-blackSecondary mx-2 my-4 flex justify-center items-center flex-col">
            <h2>Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-center items-center self-center">
            {venue.media.map((mediaItem, index) => (
                <div key={index} className="overflow-hidden cursor-pointer" onClick={() => handleImageClick(index)}>
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


      {/* Display the MediaViewer Modal */}
      {isModalOpen && (
        <MediaViewer
          mediaItems={venue.media}
          currentIndex={selectedImageIndex}
          onClose={() => setIsModalOpen(false)}
          onNavigate={handleNavigate}
        />
      )}

      <div className="border-1 border-blackSecondary mx-2 p-8 my-8">
        <h2>Owner</h2>
        <div className="flex flex-row items-center justify-between gap-4">
          <img
            src={venue.owner.avatar.url}
            className="rounded-full border-1 border-grayPrimary max-h-24 min-h-24 max-w-24 min-w-24 object-cover"
            onError={handleImageError} // Handle error for the owner's avatar image
          />
          <p>{venue.owner.name}</p>
        </div>
      </div>
    </>
  );
};

export default SingleVenue;
