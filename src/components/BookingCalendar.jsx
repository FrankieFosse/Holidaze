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
import StatusMessage from "./StatusMessage";


const BookingCalendar = ({
    onDateChange,
    excludedBookings = [],
    defaultDateFrom,
    defaultDateTo,
  }) => {  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);


  // Assuming currentUser is available in the context or localStorage
  const currentUser = localStorage.getItem("name"); // Replace with your auth mechanism
  const currentUserEmail = localStorage.getItem("email");


  // Convert bookings to date intervals (excluding current booking)
  const bookedIntervals = excludedBookings.map((b) => ({
    start: new Date(b.dateFrom),
    end: new Date(b.dateTo),
    userEmail: b.customer?.email, // ✅ safer than using name
  }));
  

  const isPrevDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Function to check if a day is booked
  const isBooked = (date) =>
    bookedIntervals.some((interval) => isWithinInterval(date, interval));

  // Function to check if a day is booked by the logged-in user
  const isBookedByCurrentUser = (date) =>
    bookedIntervals.some(
      (interval) =>
        isWithinInterval(date, interval) && interval.userEmail === currentUserEmail
    );
  

  // Function to check if a day is selected within the current range
  const isSelected = (date) =>
    selectedRange.start &&
    ((selectedRange.end &&
      isWithinInterval(date, {
        start: selectedRange.start,
        end: selectedRange.end,
      })) ||
      isSameDay(date, selectedRange.start));

  const handleDateClick = (date) => {
    if (isBefore(date, today) || isBooked(date)) return;

    // Reset if both dates are already selected or none
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: date }); // Treat as single-day booking
    } else if (isSameDay(date, selectedRange.start)) {
      // Clicked same day again -> single day booking
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: date });
    } else if (isAfter(date, selectedRange.start)) {
      // Validate that there are no booked days in range
      const daysInRange = eachDayOfInterval({
        start: selectedRange.start,
        end: date,
      });

      const rangeHasBookedDates = daysInRange.some((d) => isBooked(d));

      if (rangeHasBookedDates) {
        setStatusMessage("This range includes already booked dates. Please select a different range.");
        setStatusType("error");
        setSelectedRange({ start: null, end: null });
      
        setTimeout(() => {
          setStatusMessage("");
          setStatusType(null);
        }, 3000);
      }
       else {
        setSelectedRange({ start: selectedRange.start, end: date });
        onDateChange({ dateFrom: selectedRange.start, dateTo: date });
      }
    } else {
      // Clicked an earlier date than current start — reset
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: date }); // Treat as single-day
    }
  };

  return (
    <div className="p-2 border border-red-300 rounded-md w-full max-w-md mx-auto min-h-60 max-h-60">
      
      {statusMessage && <StatusMessage message={statusMessage} type={statusType} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => !isPrevDisabled && setCurrentMonth(addMonths(currentMonth, -1))}
          disabled={isPrevDisabled}
          className={`text-xs p-1 border rounded ${
            isPrevDisabled ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xs font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-xs p-1 border rounded hover:bg-gray-100"
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
          const booked = isBooked(day); // Define first
          const bookedByCurrentUser = isBookedByCurrentUser(day); // Check if booked by current user
          const isPast = isBefore(day, today);
          const disabled = booked || isPast;
          const selected = isSelected(day);
          const isToday = isSameDay(day, new Date());

          let classes = "w-full aspect-square rounded-md border text-center transition ";
          if (bookedByCurrentUser) {
            classes += "bg-green-200 text-green-700 border-green-300 "; // Green for dates booked by the user
          } else if (booked) {
            classes += "bg-red-200 text-red-700 border-red-300 "; // Red for booked dates
          } else if (selected) {
            classes += "bg-blue-500 text-white border-blue-500 ";
          } else if (isToday) {
            classes += "border-blue-300 ";
          } else {
            classes += "hover:bg-blue-50 border-gray-300 ";
          }

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={classes}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
