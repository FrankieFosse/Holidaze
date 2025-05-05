import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const BookingCalendar = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateChange({ dateFrom: start, dateTo: end });
  };

  const today = new Date();
  const maxBookingDate = new Date();
  maxBookingDate.setMonth(today.getMonth() + 6); // 6 months ahead

  return (
    <div className="w-full flex justify-center mb-4">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        minDate={today}
        maxDate={maxBookingDate}
        placeholderText="Select your stay dates"
        className="p-2 border-1 border-blackSecondary rounded w-full max-w-xs cursor-pointer duration-150 hover:border-grayPrimary text-center"
        inline={false} // Popup calendar for mobile
      />
    </div>
  );
};

export default BookingCalendar;
