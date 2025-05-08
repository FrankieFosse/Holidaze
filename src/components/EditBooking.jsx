import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BookingCalendar from "./BookingCalendar";
import StatusMessage from "./StatusMessage";

const EditBooking = ({ booking, venue, onClose }) => {
  const navigate = useNavigate();

  const [guests, setGuests] = useState(booking.guests);
  const [dateFrom, setDateFrom] = useState(new Date(booking.dateFrom));
  const [dateTo, setDateTo] = useState(new Date(booking.dateTo));
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);
  const [venueBookings, setVenueBookings] = useState([]); // Add state for venue bookings
  const [loadingBookings, setLoadingBookings] = useState(true); // Loading state for bookings

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

  const handleEditSubmit = async () => {
    if (!dateFrom || !dateTo || guests < 1) {
      setStatusMessage("Please complete all booking details.");
      setStatusType("error");
      return;
    }

    setStatusMessage("Updating booking...");
    setStatusType("loading");

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
          "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
        },
        body: JSON.stringify(updatedBooking),
      });

      if (!res.ok) throw new Error("Failed to update booking.");
      const data = await res.json();

      setStatusMessage("Booking updated!");
      setStatusType("success");

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
  };

  if (loadingBookings) return <p>Loading bookings...</p>; // Handle loading state

  return (
    <div className="booking-container p-0 relative">
      <StatusMessage message={statusMessage} type={statusType} />

      <h1 className="text-xs mb-4">
        Edit your booking at<br /> <b>{venue.name}</b>
      </h1>

      <div className="venue-details mb-1 font-thin text-sm">
        <p>{venue.price} NOK / night</p>
        <p>Max guests: {venue.maxGuests}</p>
      </div>

      <BookingCalendar
        excludedBookings={venueBookings.filter((b) => b.id !== booking.id)} // Exclude the current booking
        onDateChange={({ dateFrom, dateTo }) => {
          setDateFrom(dateFrom);
          setDateTo(dateTo);
        }}
        defaultDateFrom={dateFrom}
        defaultDateTo={dateTo}
      />

      <div className="mt-4 flex flex-row w-full justify-center items-center gap-2">
        <label htmlFor="guests" className="text-xs">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) =>
            setGuests(Math.min(Number(e.target.value), venue.maxGuests))
          }
          min="1"
          max={venue.maxGuests}
          className="border-1 border-blackSecondary rounded px-1 w-1/4"
        />
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
          className="border-blackSecondary border-1 py-2 px-4 rounded hover:border-grayPrimary duration-150 cursor-pointer text-xs"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSubmit}
          className="bg-buttonPrimary p-2 rounded hover:bg-buttonSecondary duration-150 cursor-pointer text-xs"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditBooking;
