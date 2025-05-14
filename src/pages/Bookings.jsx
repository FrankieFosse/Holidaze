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
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2 mt-16">Upcoming Bookings Overview</h2>
      {loading ? <p>Loading...</p> : <UpcomingBookingsCalendar bookings={bookings} />}
      <BookingsByProfile />
    </div>
  );
};

export default UpcomingBookingsSection;
