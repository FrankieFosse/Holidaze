import { useState } from "react";
import { useLocation } from "react-router";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingCalendar from "../components/BookingCalendar";



const Booking = () => {
  const location = useLocation();
  const { venueId, venueName, price, maxGuests } = location.state || {};

  const [guests, setGuests] = useState(1);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const handleBookingSubmit = () => {
    const bookingData = {
      dateFrom: range[0].startDate.toISOString(),
      dateTo: range[0].endDate.toISOString(),
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
      .then((res) => res.json())
      .then((data) => {
        console.log("Booking successful:", data);
        // Optionally redirect or show a success message
      })
      .catch((err) => {
        console.error("Error booking:", err);
      });
  };

  return (
    <div className="booking-container mt-16 p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Book your stay at {venueName}</h1>

      <div className="venue-details mb-4">
        <p>{price} NOK / night</p>
        <p>Max Guests: {maxGuests}</p>
      </div>

      <BookingCalendar onDateChange={({ dateFrom, dateTo }) => {
        setDateFrom(dateFrom);
        setDateTo(dateTo);
        }} />



      <div className="mt-4">
        <label htmlFor="guests" className="block mb-1">Guests</label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) => setGuests(Math.min(e.target.value, maxGuests))}
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
        className="bg-buttonPrimary px-4 py-2 mt-4 rounded hover:bg-buttonSecondary transition"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default Booking;
