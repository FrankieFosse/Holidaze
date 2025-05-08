import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";

const BookingsOnVenue = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`);
        if (!res.ok) throw new Error("Failed to fetch bookings.");
        const json = await res.json();
        setBookings(json.data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id]);

  if (loading) return <p className="text-sm">Loading bookings...</p>;
  if (error) return <p className="text-sm text-redPrimary">Error: {error}</p>;
  if (!bookings.length) return <p className="text-sm">No bookings yet.</p>;

  return (
    <div className="border-1 border-blackSecondary mx-2 my-8 p-4 rounded-md">
      <h2 className="text-lg font-bold mb-4">Bookings on this Venue</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="p-4 border-1 border-grayPrimary rounded flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <div>
              <p><strong>From:</strong> {format(new Date(booking.dateFrom), "dd.MM.yyyy")}</p>
              <p><strong>To:</strong> {format(new Date(booking.dateTo), "dd.MM.yyyy")}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={booking.customer.avatar?.url || "/images/NoImagePlaceholder.jpg"}
                alt={booking.customer.avatar?.alt || "Customer avatar"}
                className="w-16 h-16 rounded-full border-1 border-grayPrimary object-cover"
                onError={(e) => (e.target.src = "/images/NoImagePlaceholder.jpg")}
              />
              <div>
                <p className="font-semibold">{booking.customer.name}</p>
                <p className="text-xs opacity-60">{booking.customer.email}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsOnVenue;
