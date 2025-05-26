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
import { useNavigate } from "react-router";
import Tooltip from "./Tooltip";

const BookingCalendar = ({
  onDateChange,
  excludedBookings = [],
  defaultDateFrom,
  defaultDateTo,
  userBookings = [],
  currentVenueId,
}) => {
  const today = new Date();
  const twoYearsLater = addMonths(today, 24);

  const currentUserEmail = localStorage.getItem("email");

  // Bookings for current venue
  const bookedIntervals = excludedBookings.map((b) => ({
    start: new Date(b.dateFrom),
    end: new Date(b.dateTo),
    userEmail: b.customer?.email,
    id: b.id,
  }));

  // Bookings by user on other venues
  const userOtherVenueBookings = userBookings
    .filter((b) => b.venue.id !== currentVenueId)
    .map((b) => ({
      start: new Date(b.dateFrom),
      end: new Date(b.dateTo),
      id: b.id,
    }));

  const isBookedByUserOtherVenue = (date) =>
    userOtherVenueBookings.some((interval) => isWithinInterval(date, interval));

  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null);

  const navigate = useNavigate();

  // Disable navigation beyond allowed months
  const isPrevDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();
  const isNextDisabled = isAfter(currentMonth, twoYearsLater);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const isBooked = (date) =>
    bookedIntervals.some((interval) => isWithinInterval(date, interval));

  const isBookedByCurrentUser = (date) =>
    bookedIntervals.some(
      (interval) =>
        isWithinInterval(date, interval) && interval.userEmail === currentUserEmail
    );

  const isSelected = (date) =>
    selectedRange.start &&
    ((selectedRange.end &&
      isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end })) ||
      isSameDay(date, selectedRange.start));

  const isHighlighted = (date) => {
    if (!defaultDateFrom || !defaultDateTo) return false;
    const start = new Date(defaultDateFrom);
    const end = new Date(defaultDateTo);
    return (
      isSameDay(date, start) ||
      isSameDay(date, end) ||
      isWithinInterval(date, { start, end })
    );
  };

  const handleDateClick = (date) => {
    if (isBefore(date, today) || isAfter(date, twoYearsLater) || isBooked(date)) return;

    const bookedByUser = bookedIntervals.find(
      (interval) => isWithinInterval(date, interval) && interval.userEmail === currentUserEmail
    );

    if (bookedByUser) {
      navigate(`/booking/${bookedByUser.id}`);
      return;
    }

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: null });
    } else if (isSameDay(date, selectedRange.start)) {
      setStatusMessage("Please select a range of at least two days.");
      setStatusType("error");
      setTimeout(() => {
        setStatusMessage("");
        setStatusType(null);
      }, 2500);
    } else if (isAfter(date, selectedRange.start)) {
      const daysInRange = eachDayOfInterval({ start: selectedRange.start, end: date });
      if (daysInRange.some(isBooked)) {
        setStatusMessage("This range includes already booked dates. Please select a different range.");
        setStatusType("error");
        setSelectedRange({ start: null, end: null });
        setTimeout(() => {
          setStatusMessage("");
          setStatusType(null);
        }, 2500);
      } else if (daysInRange.length < 2) {
        setStatusMessage("Please select at least 2 days.");
        setStatusType("error");
        setTimeout(() => {
          setStatusMessage("");
          setStatusType(null);
        }, 2500);
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
        onDateChange({ dateFrom: selectedRange.start, dateTo: date });
      }
    } else {
      setSelectedRange({ start: date, end: null });
      onDateChange({ dateFrom: date, dateTo: null });
    }
  };

  return (
    <div className="p-2 w-full max-w-xs mx-auto min-h-60 max-h-auto bg-blackSecondary/25">
      {statusMessage && <StatusMessage message={statusMessage} type={statusType} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => !isPrevDisabled && setCurrentMonth(addMonths(currentMonth, -1))}
          disabled={isPrevDisabled}
          className={`text-xs p-1 border-1 border-blackSecondary duration-150 rounded ${
            isPrevDisabled
              ? "text-blackSecondary border-blackSecondary"
              : "cursor-pointer hover:bg-blackSecondary hover:border-grayPrimary"
          }`}
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xs font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          onClick={() => !isNextDisabled && setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={isNextDisabled}
          className={`text-xs p-1 border-1 border-blackSecondary duration-150 rounded ${
            isNextDisabled
              ? "text-blackSecondary border-blackSecondary"
              : "cursor-pointer hover:bg-blackSecondary hover:border-grayPrimary"
          }`}
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
        {Array(startOfMonth(currentMonth).getDay())
          .fill(null)
          .map((_, i) => (
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
          const disabled =
            isOwnBookingDay || bookedByOtherVenue || booked || isPast || isAfterTwoYears;
          const selected = isSelected(day);
          const isToday = isSameDay(day, today);
          const highlighted = isHighlighted(day);

          let classes =
            "w-full aspect-square rounded-md border text-center transition duration-150 flex justify-center items-center ";

          if (bookedByOtherVenue) {
            classes += "bg-buttonPrimary/50 text-blackPrimary";
          } else if (isPast || isAfterTwoYears) {
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
            classes +=
              "text-whiteSecondary hover:text-whitePrimary hover:bg-blackSecondary hover:border-grayPrimary border-blackSecondary cursor-pointer";
          }

          const tooltipText = bookedByOtherVenue
            ? "Booked by you on another venue"
            : bookedByCurrentUser
            ? "Booked by you"
            : booked
            ? "Booked by another user"
            : "";

          return (
            <Tooltip key={day.toISOString()} text={tooltipText}>
              <button
                onClick={() =>
                  !isOwnBookingDay && !bookedByOtherVenue && handleDateClick(day)
                }
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
