import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyDates({
  bookedDates,
  selectedDates,
  onOpenCalendar,
  maxGuests,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
  );

  const formatDate = (date) => {
    if (!date) return "Select date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePrevMonth = () => {
    const newCurrentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
    );
    setCurrentMonth(newCurrentMonth);
    setNextMonth(
      new Date(newCurrentMonth.getFullYear(), newCurrentMonth.getMonth() + 1),
    );
  };

  const handleNextMonth = () => {
    const newCurrentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
    );
    setCurrentMonth(newCurrentMonth);
    setNextMonth(
      new Date(newCurrentMonth.getFullYear(), newCurrentMonth.getMonth() + 1),
    );
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

  const isDateBooked = (date) => {
    if (!date) return false;
    return bookedDates?.some(
      (booked) => new Date(booked).toDateString() === date.toDateString(),
    );
  };

  const isDateInRange = (date) => {
    if (!selectedDates.start || !selectedDates.end) return false;
    return date >= selectedDates.start && date <= selectedDates.end;
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
        <h3 className="text-lg font-serif text-midnight-navy mb-4 text-center">
          {title} {month.getFullYear()}
        </h3>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-[color:var(--gray-600)]"
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
              date.toDateString() === selectedDates.start?.toDateString();
            const isEnd =
              date.toDateString() === selectedDates.end?.toDateString();

            return (
              <motion.button
                key={date.toDateString()}
                onClick={() => onOpenCalendar(date)}
                disabled={booked}
                className={`
                  w-full py-2 text-sm rounded-lg font-medium transition-all
                  ${
                    booked
                      ? "bg-[color:var(--destructive-light-100)] text-white dark:text-white !text-white dark:!text-white cursor-not-allowed"
                      : isStart || isEnd
                        ? "bg-champagne-gold dark:bg-champagne-gold/80 text-white dark:text-white !text-white dark:!text-white shadow-md dark:shadow-none"
                        : inRange
                          ? "bg-champagne-gold/15 dark:bg-champagne-gold/50 text-white dark:text-white !text-white dark:!text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-[color:var(--gray-700)] dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-champagne-gold dark:hover:border-champagne-gold/50 shadow-sm dark:shadow-slate-900/30"
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--dusty-sky-blue)]/5 to-transparent rounded-xl px-6 md:px-8"
      id="dates"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy dark:text-white mb-8">
        Select Your Dates
      </h2>

      {/* Calendar Display */}
      <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-champagne-gold" />
          </button>
          <h3 className="font-serif text-lg text-midnight-navy flex-1 text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()} -{" "}
            {monthNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-champagne-gold" />
          </button>
        </div>

        {/* Two Calendars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderMonthCalendar(
            currentMonth,
            monthNames[currentMonth.getMonth()],
          )}
          {renderMonthCalendar(nextMonth, monthNames[nextMonth.getMonth()])}
        </div>
      </div>

      {/* Selected Dates Display */}
      {selectedDates.start && selectedDates.end && (
        <div className="p-6 bg-gradient-to-br from-champagne-gold/10 dark:from-slate-800/30 to-champagne-gold/5 dark:to-slate-700/30 rounded-xl border border-champagne-gold/20 dark:border-slate-700/50 mb-6">
          <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mb-2">
            Your stay
          </p>
          <p className="text-lg font-serif text-midnight-navy dark:text-white">
            {selectedDates.start.toLocaleDateString()} to{" "}
            {selectedDates.end.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            {Math.ceil(
              (selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24),
            )}{" "}
            nights
          </p>
        </div>
      )}

      {/* Availability Legend */}
      <div className="p-6 bg-gradient-to-r from-champagne-gold/10 dark:from-slate-800/30 to-champagne-gold/5 dark:to-slate-700/30 rounded-xl flex items-center gap-6 border border-champagne-gold/20 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-champagne-gold rounded shadow-md"></div>
          <span className="text-sm text-gray-700 dark:text-slate-300">
            Selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-champagne-gold/30 rounded shadow-md"></div>
          <span className="text-sm text-gray-700 dark:text-slate-300">
            In Range
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[color:var(--destructive-light-600)] rounded shadow-md"></div>
          <span className="text-sm text-gray-700 dark:text-slate-300">
            Booked
          </span>
        </div>
      </div>
    </motion.section>
  );
}
