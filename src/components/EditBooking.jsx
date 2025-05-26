import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BookingCalendar from "./BookingCalendar";
import StatusMessage from "./StatusMessage";
import Modal from "./Modal";

const EditBooking = ({ booking, venue, onClose }) => {
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [guests, setGuests] = useState(booking.guests);
  const [dateFrom, setDateFrom] = useState(new Date(booking.dateFrom));
  const [dateTo, setDateTo] = useState(new Date(booking.dateTo));
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);
  const [venueBookings, setVenueBookings] = useState([]); // Add state for venue bookings
  const [loadingBookings, setLoadingBookings] = useState(true); // Loading state for bookings
  const [hasChanges, setHasChanges] = useState(false); // Track changes to the booking
  const [userBookings, setUserBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      const profileName = localStorage.getItem("name");
      try {
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${profileName}/bookings?_venue=true`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user bookings");
        const json = await res.json();
        setUserBookings(json.data);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
      }
    };
  
    fetchUserBookings();
  }, []);


  // Fetch bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}?_bookings=true`);
        if (!res.ok) throw new Error("Failed to fetch bookings.");
        const json = await res.json();
        setVenueBookings(json.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [venue.id]);

// Track changes to booking fields
useEffect(() => {
    // Ensure dateFrom and dateTo are valid Dates
    const isValidDateFrom = dateFrom instanceof Date && !isNaN(dateFrom);
    const isValidDateTo = dateTo instanceof Date && !isNaN(dateTo);
  
    // Check if both dates are selected and ensure dateFrom < dateTo
    const dateChanged =
      (isValidDateFrom && dateFrom.toDateString() !== new Date(booking.dateFrom).toDateString()) ||
      (isValidDateTo && dateTo.toDateString() !== new Date(booking.dateTo).toDateString());
    const guestChanged = guests !== booking.guests;
  
    setHasChanges(dateChanged || guestChanged);
  }, [guests, dateFrom, dateTo, booking]);
  
  
  // Button should be disabled if either date is missing or invalid
  const isButtonDisabled = !(dateFrom && dateTo && dateFrom < dateTo && hasChanges);
  
  // Function to handle date selection change in BookingCalendar
  const handleDateChange = ({ dateFrom, dateTo }) => {
    // Check if the new date range has only one date selected, disable the button
    setDateFrom(dateFrom);
    setDateTo(dateTo);
  };

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictBookingId, setConflictBookingId] = useState(null);

  


  const handleEditSubmit = async () => {
    if (!dateFrom || !dateTo || guests < 1) {
      setStatusMessage("Please complete all booking details.");
      setStatusType("error");
      return;
    }
  
    const overlappingBooking = userBookings.find(b => {
      const existingFrom = new Date(b.dateFrom);
      const existingTo = new Date(b.dateTo);
      const selectedFrom = new Date(dateFrom);
      const selectedTo = new Date(dateTo);
      const isSameBooking = b.id === booking.id;
      const isSameVenue = b.venue.id === venue.id;
  
      return !isSameBooking && !isSameVenue &&
        selectedFrom < existingTo && selectedTo > existingFrom;
    });
  
    if (overlappingBooking) {
      setConflictBookingId(overlappingBooking.id);
      setShowConflictModal(true);
      return;
    }
  
    setStatusMessage("Updating booking...");
    setStatusType("loading");
  
    // Add a 1-second delay before executing the update
    setTimeout(async () => {
      try {
        const updatedBooking = {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId: venue.id,
        };
  
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${booking.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify(updatedBooking),
        });
  
        if (!res.ok) throw new Error("Failed to update booking.");
        const data = await res.json();
  
        setStatusMessage("Booking updated!");
        setStatusType("success");
        location.reload();
  
        setTimeout(() => {
          onClose();
          navigate(`/booking/${data.data.id}`, {
            state: { bookingData: data.data },
          });
        }, 1000);
      } catch (err) {
        console.error("Edit error:", err);
        setStatusMessage("Update failed. Please try again.");
        setStatusType("error");
      }
    }, 1000);
  };
  
  

  // Helper function to format date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date ? new Date(date).toLocaleDateString(undefined, options) : '';
  };

  if (loadingBookings) return <p>Loading bookings...</p>; // Handle loading state


  

  return (
    <div className="booking-container relative 2xl:text-xl text-xs flex flex-col justify-center items-center">
      <StatusMessage message={statusMessage} type={statusType} />

      <h1 className="mb-4 w-max">
        Edit your booking at<br /> <b>{venue.name}</b>
      </h1>

      <div className="venue-details mb-1 font-thin text-xs lg:text-sm 2xl:text-lg">
        <p>{venue.price} NOK / night</p>
      </div>

      <BookingCalendar
        closeModal={closeModal}
        excludedBookings={venueBookings.filter((b) => b.id !== booking.id)} // current venue bookings
        onDateChange={handleDateChange}
        defaultDateFrom={dateFrom}
        defaultDateTo={dateTo}
        userBookings={userBookings} // pass user bookings here
        currentVenueId={venue.id}   // also pass current venue id
      />


      <div className="mt-2 flex flex-row w-full justify-center items-center gap-2">
        <label htmlFor="guests" className="text-xs lg:text-sm 2xl:text-lg">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) =>
            setGuests(Math.min(Number(e.target.value), venue.maxGuests))
          }
          min="1"
          max={venue.maxGuests}
          className="border-1 border-blackSecondary bg-whitePrimary text-blackPrimary rounded px-1 w-1/4 sm:w-1/8"
        />
        <p>/ {venue.maxGuests}</p>
      </div>

      {/* Dynamically display "Date From" and "Date To" */}
      <div className="mt-2 flex flex-col sm:flex-row w-full items-center gap-2 justify-evenly">
        <p className="text-xs lg:text-sm">
          <strong>Date From:</strong> {formatDate(dateFrom)}
        </p>
        <p className="text-xs lg:text-sm">
          <strong>Date To:</strong> {formatDate(dateTo)}
        </p>
      </div>

      {dateFrom && dateTo && (
        <p className="mt-2">
          <strong>Total Price:</strong>{" "}
          {venue.price * Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24))}{" "}
          NOK
        </p>
      )}

      <div className="w-full flex justify-between mt-2">
        <button
          onClick={onClose}
          className="border-blackSecondary border-1 py-2 px-4 rounded hover:border-grayPrimary duration-150 cursor-pointer text-xs lg:text-sm 2xl:text-lg"
        >
          Cancel
        </button>
        <button
            onClick={handleEditSubmit}
            className={`bg-buttonPrimary p-2 rounded hover:bg-buttonSecondary duration-150 cursor-pointer text-xs lg:text-sm 2xl:text-lg ${isButtonDisabled ? "bg-grayPrimary hover:bg-grayPrimary cursor-not-allowed" : ""}`}
            disabled={isButtonDisabled} // Disable if only one date selected or if no changes
            >
            Save Changes
            </button>

      </div>

      <Modal isOpen={showConflictModal} onClose={() => setShowConflictModal(false)}>
        <div className="text-center text">
          <p className="my-4">
            You already have another booking that overlaps with these dates.
            Do you want to view that booking?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                setShowConflictModal(false);
                navigate(`/booking/${conflictBookingId}`);
              }}
              className="bg-buttonPrimary px-4 py-2 rounded hover:bg-buttonSecondary transition text-sm 2xl:text-lg cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConflictModal(false)}
              className="border border-grayPrimary px-4 py-2 rounded hover:bg-grayPrimary transition text-sm 2xl:text-lg cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default EditBooking;
