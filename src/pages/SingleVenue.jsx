import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SingleVenueHero from "../components/SingleVenueHero";
import Rating from "../components/Rating";
import Description from "../components/Description";
import { FaLongArrowAltRight, FaWifi, FaLongArrowAltLeft } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import MediaViewer from "../components/MediaViewer";  // Importing MediaViewer
import BookingForm from "../components/BookingForm";
import Return from "../components/Return";
import DeleteModal from "../components/DeleteModal";
import Modal from "../components/Modal";
import BookingsOnVenue from "../components/BookingsOnVenue";
import EditBooking from "../components/EditBooking";  // Import the EditBooking component

const SingleVenue = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [userBooking, setUserBooking] = useState(null); // To store the user's booking if it exists
  
  // Assume current user is stored in localStorage
  const currentUser = localStorage.getItem("name"); // Adjust this to match your auth structure
  const token = localStorage.getItem("token");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete venue");
        navigate("/profile", { state: { message: "Venue deleted successfully" } });
      })
      .catch((err) => {
        console.error(err);
        // Optionally show error message in UI
      });
  };

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
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`);
        if (!response.ok) throw new Error("Failed to fetch venue");
        const json = await response.json();
        setVenue(json.data);
        setBookings(json.data.bookings); // Save bookings here

        // Check if the current user already has a booking for this venue
        const userBooking = json.data.bookings.find(
          (booking) => booking.customer.name === currentUser
        );
        setUserBooking(userBooking);
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
        <div>
          <Rating venue={venue} />
        </div>
      </div>

      <Return />

      <div className="border-1 border-blackSecondary mx-2 my-4">
        <div className="flex flex-row justify-evenly items-center my-4 mx-2 gap-4">
          <p className="text-sm">{venue.price} NOK / night</p>
          <button
            className={`flex items-center w-max py-2 px-2 text-md duration-150 cursor-pointer gap-2 ${currentUser === venue.owner.name ? "bg-blackSecondary text-grayPrimary cursor-default" : "bg-buttonPrimary hover:bg-buttonSecondary"}`}
            onClick={() => {
              if (currentUser === venue.owner.name) {
                return; // Do nothing if the current user is the owner
              }
              if (userBooking) {
                // If the user has a booking, open EditBooking
                setShowBookingForm(true);
              } else {
                // If the user doesn't have a booking, open BookingForm
                setShowBookingForm(true);
              }
            }}
            disabled={currentUser === venue.owner.name} // Disable button if the user is the owner
          >
            {userBooking ? "Edit Booking" : "Book Now"} <FaLongArrowAltRight />
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
            { condition: venue.meta.breakfast, icon: <MdOutlinePets className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Pets allowed" }].map(({ condition, icon, label }, index) => condition && (
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

      {showBookingForm && (
        <Modal isOpen={showBookingForm} onClose={() => setShowBookingForm(false)}>
          {userBooking ? (
            <EditBooking booking={userBooking} venue={venue} onClose={() => setShowBookingForm(false)} />
          ) : (
            <BookingForm
              venueId={venue.id}
              venueName={venue.name}
              price={venue.price}
              maxGuests={venue.maxGuests}
              onClose={() => setShowBookingForm(false)}
              excludedBookings={bookings}
            />
          )}
        </Modal>
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this venue?"
      />
    </>
  );
};

export default SingleVenue;
