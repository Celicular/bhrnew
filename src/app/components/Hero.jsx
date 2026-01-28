import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LocationSearchModal } from "./modals/LocationSearchModal";
import { GuestsModal } from "./modals/GuestsModal";
import { CalendarModal } from "./PropertyDetail/modals/CalendarModal";

export function Hero() {
  const navigate = useNavigate();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
  });
  const [selectedGuests, setSelectedGuests] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });

  // Load selected data from localStorage on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation");
    if (storedLocation) {
      try {
        setSelectedLocation(JSON.parse(storedLocation));
      } catch (error) {
        console.error("Error parsing stored location:", error);
      }
    }

    const storedDates = localStorage.getItem("selectedDates");
    if (storedDates) {
      try {
        const dates = JSON.parse(storedDates);
        setSelectedDates({
          start: dates.start ? new Date(dates.start) : null,
          end: dates.end ? new Date(dates.end) : null,
        });
      } catch (error) {
        console.error("Error parsing stored dates:", error);
      }
    }

    const storedGuests = localStorage.getItem("selectedGuests");
    if (storedGuests) {
      try {
        setSelectedGuests(JSON.parse(storedGuests));
      } catch (error) {
        console.error("Error parsing stored guests:", error);
      }
    }
  }, []);

  const handleSelectLocation = (locationData) => {
    setSelectedLocation(locationData);
  };

  const handleSelectGuests = (guestData) => {
    setSelectedGuests(guestData);
  };

  const handleDateSelect = (date) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start a new selection or restart
      setSelectedDates({ start: date, end: null });
    } else if (date < selectedDates.start) {
      // If clicked date is before start, make it the start
      setSelectedDates({ start: date, end: selectedDates.start });
    } else {
      // Set as end date
      const newDates = { start: selectedDates.start, end: date };
      setSelectedDates(newDates);

      // Save to localStorage (only date portion YYYY-MM-DD)
      localStorage.setItem(
        "selectedDates",
        JSON.stringify({
          start: newDates.start.toISOString().split("T")[0],
          end: newDates.end.toISOString().split("T")[0],
        }),
      );
    }
  };

  const formatDateRange = () => {
    if (!selectedDates.start && !selectedDates.end) {
      return "Add dates";
    }
    if (selectedDates.start && !selectedDates.end) {
      return selectedDates.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    if (selectedDates.start && selectedDates.end) {
      const start = selectedDates.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = selectedDates.end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "Add dates";
  };

  const formatGuestCount = () => {
    const total = selectedGuests.adults + selectedGuests.children;
    if (total === 0) return "Add guests";
    const guestText = total === 1 ? "guest" : "guests";
    const petText =
      selectedGuests.pets > 0
        ? `, ${selectedGuests.pets} pet${selectedGuests.pets !== 1 ? "s" : ""}`
        : "";
    return `${total} ${guestText}${petText}`;
  };
  return (
    <section
      className="relative h-screen w-full overflow-hidden pt-20 bg-cover bg-center"
      style={{
        backgroundImage: "url(/assets/bgmobile.avif)",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="hidden md:block absolute inset-0 h-full w-full object-cover"
      >
        <source src="/assets/hero-video.webm" type="video/webm" />
      </video>
      {/* Soft Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,31,46,0.5)] via-[rgba(26,31,46,0.3)] to-[rgba(26,31,46,0.7)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="mb-6 text-4xl md:text-7xl lg:text-8xl text-bone-white dark:text-white tracking-wide font-serif font-light">
            Your Perfect
            <br />
            <span className="text-champagne-gold dark:text-ffd700">
              Vacation Home
            </span>
            <br />
            Awaits
          </h1>
          <p className="mb-12 text-sm md:text-xl text-warm-ivory/90 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Discover exceptional vacation rentals across the United States.
            <br />
            From beachfront escapes to mountain retreats.
          </p>
        </motion.div>

        {/* Glassmorphism Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] p-4 md:p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs md:text-base">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs text-warm-ivory/70 uppercase tracking-wider font-medium">
                  Destination
                </label>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-3 text-white bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl w-full text-left"
                >
                  <MapPin className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                  <span className="font-medium text-white">
                    {selectedLocation
                      ? selectedLocation.location_name.split(",")[0]
                      : "Where to?"}
                  </span>
                </button>
              </div>

              {/* Check-in */}
              <div className="space-y-2">
                <label className="text-xs text-warm-ivory/70 uppercase tracking-wider font-medium">
                  Check In
                </label>
                <button
                  onClick={() => setIsCalendarModalOpen(true)}
                  className="flex items-center gap-3 text-white bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl w-full text-left"
                >
                  <Calendar className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                  <span className="font-medium text-white">
                    {formatDateRange()}
                  </span>
                </button>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-xs text-warm-ivory/70 uppercase tracking-wider font-medium">
                  Guests
                </label>
                <button
                  onClick={() => setIsGuestsModalOpen(true)}
                  className="flex items-center gap-3 text-white bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl w-full text-left"
                >
                  <Users className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                  <span className="font-medium text-white">
                    {formatGuestCount()}
                  </span>
                </button>
              </div>

              {/* Search Button */}
              <button
                onClick={() => navigate("/listings")}
                className="group relative overflow-hidden bg-champagne-gold hover:bg-burnished-gold text-midnight-navy px-6 md:px-8 py-2 md:py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-champagne-gold/30 font-medium text-sm md:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Location Search Modal */}
        <LocationSearchModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onSelectLocation={handleSelectLocation}
        />

        {/* Calendar Modal */}
        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          selectedDates={selectedDates}
          onDateSelect={handleDateSelect}
          bookedDates={[]} // No booked dates for hero search
        />

        {/* Guests Modal */}
        <GuestsModal
          isOpen={isGuestsModalOpen}
          onClose={() => setIsGuestsModalOpen(false)}
          onSelectGuests={handleSelectGuests}
        />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-warm-ivory/60 uppercase tracking-wider">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-warm-ivory/30 rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
