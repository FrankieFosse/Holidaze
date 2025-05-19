import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

// Helper function to validate the image URL
const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);  // Valid image
    img.onerror = () => resolve("/images/NoImagePlaceholder.jpg"); // Fallback image if error
    img.src = url;
  });
};

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Spinner state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      const validUrl = venue.media && venue.media.length > 0
        ? await validateImageUrl(venue.media[0].url)
        : "/images/NoImagePlaceholder.jpg";
      setBackgroundImage(validUrl);
      setIsLoading(false);
    };

    loadImage();
  }, [venue]);

  // Track window resize to update windowWidth state
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-cover bg-center max-w-full min-h-80 max-h-96 flex flex-col justify-end items-center m-4 duration-150 cursor-pointer hover:scale-102"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
    >
      {/* Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
          <div className="border-4 border-white border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}

      {/* Card content */}
      {!isLoading && (
        <div className="bg-blackPrimary/90 max-h-42 w-full overflow-hidden px-2 md:px-4 py-2 flex flex-row items-center z-10">
          <div className="w-2/3 min-h-18 max-h-18 text-left flex flex-col justify-center">
            <p className={`font-bold break-words ${venue.name.length > 8 ? "text-sm" : "text-md"}`}>
              {venue.name.length > 20 ? `${venue.name.slice(0, 20)}...` : venue.name}
            </p>
            <p className="font-thin text-xs break-words text-ellipsis overflow-hidden">
              {venue.description.length > 30
                ? `${venue.description.slice(0, 30)}...`
                : venue.description}
            </p>
          </div>
          {/* Conditionally render price if window width >= 300px */}
          {windowWidth >= 300 && (
            <div>
              <p className="text-sm text-right">{venue.price} NOK / night</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueCard;
