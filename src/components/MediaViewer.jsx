import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";  // Import chevron icons

const MediaViewer = ({ mediaItems, currentIndex, onClose, onNavigate }) => {

  // Function to handle the navigation
  const handleNavigate = (direction) => {
    const newIndex = (currentIndex + direction + mediaItems.length) % mediaItems.length;
    onNavigate(newIndex); // Update the current index
  };

  // Only render the navigation buttons if there's more than one image
  const showNavigationButtons = mediaItems.length > 1;

  // Fallback image handler
  const handleImageError = (event) => {
    event.target.src = "/images/NoImagePlaceholder.jpg"; // Use the fallback image
  };

  return (
    <div className="fixed inset-0 bg-blackPrimary/90 flex justify-center items-center z-50">
      <div className="relative bg-blackPrimary border-1 border-grayPrimary p-2 rounded-lg h-max lg:h-11/12 w-full mx-4 flex justify-center items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold bg-redPrimary/75 p-1 rounded-full duration-150 cursor-pointer hover:bg-redPrimary/100"
        >
          <IoClose />
        </button>

        {/* Navigation Buttons (Only if more than one image) */}
        {showNavigationButtons && (
          <>
            <button
              onClick={() => handleNavigate(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl lg:text-4xl lg:p-2 p-1 rounded-full bg-blackSecondary/75 duration-150 hover:bg-grayPrimary/75 cursor-pointer"
            >
              <FaChevronLeft className="pr-0.5"/>
            </button>

            <button
              onClick={() => handleNavigate(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl lg:text-4xl lg:p-2 p-1 rounded-full bg-blackSecondary/75 duration-150 hover:bg-grayPrimary/75 cursor-pointer"
            >
              <FaChevronRight className="pl-0.5"/>
            </button>
          </>
        )}

        {/* Displaying the current image */}
        <img
          src={mediaItems[currentIndex].url}  // Show the image based on the current index
          alt="Selected Media"
          className="max-w-full h-full object-contain border-1 border-blackPrimary"
          onError={handleImageError} // Handling image error to replace with fallback image
        />
      </div>
    </div>
  );
};

export default MediaViewer;
