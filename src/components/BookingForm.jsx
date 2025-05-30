import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import BookingCalendar from "./BookingCalendar";
import StatusMessage from "./StatusMessage";
import Modal from "./Modal";

const BookingForm = ({
    venueId,
    venueName,
    price,
    maxGuests,
    defaultGuests = 1,
    defaultDateFrom = null,
    defaultDateTo = null,
    onClose,
    bookingId = null,
  }) => {
  
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [guests, setGuests] = useState(defaultGuests);
  const [dateFrom, setDateFrom] = useState(defaultDateFrom);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);
  const navigate = useNavigate();

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictBookingId, setConflictBookingId] = useState(null);  

  const currentUser = JSON.parse(localStorage.getItem("user"))?.name;

const [bookings, setBookings] = useState([]);

const [userBookingId, setUserBookingId] = useState(null);

const [userBookings, setUserBookings] = useState([]);

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


useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`);
      if (!res.ok) throw new Error("Failed to fetch bookings.");
      const json = await res.json();
      const bookings = json.data.bookings || [];

      setBookings(bookings);

      const userBooking = bookings.find(b => b.customer?.name === currentUser);
      if (userBooking) {
        setUserBookingId(userBooking.id);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  fetchBookings();
}, [venueId, currentUser]);

    const formatDate = (date) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date ? new Date(date).toLocaleDateString(undefined, options) : '';
    };


const handleBookingSubmit = async () => {

    const overlappingBooking = userBookings.find(b => {
        const existingFrom = new Date(b.dateFrom);
        const existingTo = new Date(b.dateTo);
        const selectedFrom = new Date(dateFrom);
        const selectedTo = new Date(dateTo);
        const sameBooking = bookingId && b.id === bookingId;
        const differentVenue = b.venue.id !== venueId;
      
        return !sameBooking && differentVenue &&
          selectedFrom < existingTo && selectedTo > existingFrom;
      });
      
      if (overlappingBooking) {
        setConflictBookingId(overlappingBooking.id);
        setShowConflictModal(true);
        return;
      }
      
    

    if (!dateFrom || !dateTo || guests < 1) {
        setStatusMessage("Please select a date range.");
        setStatusType("error");
        setTimeout(() => {
          setStatusMessage("");
          setStatusType(null);
        }, 3000);
        return;
      }
      
      if (dateFrom.toDateString() === dateTo.toDateString()) {
        setStatusMessage("You must select at least two different dates.");
        setStatusType("error");
        setTimeout(() => {
          setStatusMessage("");
          setStatusType(null);
        }, 3000);
        return;
      }
      
  
    setStatusMessage("Processing booking...");
    setStatusType("loading");
  
    try {

      if (userBookingId && userBookingId !== bookingId) {
        const deleteRes = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${userBookingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });
        if (!deleteRes.ok) throw new Error("Failed to delete existing booking.");
      }
  
      const bookingData = {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests,
        venueId,
      };
  
      const res = await fetch(
        bookingId
          ? `https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`
          : "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: bookingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify(bookingData),
        }
      );
  
      if (!res.ok) throw new Error("Failed to save booking. Please try again.");
      const data = await res.json();
  
      setStatusMessage("Booking successful!");
      setStatusType("success");
  
      setTimeout(() => {
        onClose();
        navigate(`/booking/${data.data.id}`, {
          state: { bookingData: data.data },
        });
      }, 1000);
    } catch (err) {
      console.error("Booking error:", err);
      setStatusMessage("Something went wrong. Please try again.");
      setStatusType("error");
    }
  };

  return (
    <div className="booking-container p-0 relative">
      <StatusMessage message={statusMessage} type={statusType} />

      <h1 className="text-xs lg:text-sm 2xl:text-lg mb-4">Book your stay at<br></br> <b>{venueName}</b></h1>

      <div className="venue-details mb-1 font-thin text-xs lg:text-sm 2xl:text-lg">
        <p>{price} NOK / night</p>
      </div>

      <BookingCalendar
        excludedBookings={bookings}
        onDateChange={({ dateFrom, dateTo }) => {
          setDateFrom(dateFrom);
          setDateTo(dateTo);
        }}
        userBookings={userBookings}
        currentVenueId={venueId}
        defaultDateFrom={defaultDateFrom}
        defaultDateTo={defaultDateTo}
      />



      <div className="mt-4 flex flex-row w-full justify-center items-center gap-2">
        <label htmlFor="guests" className="text-xs 2xl:text-lg">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) =>
            setGuests(Math.min(Number(e.target.value), maxGuests))
          }
          min="1"
          max={maxGuests}
          className="border-1 border-blackSecondary bg-whitePrimary text-blackPrimary rounded px-1 w-1/4 sm:w-1/8"
        />
        <p>/ {maxGuests}</p>
      </div>

      {/* Dynamically display "Date From" and "Date To" */}
      <div className="mt-2 flex flex-col sm:flex-row w-full items-center gap-2 justify-evenly">
        <p className="text-xs 2xl:text-sm">
          <strong>Date From:</strong> {formatDate(dateFrom)}
        </p>
        <p className="text-xs 2xl:text-sm">
          <strong>Date To:</strong> {formatDate(dateTo)}
        </p>
      </div>

      {dateFrom && dateTo && (
        <p className="mt-2">
          <strong>Total Price:</strong>{" "}
          {price * Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24))} NOK
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
        onClick={handleBookingSubmit}
        className="bg-buttonPrimary p-2 rounded hover:bg-buttonSecondary duration-150 cursor-pointer text-xs lg:text-sm 2xl:text-lg"
      >
        Confirm Booking
      </button>
      </div>
      <Modal isOpen={showConflictModal} onClose={() => setShowConflictModal(false)}>
        <div className="text-center">
            <p className="my-4">
            You already have a booking in your calendar that overlaps with these dates.
            Do you want to view this booking now?
            </p>
            <div className="flex justify-center gap-4 mt-4">
            <button
                onClick={() => navigate(`/booking/${conflictBookingId}`)}
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

export default BookingForm;
