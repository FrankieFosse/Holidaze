import { useState, useEffect } from "react";
import { Link } from "react-router";
import Pagination from "./Pagination";
import LoadingSpinner from "./LoadingSpinner";


const BookingsByProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;  // You can adjust this number

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
        const today = new Date();
        const futureBookings = data.data.filter(
          (booking) => new Date(booking.dateTo) >= today
        );
        setBookings(futureBookings);
      } catch (error) {
        setBookingsError(error.message);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Get current page bookings slice
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  return (
    <div className="my-6">

      {/* Show Pagination only if there is more than 1 page */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}

      {loadingBookings && <LoadingSpinner />}
      {bookingsError && <p className="text-redPrimary">Error: {bookingsError}</p>}
      {!loadingBookings && bookings.length === 0 && <p>No bookings found.</p>}

      <ul
        className={`grid gap-4 mx-4 place-items-center ${
          currentBookings.length < 4 ? "justify-center" : ""
        } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
      >


        {currentBookings.map((booking) => {
          const imageUrl = booking.venue.media?.[0]?.url;

          return (
            <Link
              to={`/booking/${booking.id}`}
              key={booking.id}
              className="block border-1 border-blackSecondary mx-4 mb-4 rounded hover:bg-blackSecondary hover:border-grayPrimary duration-150 bg-cover bg-center w-full"
              style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
              }}
            >
              <div className="backdrop-blur-xs bg-blackPrimary/75 p-4 h-full w-full">
                <p className={`font-bold break-words ${booking.venue.name.length > 8 ? "text-sm" : "text-md"}`}>
                  {booking.venue.name.length > 20
                    ? `${booking.venue.name.slice(0, 20)}...`
                    : booking.venue.name}
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

      {/* Show Pagination only if there is more than 1 page */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
};

export default BookingsByProfile;
