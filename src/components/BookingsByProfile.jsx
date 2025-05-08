import { useState, useEffect } from "react";
import { Link } from "react-router";


const BookingsByProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const profileName = localStorage.getItem("name");

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/bookings?_venue=true`,
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
    <div className="my-6">
      {loadingBookings && <p>Loading bookings...</p>}
      {bookingsError && <p className="text-redPrimary">Error: {bookingsError}</p>}
      {!loadingBookings && bookings.length === 0 && <p>No bookings found.</p>}
      
      <ul className="space-y-4 mt-4">
        {bookings.map((booking) => {
            const imageUrl = booking.venue.media?.[0]?.url;

            return (
            <Link
                to={`/booking/${booking.id}`}
                key={booking.id}
                className="block border-1 border-blackSecondary mx-4 rounded hover:bg-blackSecondary hover:border-grayPrimary duration-150 bg-cover bg-center"
                style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                }}
            >
                <div className="backdrop-blur-xs bg-blackPrimary/75 p-4 rounded">
                <p className={`font-bold break-words ${booking.venue.name.length > 8 ? "text-sm" : "text-md"}`}>
            {booking.venue.name.length > 20 ? `${booking.venue.name.slice(0, 20)}...` : booking.venue.name}
                </p>
                <p><strong>Date From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
                <p><strong>Date To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p className="text-sm text-grayPrimary">Booked on: {new Date(booking.created).toLocaleString()}</p>
                </div>
            </Link>
            );
        })}
        </ul>

    </div>
  );
};

export default BookingsByProfile;
