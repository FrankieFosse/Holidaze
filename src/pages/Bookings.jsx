import UpcomingBookingsCalendar from "../components/UpcomingBookingsCalendar";
import { useEffect, useState } from "react";
import BookingsByProfile from "../components/BookingsByProfile";
import LoadingSpinner from "../components/LoadingSpinner";

const UpcomingBookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
      document.title = "Bookings | Holidaze";
    }, []);  

  useEffect(() => {
    const fetchBookings = async () => {
      const profileName = localStorage.getItem("name");
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await response.json();
        setBookings(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-6 mx-2 relative min-h-[200px]">
      <h2 className="text-xl font-bold mb-2 mx-2 mt-24">Upcoming Bookings Overview</h2>

      {error && <p className="text-redPrimary text-center">{error}</p>}

      {loading ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
          <LoadingSpinner />
        </div>
      ) : (
        <UpcomingBookingsCalendar bookings={bookings} />
      )}

      <BookingsByProfile />
    </div>
  );
};

export default UpcomingBookingsSection;
