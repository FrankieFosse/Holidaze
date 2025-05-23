import UpcomingBookingsCalendar from "../components/UpcomingBookingsCalendar";
import { useEffect, useState } from "react";
import BookingsByProfile from "../components/BookingsByProfile";

const UpcomingBookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const data = await response.json();
        setBookings(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-6 mx-2 relative min-h-[200px]">
      <h2 className="text-xl font-bold mb-2 mx-2 mt-16 lg:mt-6">Upcoming Bookings Overview</h2>

      {loading ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
          <div className="border-4 border-white border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      ) : (
        <UpcomingBookingsCalendar bookings={bookings} />
      )}

      <BookingsByProfile />
    </div>
  );
};

export default UpcomingBookingsSection;
