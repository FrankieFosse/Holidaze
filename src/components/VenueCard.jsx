import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const loadAndValidateImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ url, isHorizontal: img.naturalWidth > img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ url: "/images/NoImagePlaceholder.jpg", isHorizontal: false });
    };
    img.src = url;
  });
};

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      const imageUrl = venue.media?.[0]?.url || "/images/NoImagePlaceholder.jpg";
      const { url, isHorizontal } = await loadAndValidateImage(imageUrl);
      setBackgroundImage(url);
      setIsHorizontal(isHorizontal);
      setIsLoading(false);
    };
  
    loadImage();
  }, [venue]);
  

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-cover bg-center max-w-full min-h-80 max-h-96 flex flex-col justify-end items-center m-4 duration-150 cursor-pointer hover:scale-102 rounded 
        ${isHorizontal ? "sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1 2xl:col-span-2" : ""}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
          <div className="border-4 border-white border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}

      {!isLoading && (
        <div className="bg-blackPrimary/90 max-h-42 w-full overflow-hidden px-2 md:px-4 py-2 flex flex-row items-center justify-between z-10">
          <div className="w-3/4 min-h-18 max-h-18 text-left flex flex-col justify-center">
            <p className={`font-bold break-words ${venue.name.length > 8 ? "text-sm" : "text-md"}`}>
              {venue.name.length > 20 ? `${venue.name.slice(0, 20)}...` : venue.name}
            </p>
            <p className="font-thin text-xs break-words text-ellipsis overflow-hidden">
              {venue.description.length > 30
                ? `${venue.description.slice(0, 30)}...`
                : venue.description}
            </p>
          </div>
          {windowWidth >= 300 && (
            <div>
              <div className="text-xs text-right">{venue.price}<br></br><p className="text-grayPrimary">NOK / night</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueCard;
