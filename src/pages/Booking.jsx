import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import SingleVenueHero from "../components/SingleVenueHero";
import { FaLongArrowAltRight } from "react-icons/fa";
import Return from "../components/Return";
import StatusMessage from "../components/StatusMessage";
import Modal from "../components/Modal";
import EditBooking from "../components/EditBooking";
import LoadingSpinner from "../components/LoadingSpinner";



const Booking = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("name");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (bookingDetails) {
      document.title = `${bookingDetails.venue.name} | Holidaze`;
    }
  }, [bookingDetails]);


  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setStatusMessage("Loading booking...");
        setStatusType("loading");

        const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${id}?_venue=true&_venue.bookings=true&_customer=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch booking details");

        const data = await response.json();
        setBookingDetails(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setStatusMessage("");
      }
    };

    fetchBookingDetails();
  }, [id]);

  const showTemporaryMessage = (message, type = "success") => {
    setStatusMessage(message);
    setStatusType(type);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleViewVenue = () => {
    if (bookingDetails?.venue?.id) {
      navigate(`/venues/${bookingDetails.venue.id}`);
    }
  };

  const handleDeleteBooking = async () => {
    setIsDeleteModalOpen(false);
  
    try {
      showTemporaryMessage("Deleting booking...", "loading");
  
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });
  
      if (!response.ok) throw new Error("Failed to delete booking");
  
      showTemporaryMessage("Booking deleted successfully.", "success");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      showTemporaryMessage("Error deleting booking: " + error.message, "error");
    }
  };
  

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;
  if (!bookingDetails) return <p>No booking found</p>;

  const { venue, customer, dateFrom, dateTo, guests } = bookingDetails;
  const totalPrice = venue ? venue.price * Math.ceil((new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24)) : 0;

  // Check if current user owns this booking
  const isOwner = customer?.name === currentUser;

  return (
    <div>
      <Return />
      <StatusMessage message={statusMessage} type={statusType} />

      <div className="brightness-50 blur-xs">
        <SingleVenueHero media={venue.media} />
      </div>

      <div className="venue-details mb-4 absolute w-full 2xl:top-36 lg:top-20 top-16 lg:right-0 z-10 flex flex-col justify-center items-center 2xl:text-xl">
        <h1 className="text-lg 2xl:text-2xl font-semibold mb-2 w-3/5">{venue?.name}</h1>
        <button
          onClick={handleViewVenue}
          className="bg-buttonPrimary px-3 py-1 text-sm flex gap-2 items-center justify-center duration-150 hover:bg-buttonSecondary cursor-pointer rounded"
        >
          View Venue <FaLongArrowAltRight />
        </button>

        <div className="border-y-1 border-grayPrimary p-4 my-4">
          <p>{venue?.price} NOK / night</p>
          <p>Max Guests: {venue?.maxGuests}</p>
          <div className="booking-dates mb-4">
            <p><strong>Booking Dates:<br /></strong> {new Date(dateFrom).toLocaleDateString()} - {new Date(dateTo).toLocaleDateString()}</p>
          </div>
          <div className="guests mb-4">
            <p><strong>Guests:</strong> {guests}</p>
          </div>
          <div className="total-price mb-2">
            <p><strong>Total Price:</strong> {totalPrice} NOK</p>
          </div>
        </div>

        <div>
          <p>Booked by {bookingDetails.customer.name}</p>
          <p className="text-xs md:text-sm font-thin opacity-75">Booked {bookingDetails.created.slice(0, 10).split('-').reverse().join('.')}</p>
        </div>

        {/* Conditionally show Edit/Delete buttons only if user owns the booking */}
        {isOwner && (
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-buttonPrimary px-3 py-1 duration-150 cursor-pointer hover:bg-buttonSecondary w-52 rounded"
            >
              Edit Booking
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-redPrimary px-3 py-1 duration-150 cursor-pointer hover:bg-redSecondary w-52 rounded"
            >
              Delete Booking
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-xs lg:text-sm 2xl:text-lg font-semibold mb-4 pt-8">Are you sure you want to delete this booking?</h2>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleDeleteBooking}
              className="bg-redPrimary px-4 py-2 rounded hover:bg-redSecondary duration-150 cursor-pointer text-xs lg:text-sm 2xl:text-lg"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-grayPrimary/50 px-4 py-2 rounded hover:bg-grayPrimary duration-150 cursor-pointer text-xs lg:text-sm 2xl:text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <EditBooking
          booking={bookingDetails}
          venue={venue}
          onClose={() => {
            setIsEditing(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Booking;
