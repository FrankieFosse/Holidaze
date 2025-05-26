import { useParams, useNavigate, Link } from "react-router";
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
import BookingCalendar from "../components/BookingCalendar";
import { format } from "date-fns";
import StatusMessage from "../components/StatusMessage";
import LoadingSpinner from "../components/LoadingSpinner";




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
  const [userBooking, setUserBooking] = useState(null);
  const [isAddingNewBooking, setIsAddingNewBooking] = useState(false); // New state for distinguishing the "Add Another Booking"

  // Assume current user is stored in localStorage
  const currentUser = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (venue) {
      document.title = `${venue.name} | Holidaze`;
    }
  }, [venue]);
  

  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);

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
        setStatusMessage("Venue deleted successfully");
        setStatusType("success");
        setTimeout(() => {
          navigate("/profile");
        }, 1500); // Delay to let user see the message
      })
      .catch((err) => {
        console.error(err);
        setStatusMessage("Failed to delete venue");
        setStatusType("error");
      });
  };
  
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);
  


  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNavigate = (newIndex) => {
    setSelectedImageIndex(newIndex);
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

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;
  if (!venue) return <p>No venue found</p>;

  const isOwner = venue.owner.name === currentUser;

  const hasLocationValues = venue.location && Object.values(venue.location).some(value => value);

 

  return (
    <>
    <StatusMessage message={statusMessage} type={statusType} />
      <SingleVenueHero media={venue.media} expanded={expanded} />

      <div className="absolute left-0 z-30 p-4 bottom-4 lg:bottom-16 lg:p-16 w-full overflow-hidden flex flex-row justify-between items-center gap-4 pointer-events-none">
        <div className="text-left w-3/5 pointer-events-auto">
          <h2 className={`font-bold break-words overflow-hidden text-ellipsis ${venue.name.length > 100 ? "text-sm lg:text-xl" : "text-xl lg:text-3xl"}`}>
            {venue.name}
          </h2>

          <Description text={venue.description} onExpandToggle={handleExpandToggle} />
        </div>
        <div className="pointer-events-auto">
          <Rating venue={venue} />
        </div>
      </div>

      <Return />

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:text-lg lg:text-xl xl:text-2xl">

      <div className="border-1 border-blackSecondary mx-2 my-4">
        <div className="flex flex-row justify-evenly items-center my-4 mx-2 gap-4">
          <p className="">{venue.price} NOK / night</p>
          <div className="flex items-center gap-2">
          {userBooking ? (
          <div className="flex flex-col gap-4">
            <button
              className="bg-buttonPrimary hover:bg-buttonSecondary py-1 px-2 min-h-8 max-h-16 duration-150 cursor-pointer rounded lg:text-lg"
              onClick={() => navigate(`/booking/${userBooking.id}`)}
            >
              View booking
            </button>
            {!isOwner && (
              <button
                className="bg-buttonPrimary hover:bg-buttonSecondary py-1 px-2 min-h-8 max-h-16 duration-150 cursor-pointer rounded lg:text-lg"
                onClick={() => {
                  setIsAddingNewBooking(true);
                  setShowBookingForm(true);
                }}
              >
                Add another booking
              </button>
            )}
          </div>
        ) : (
          <button
            className={`rounded py-2 px-4 ${isOwner ? "bg-grayPrimary cursor-default" : "bg-buttonPrimary hover:bg-buttonSecondary cursor-pointer"}`}
            disabled={isOwner}
            onClick={() => {
              if (!token || !currentUser) {
                navigate("/login");
                return;
              }
              if (!isOwner) {
                setIsAddingNewBooking(true);
                setShowBookingForm(true);
              }
            }}            
          >
            Book Now
          </button>
        )}

          </div>
        </div>

        {/* Display other venue details like max guests, amenities, etc. */}
        <div className="flex flex-col justify-center items-center">
          <p>Max Guests</p>
          <div className="border-1 border-grayPrimary rounded-full min-w-16 min-h-16 p-2 flex items-center justify-center">{venue.maxGuests}</div>
        </div>
        <div className="flex flex-row justify-evenly my-4 gap-4 scale-80">
          {[{ condition: venue.meta.wifi, icon: <FaWifi className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "WiFi included" },
            { condition: venue.meta.parking, icon: <MdLocalParking className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Parking included" },
            { condition: venue.meta.pets, icon: <MdFreeBreakfast className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Breakfast included" },
            { condition: venue.meta.breakfast, icon: <MdOutlinePets className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Pets allowed" }].map(({ condition, icon, label }, index) => condition && (
              <div key={index} className="flex flex-col items-center gap-2">
                {icon}
                <p className="text-xs md:text-lg font-thin">{label}</p>
              </div>
            ))}
        </div>
        <p className="text-xs md:text-sm font-thin opacity-50">Created {venue.created.slice(0, 10).split('-').reverse().join('.')}</p>
      </div>

      {/* Owner Section */}
      <div className="border-1 border-blackSecondary mx-2 my-4 p-4 flex-col justify-center items-center">
        <h2 className="font-bold mb-2">Venue Owner</h2>
        <div className="justify-center items-center flex flex-col">
        <p className="font-semibold">{venue.owner.name}</p>
        <img src={venue.owner.avatar.url} className="min-h-16 max-h-16 min-w-16 max-w-16 rounded-full" />
        </div>
      </div>

      {hasLocationValues && (
        <div className="border-1 border-blackSecondary mx-2 my-4 p-4">
          <h2 className="font-bold mb-2">Location Details</h2>
          <div className="text-whiteSecondary">
            {venue.location.address && <p><strong>Address:</strong> {venue.location.address}</p>}
            {venue.location.city && <p><strong>City:</strong> {venue.location.city}</p>}
            {venue.location.zip && <p><strong>ZIP:</strong> {venue.location.zip}</p>}
            {venue.location.country && <p><strong>Country:</strong> {venue.location.country}</p>}
            {venue.location.continent && <p><strong>Continent:</strong> {venue.location.continent}</p>}
          </div>
        </div>
      )}




      {/* Booked Dates Overview */}
      {isOwner && bookings.length > 0 && (
        <div className="border-1 border-blackSecondary mx-2 my-4 p-4 col-span-1 md:col-span-3 justify-center items-center flex flex-col lg:text-lg">
          <h2 className="font-bold mb-4">Booked Dates</h2>
          <ul
            className={`list-none pl-5 flex flex-col lg:grid ${
              bookings.length === 1
                ? "grid-cols-1"
                : bookings.length === 2
                ? "grid-cols-2"
                : bookings.length === 3
                ? "grid-cols-3"
                : "grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            } gap-2`}
          >
            {bookings
              .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
              .map((booking) => (
                <li key={booking.id}>
                  <Link
                    to={`/booking/${booking.id}`}
                    className="font-semibold bg-buttonPrimary hover:bg-buttonSecondary duration-150 px-6 py-1 rounded flex justify-center items-center w-max"
                  >
                    {format(new Date(booking.dateFrom), "dd.MM.yyyy")} →{" "}
                    {format(new Date(booking.dateTo), "dd.MM.yyyy")}
                    <br />
                    ({booking.guests} guest{booking.guests > 1 ? "s" : ""})
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}




    </div>

  {/* Media Section */}
  {venue.media && venue.media.length > 0 && (
    <div className="border-1 border-blackSecondary mx-2 my-4 flex justify-center items-center flex-col h-max">
      <h2>Media</h2>
      <div
        className={`grid gap-4 p-4 place-items-center ${
          venue.media.length === 1
            ? 'grid-cols-1'
            : venue.media.length === 2
            ? 'grid-cols-2'
            : venue.media.length === 3
            ? 'grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {venue.media.map((mediaItem, index) => (
          <div
            key={index}
            className="overflow-hidden cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
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
          <BookingForm
            venueId={venue.id}
            venueName={venue.name}
            price={venue.price}
            maxGuests={venue.maxGuests}
            isAddingNewBooking={isAddingNewBooking}  // Pass the flag to BookingForm
            onClose={() => setShowBookingForm(false)}
            excludedBookings={bookings}
          />
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

    {isOwner && (
      <div className="flex justify-center gap-4 my-6">
        <button
          onClick={() => navigate(`/venues/edit/${venue.id}`)}
          className="bg-buttonPrimary hover:bg-buttonSecondary px-4 py-2 w-20 rounded cursor-pointer duration-150"
        >
          Edit
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-redPrimary hover:bg-redSecondary px-4 py-2 w-20 rounded cursor-pointer duration-150"
        >
          Delete
        </button>
      </div>
    )}

    </>
  );
};

export default SingleVenue;
