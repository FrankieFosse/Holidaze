import { useState } from "react";
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
}) => {
  const [guests, setGuests] = useState(defaultGuests);
  const [dateFrom, setDateFrom] = useState(defaultDateFrom);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);
  const navigate = useNavigate();

  const handleBookingSubmit = () => {
    if (!dateFrom || !dateTo || guests < 1) {
      setStatusMessage("Please complete all booking details.");
      setStatusType("error");
      return;
    }

    setStatusMessage("Booking...");
    setStatusType("loading");

    const bookingData = {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      guests,
      venueId,
    };

    fetch("https://v2.api.noroff.dev/holidaze/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to book. Please try again.");
        return res.json();
      })
      .then((data) => {
        setStatusMessage("Booking successful!");
        setStatusType("success");

        // Close modal after a short delay and then navigate
        setTimeout(() => {
          onClose(); // Close the modal
          navigate(`/booking/${data.data.id}`, {
            state: { bookingData: data.data },
          });
        }, 1000);
      })
      .catch((err) => {
        console.error("Booking error:", err);
        setStatusMessage("Something went wrong. Please try again.");
        setStatusType("error");
      });
  };

  return (
    <div className="booking-container p-4 relative">
      <StatusMessage message={statusMessage} type={statusType} />

      <h1 className="text-md mb-4">Book your stay at<br></br> <b>{venueName}</b></h1>

      <div className="venue-details mb-4 font-thin text-sm">
        <p>{price} NOK / night</p>
        <p>Max Guests: {maxGuests}</p>
      </div>

      <BookingCalendar
        onDateChange={({ dateFrom, dateTo }) => {
          setDateFrom(dateFrom);
          setDateTo(dateTo);
        }}
      />

      <div className="mt-4">
        <label htmlFor="guests" className="block mb-1">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) =>
            setGuests(Math.min(Number(e.target.value), maxGuests))
          }
          min="1"
          max={maxGuests}
          className="border-1 border-blackSecondary rounded p-2 w-2/4"
        />
      </div>

      {dateFrom && dateTo && (
        <p className="mt-2">
          <strong>Total Price:</strong>{" "}
          {price * Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24))} NOK
        </p>
      )}

      <button
        onClick={handleBookingSubmit}
        className="bg-buttonPrimary px-4 py-2 mt-4 rounded hover:bg-buttonSecondary duration-150 cursor-pointer text-sm"
      >
        Confirm Booking
      </button>
      <button
        onClick={onClose}
        className="border-blackSecondary border-1 px-4 py-1 mt-2 rounded hover:border-grayPrimary duration-150 cursor-pointer text-sm"
      >
        Cancel
      </button>
    </div>
  );
};

export default BookingForm;
