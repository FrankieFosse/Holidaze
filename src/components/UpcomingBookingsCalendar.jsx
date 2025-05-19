import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfMonth,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import BookingsByProfile from "./BookingsByProfile";

const UpcomingBookingsCalendar = ({ bookings = [] }) => {
  const today = new Date();
  const twoYearsLater = addMonths(today, 24);

  const [currentMonth, setCurrentMonth] = useState(today);

  const navigate = useNavigate();

  const bookedIntervals = bookings.map((b) => ({
    start: new Date(b.dateFrom),
    end: new Date(b.dateTo),
    id: b.id,
  }));

  const isPrevDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();
  const isNextDisabled = currentMonth > twoYearsLater;

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const isBooked = (date) =>
    bookedIntervals.some((interval) => isWithinInterval(date, interval));

  const getBookingForDay = (date) =>
    bookedIntervals.find((interval) => isWithinInterval(date, interval));

  // Check if the date is the first or last day of a booking
  const isFirstDayOfBooking = (date, booking) => isSameDay(date, booking.start);
  const isLastDayOfBooking = (date, booking) => isSameDay(date, booking.end);

  return (
    <div className="p-2 border border-blackSecondary rounded w-full max-w-md mx-auto min-h-80 max-h-120 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => !isPrevDisabled && setCurrentMonth(addMonths(currentMonth, -1))}
          disabled={isPrevDisabled}
          className={`text-xs p-1 border-1 border-blackSecondary duration-150 rounded ${isPrevDisabled ? "text-blackSecondary border-blackSecondary cursor-default" : "cursor-pointer hover:bg-blackSecondary hover:border-grayPrimary"}`}
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xs font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          onClick={() => !isNextDisabled && setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={isNextDisabled}
          className={`text-xs p-1 border-1 border-blackSecondary duration-150 rounded ${isNextDisabled ? "text-blackSecondary border-blackSecondary cursor-default" : "cursor-pointer hover:bg-blackSecondary hover:border-grayPrimary"}`}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {Array(startOfMonth(currentMonth).getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
        const booking = getBookingForDay(day);
        const isPast = isBefore(day, today);
        const isAfterTwoYears = isAfter(day, twoYearsLater);
        const disabled = !booking || isPast || isAfterTwoYears;

        let classes =
            "w-full aspect-square rounded-md text-center transition duration-150 flex justify-center items-center border-1 border-blackSecondary ";

            if (isPast || isAfterTwoYears) {
                classes += "text-blackSecondary border-blackSecondary cursor-default";
            } else if (booking) {
                classes += "bg-buttonPrimary hover:bg-buttonSecondary";
            } else {
                classes += "text-whiteSecondary hover:text-whitePrimary hover:bg-blackSecondary hover:border-grayPrimary border-blackSecondary";
            }
            

        return (
            <button
            key={day.toISOString()}
            onClick={() => booking && navigate(`/booking/${booking.id}`)}
            disabled={disabled}
            className={classes + (booking ? " cursor-pointer" : "")}
            >
            {format(day, "d")}
            </button>
        );
        })}

      </div>
    </div>
  );
};

export default UpcomingBookingsCalendar;
