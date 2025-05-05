import { useState, useEffect } from "react";

const BookingsByProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const profileName = localStorage.getItem("name");

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-Noroff-API-Key": `178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.data);
      } catch (error) {
        setBookingsError(error.message);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="mt-6">
      {loadingBookings && <p>Loading bookings...</p>}
      {bookingsError && <p className="text-red-500">Error: {bookingsError}</p>}
      {!loadingBookings && bookings.length === 0 && <p>No bookings found.</p>}

      <ul className="space-y-4 mt-4">
        {bookings.map((booking) => (
          <li key={booking.id} className="border border-gray-200 p-4 rounded shadow-sm">
            <p><strong>Date From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
            <p><strong>Date To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p className="text-sm text-gray-500">Booked on: {new Date(booking.created).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsByProfile;
