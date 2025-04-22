import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const SingleVenueHero = ({ media, expanded }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % media.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [media.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % media.length);
  };

  if (!media || media.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-blackPrimary text-whitePrimary">
        No images available
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden z-10 brightness-75">
      {media.map((item, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 h-full w-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 z-10 pointer-events-auto"
              : "opacity-0 z-0 pointer-events-none"
          }`}
          style={{ backgroundImage: `url(${item.url})` }}
        ></div>
      ))}

      {/* Overlay gradient */}
      <div
        id="overlay"
        className="absolute top-0 w-full h-screen z-20 pointer-events-none transition-opacity duration-1000 ease-in-out"
        style={{
          opacity: expanded ? 0.9 : 0.5, // Adjust opacity based on expanded state
          backgroundImage: 'linear-gradient(to bottom, transparent 1%, #0e0e0e 100%)',
        }}
      ></div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blackPrimary/50 text-whitePrimary p-2 rounded-full z-30 hover:bg-blackPrimary/70"
      >
        <FaChevronLeft className="pr-0.5"/>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blackPrimary/50 text-whitePrimary p-2 rounded-full z-30 hover:bg-blackPrimary/70"
      >
        <FaChevronRight className="pl-0.5" />
      </button>

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2 z-30">
        {media.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-whitePrimary" : "bg-whitePrimary/30"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SingleVenueHero;
