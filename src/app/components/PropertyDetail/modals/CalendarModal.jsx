import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/app/components/ui/Modal";

export function CalendarModal({
  isOpen,
  onClose,
  selectedDates,
  onDateSelect,
  bookedDates = [],
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
  );

  const isDateBooked = (date) => {
    return bookedDates?.some(
      (booked) => new Date(booked).toDateString() === date.toDateString(),
    );
  };

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInRange = (date) => {
    if (!selectedDates?.start || !selectedDates?.end) return false;
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const renderCalendar = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, monthIndex, i));
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (!date || isDateBooked(date) || isDateInPast(date)) return;
    onDateSelect(date);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderMonthCalendar = (month, title) => {
    const days = renderCalendar(month);

    return (
      <div>
        <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-4 text-center">
          {title} {month.getFullYear()}
        </h3>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-dusty-sky-blue dark:text-slate-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} />;
            }

            const booked = isDateBooked(date);
            const inRange = isDateInRange(date);
            const isStart =
              selectedDates?.start &&
              date.toDateString() === selectedDates.start?.toDateString();
            const isEnd =
              selectedDates?.end &&
              date.toDateString() === selectedDates.end?.toDateString();

            return (
              <motion.button
                key={date.toDateString()}
                onClick={() => handleDateClick(date)}
                disabled={booked || isDateInPast(date)}
                className={`
                  w-full py-2 text-sm rounded-lg font-medium transition-all
                  ${
                    booked || isDateInPast(date)
                      ? "bg-[color:var(--destructive-light-100)] dark:bg-slate-700 text-[color:var(--destructive-light-600)] dark:text-slate-500 cursor-not-allowed"
                      : isStart || isEnd
                        ? "bg-champagne-gold dark:bg-champagne-gold text-white dark:text-charcoal-blue"
                        : inRange
                          ? "bg-champagne-gold/30 dark:bg-champagne-gold/20 text-midnight-navy dark:text-slate-300"
                          : "bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-champagne-gold dark:hover:border-champagne-gold/50"
                  }
                `}
              >
                {date.getDate()}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Select Dates">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6 px-4">
        <button
          onClick={() => {
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            );
            setNextMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth()),
            );
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-champagne-gold" />
        </button>
        <h3 className="font-serif text-lg text-midnight-navy dark:text-white flex-1 text-center">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()} -{" "}
          {monthNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
        </h3>
        <button
          onClick={() => {
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
            );
            setNextMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2),
            );
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-champagne-gold" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderMonthCalendar(currentMonth, monthNames[currentMonth.getMonth()])}
        {renderMonthCalendar(nextMonth, monthNames[nextMonth.getMonth()])}
      </div>

      {/* Date Range Display */}
      {selectedDates?.start && selectedDates?.end && (
        <div className="mt-6 p-4 bg-warm-ivory dark:bg-slate-700 rounded-lg text-center">
          <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mb-2">
            Your stay
          </p>
          <p className="text-lg font-serif text-midnight-navy dark:text-white">
            {selectedDates.start.toLocaleDateString()} to{" "}
            {selectedDates.end.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
            {Math.ceil(
              (selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24),
            )}{" "}
            nights
          </p>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full mt-6 py-3 bg-midnight-navy dark:bg-slate-700 text-white hover:bg-charcoal-blue dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
      >
        Done
      </button>
    </Modal>
  );
}
