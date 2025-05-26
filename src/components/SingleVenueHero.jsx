import { FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";


const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
};


const SingleVenueHero = ({ media, expanded }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [validMedia, setValidMedia] = useState([]);

  const location = useLocation();
  const hideControls = location.pathname.includes("booking");

  useEffect(() => {
    const loadValidMedia = async () => {
      if (!media || media.length === 0) {
        setValidMedia([{ url: "/images/NoImagePlaceholder.jpg" }]);
        return;
      }

      const validated = await Promise.all(
        media.map(async (item) => {
          const validUrl = await validateImageUrl(item.url);
          return validUrl ? { url: validUrl } : null;
        })
      );

      const filtered = validated.filter(Boolean);
      setValidMedia(filtered.length > 0 ? filtered : [{ url: "/images/NoImagePlaceholder.jpg" }]);
    };

    loadValidMedia();
  }, [media]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % validMedia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [validMedia]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % validMedia.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden z-10 brightness-75">
      {validMedia.map((item, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`absolute top-0 left-0 h-full w-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url(${item.url})`,
              transition: "opacity 1s ease-in-out, filter 0.7s ease-in-out",
              filter: expanded ? "brightness(0.5)" : "brightness(1)",
            }}
          ></div>
        );
      })}

<div
  className="absolute top-0 left-0 w-full h-36 z-30 pointer-events-none"
  style={{
    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0))',
  }}
></div>




      <div
        id="overlay"
        className="absolute top-0 w-full h-screen z-20 pointer-events-none transition-opacity duration-1000 ease-in-out"
        style={{
          opacity: expanded ? 1 : 0.5,
          backgroundImage: 'linear-gradient(to bottom, transparent 1%, #0e0e0e 100%)',
        }}
      ></div>

      {validMedia.length > 1 && !hideControls && (
        <>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blackPrimary/50 p-2 rounded-full z-50 hover:bg-blackPrimary/70 cursor-pointer duration-150 text-md lg:text-3xl"
          >
            <FaChevronRight className="pl-0.5" />
          </button>

          <div className="absolute bottom-3 w-full flex justify-center gap-2 z-30">
            {validMedia.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-whitePrimary" : "bg-whitePrimary/30"}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SingleVenueHero;
