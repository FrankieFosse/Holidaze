import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MediaViewer = ({ mediaItems, currentIndex, onClose, onNavigate }) => {
  const showNavigationButtons = mediaItems.length > 1;

  const handleNavigate = (direction) => {
    const newIndex = (currentIndex + direction + mediaItems.length) % mediaItems.length;
    onNavigate(newIndex);
  };

  const handleImageError = (event) => {
    event.target.src = "/images/NoImagePlaceholder.jpg";
  };

  // 👇 Keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleNavigate(1);
      } else if (event.key === "ArrowLeft") {
        handleNavigate(-1);
      } else if (event.key === "Escape") {
        onClose(); // Optional: close modal on Escape
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, mediaItems.length]); // Only reattach if relevant values change

  return (
    <div className="fixed inset-0 bg-blackPrimary/90 flex justify-center items-center z-50">
      <div className="relative bg-blackPrimary border-1 border-grayPrimary p-2 rounded-lg h-max lg:h-11/12 w-full mx-4 flex justify-center items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold bg-redPrimary/75 p-1 rounded-full duration-150 cursor-pointer hover:bg-redPrimary/100"
        >
          <IoClose />
        </button>

        {showNavigationButtons && (
          <>
            <button
              onClick={() => handleNavigate(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl lg:text-4xl lg:p-2 p-1 rounded-full bg-blackSecondary/75 duration-150 hover:bg-grayPrimary/75 cursor-pointer"
            >
              <FaChevronLeft className="pr-0.5" />
            </button>

            <button
              onClick={() => handleNavigate(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl lg:text-4xl lg:p-2 p-1 rounded-full bg-blackSecondary/75 duration-150 hover:bg-grayPrimary/75 cursor-pointer"
            >
              <FaChevronRight className="pl-0.5" />
            </button>
          </>
        )}

        <img
          src={mediaItems[currentIndex].url}
          alt="Selected Media"
          className="max-w-full h-full object-contain border-1 border-blackPrimary"
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

export default MediaViewer;
