import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import BookingCalendar from "./BookingCalendar";
import StatusMessage from "./StatusMessage";

const BookingForm = ({
    venueId,
    venueName,
    price,
    maxGuests,
    defaultGuests = 1,
    defaultDateFrom = null,
    defaultDateTo = null,
    onClose,
    bookingId = null, // <- Add this
  }) => {
  
  const [guests, setGuests] = useState(defaultGuests);
  const [dateFrom, setDateFrom] = useState(defaultDateFrom);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"))?.name;

// Inside BookingForm component
const [bookings, setBookings] = useState([]);

const [userBookingId, setUserBookingId] = useState(null);

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

  


const handleBookingSubmit = async () => {
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
      // If user has an existing booking (and it's NOT the one being edited), delete it
      if (userBookingId && userBookingId !== bookingId) {
        const deleteRes = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${userBookingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
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
            "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
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

      <h1 className="text-xs mb-4">Book your stay at<br></br> <b>{venueName}</b></h1>

      <div className="venue-details mb-1 font-thin text-sm">
        <p>{price} NOK / night</p>
      </div>

      <BookingCalendar
        excludedBookings={bookings}
        onDateChange={({ dateFrom, dateTo }) => {
            setDateFrom(dateFrom);
            setDateTo(dateTo);
        }}
        />


      <div className="mt-4 flex flex-row w-full justify-center items-center gap-2">
        <label htmlFor="guests" className="text-xs">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) =>
            setGuests(Math.min(Number(e.target.value), maxGuests))
          }
          min="1"
          max={maxGuests}
          className="border-1 border-blackSecondary rounded px-1 w-1/4"
        />
        <p>/ {maxGuests}</p>
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
            className="border-blackSecondary border-1 py-2 px-4 rounded hover:border-grayPrimary duration-150 cursor-pointer text-xs"
        >
            Cancel
        </button>
      <button
        onClick={handleBookingSubmit}
        className="bg-buttonPrimary p-2 rounded hover:bg-buttonSecondary duration-150 cursor-pointer text-xs"
      >
        Confirm Booking
      </button>
      </div>
    </div>
  );
};

export default BookingForm;
