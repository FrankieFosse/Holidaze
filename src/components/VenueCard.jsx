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

  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <li
      onClick={handleClick}
      className="relative bg-cover bg-center max-w-screen min-h-96 max-h-96 flex flex-col justify-end items-center m-8 duration-150 cursor-pointer hover:scale-102"
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
        <div className="bg-blackPrimary/90 text-whitePrimary max-h-24 w-full px-4 py-4 overflow-hidden flex flex-row items-center gap-4 z-10">
          <div className="w-2/3 max-h-16 overflow-hidden text-left">
            <p className={`font-bold break-words ${venue.name.length > 20 ? "text-xs" : "text-lg"}`}>
              {venue.name}
            </p>
            <p className="font-thin text-xs break-words text-ellipsis overflow-hidden">
              {venue.description.length > 80
                ? `${venue.description.slice(0, 80)}...`
                : venue.description}
            </p>
          </div>
          <div>
            <p className="text-sm text-right">{venue.price} NOK / night</p>
          </div>
        </div>
      )}
    </li>
  );
};

export default VenueCard;
