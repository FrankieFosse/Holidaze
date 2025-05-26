import { useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isAfter, isBefore, isSameDay, isWithinInterval, startOfMonth } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StatusMessage from "./StatusMessage";
import { useNavigate, Link } from "react-router"; // Importing useNavigate
import Tooltip from "./Tooltip"

const BookingCalendar = ({
  onDateChange,
  excludedBookings = [],
  defaultDateFrom,
  defaultDateTo,
  userBookings = [],
  currentVenueId,
}) => {

  const today = new Date();
  const twoYearsLater = addMonths(today, 24); // Calculate the date two years from today

  const isBookedByUserOtherVenue = (date) =>
    userOtherVenueBookings.some(interval => isWithinInterval(date, interval));
  

  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);

  const currentUserEmail = localStorage.getItem("email");

  // Bookings for current venue (excludedBookings) as before
const bookedIntervals = excludedBookings.map((b) => ({
  start: new Date(b.dateFrom),
  end: new Date(b.dateTo),
  userEmail: b.customer?.email,
  id: b.id,
}));

// Bookings by user on other venues
const userOtherVenueBookings = userBookings
  .filter(b => b.venue.id !== currentVenueId)  // exclude current venue
  .map(b => ({
    start: new Date(b.dateFrom),
    end: new Date(b.dateTo),
    id: b.id,
  }));


  // Disable navigation to months beyond two years from today
  const isPrevDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const isNextDisabled = currentMonth > twoYearsLater; // Disable next button if the month is past two years from today

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

  // Function to check if date matches dateFrom, dateTo, or is between the two for highlighting
  const isHighlighted = (date) => {
    const isStartDate = defaultDateFrom && isSameDay(date, new Date(defaultDateFrom));
    const isEndDate = defaultDateTo && isSameDay(date, new Date(defaultDateTo));
    const isBetweenDates =
      defaultDateFrom &&
      defaultDateTo &&
      isWithinInterval(date, { start: new Date(defaultDateFrom), end: new Date(defaultDateTo) });

    return isStartDate || isEndDate || isBetweenDates;
  };

  // Handle date click
  const handleDateClick = (date) => {
    // Ensure the date is within the allowed range (today to 2 years from today)
    if (isBefore(date, today) || isAfter(date, twoYearsLater) || isBooked(date)) return;

    // If the user clicked on a date that they have booked, navigate to that booking
    const bookedByUser = bookedIntervals.find(
      (interval) => isWithinInterval(date, interval) && interval.userEmail === currentUserEmail
    );
    
    if (bookedByUser) {
      // Navigate to the booking details page
      if (closeModal) closeModal();
      navigate(`/booking/${bookedByUser.id}`);
      location.reload();
      return; // Prevent further actions
    }

    // If no start date is selected or both start & end are already selected — reset and start new
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: null }); // Only update dateFrom
    } else if (isSameDay(date, selectedRange.start)) {
      // Prevent selecting a single day (same day clicked again)
      setStatusMessage("Please select a range of at least two days.");
      setStatusType("error");
      setTimeout(() => {
        setStatusMessage("");
        setStatusType(null);
      }, 2500);
    } else if (isAfter(date, selectedRange.start)) {
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
        }, 2500);
      } else if (daysInRange.length < 2) {
        // Technically not needed anymore, but safe fallback
        setStatusMessage("Please select at least 2 days.");
        setStatusType("error");
        setTimeout(() => {
          setStatusMessage("");
          setStatusType(null);
        }, 2500);
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
        onDateChange({ dateFrom: selectedRange.start, dateTo: date }); // Both dates selected, send both
      }
    } else {
      // Clicked an earlier date — reset selection
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: null }); // Only update dateFrom
    }
  };

  // Hook for navigation
  const navigate = useNavigate();

  return (
    <div className="p-2 w-full max-w-xs mx-auto min-h-60 max-h-auto bg-blackSecondary/25">
      {statusMessage && <StatusMessage message={statusMessage} type={statusType} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => !isPrevDisabled && setCurrentMonth(addMonths(currentMonth, -1))}
          disabled={isPrevDisabled}
          className={`text-xs p-1 border-1 border-blackSecondary duration-150 rounded ${isPrevDisabled ? "text-blackSecondary border-blackSecondary" : "cursor-pointer hover:bg-blackSecondary hover:border-grayPrimary"}`}
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xs font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          onClick={() => !isNextDisabled && setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={isNextDisabled}
          className={`text-xs p-1 border-1 border-blackSecondary duration-150 rounded ${isNextDisabled ? "text-blackSecondary border-blackSecondary" : "cursor-pointer hover:bg-blackSecondary hover:border-grayPrimary"}`}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium mb-1 sm:mx-8 lg:mx-0">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-sm sm:mx-10 lg:mx-0">
        {Array(startOfMonth(currentMonth).getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
{days.map((day) => {
  const booked = isBooked(day);
  const bookedByCurrentUser = isBookedByCurrentUser(day);
  const bookingForDay = bookedByCurrentUser
    ? bookedIntervals.find(
        (interval) =>
          isWithinInterval(day, interval) &&
          interval.userEmail === currentUserEmail
      )
    : null;

  const bookedByOtherVenue = isBookedByUserOtherVenue(day);

  const isPast = isBefore(day, today);
  const isAfterTwoYears = isAfter(day, twoYearsLater);
  const isOwnBookingDay = bookedByCurrentUser && bookingForDay;
  const disabled = isOwnBookingDay || bookedByOtherVenue || booked || isPast || isAfterTwoYears || isSameDay(day, twoYearsLater);
  const selected = isSelected(day);
  const isToday = isSameDay(day, new Date());
  const highlighted = isHighlighted(day);



  let classes = "w-full aspect-square rounded-md border text-center transition duration-150 flex justify-center items-center ";
  
  // Apply yellow background for other venue bookings
  if (bookedByOtherVenue) {
    classes += "bg-buttonPrimary/50 text-blackPrimary"; // yellow background, readable text
  } else if (isPast || isAfterTwoYears || isSameDay(day, twoYearsLater)) {
    classes += "text-blackSecondary";
  } else if (bookedByCurrentUser) {
    classes += "bg-buttonSecondary text-blackPrimary";
  } else if (booked) {
    classes += "bg-redPrimary border-redSecondary text-blackPrimary";
  } else if (selected || highlighted) {
    classes += "bg-buttonPrimary border-whitePrimary";
  } else if (isToday) {
    classes += "border-buttonPrimary";
  } else {
    classes += "text-whiteSecondary hover:text-whitePrimary hover:bg-blackSecondary hover:border-grayPrimary border-blackSecondary cursor-pointer";
  }

  const tooltipText =
  bookedByOtherVenue
    ? "Booked by you on another venue"
    : bookedByCurrentUser
    ? "Booked by you"
    : booked
    ? "Booked by another user"
    : "";

  

    return (
      <Tooltip key={day.toISOString()} text={tooltipText}>
        <button
          onClick={() => !isOwnBookingDay && !bookedByOtherVenue && handleDateClick(day)}
          disabled={disabled || isOwnBookingDay}      
          className={classes + (isOwnBookingDay ? " cursor-default" : "")}
        >
          {format(day, "d")}
        </button>
      </Tooltip>
    );
    
})}

      </div>
    </div>
  );
};

export default BookingCalendar;
