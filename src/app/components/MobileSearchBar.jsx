import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { LocationSearchModal } from "@/app/components/modals/LocationSearchModal";
import { CalendarModal } from "@/app/components/PropertyDetail/modals/CalendarModal";
import { GuestsModal } from "@/app/components/modals/GuestsModal";

export function MobileSearchBar({ onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("selectedLocation"));
    const dates = JSON.parse(localStorage.getItem("selectedDates"));
    const guests = JSON.parse(localStorage.getItem("selectedGuests"));

    if (location) setSelectedLocation(location);
    if (dates) setSelectedDates(dates);
    if (guests) setSelectedGuests(guests);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
    localStorage.setItem("selectedLocation", JSON.stringify(location));
  };

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
    setShowCalendarModal(false);
    localStorage.setItem("selectedDates", JSON.stringify(dates));
  };

  const handleGuestsSelect = (guests) => {
    setSelectedGuests(guests);
    setShowGuestsModal(false);
    localStorage.setItem("selectedGuests", JSON.stringify(guests));
  };

  const formatDateRange = () => {
    if (!selectedDates?.start && !selectedDates?.end) return "Dates";
    if (selectedDates?.start && !selectedDates?.end) {
      return new Date(selectedDates.start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return "Dates set";
  };

  const formatGuests = () => {
    if (!selectedGuests) return "Guests";
    const { adults = 0, children = 0, pets = 0 } = selectedGuests;
    return `${adults + children}${pets > 0 ? "+" : ""}`;
  };

  return (
    <>
      {/* Mobile Bottom Bar (Hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-40">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-champagne-gold" />
              <span className="text-sm font-medium text-midnight-navy dark:text-white">
                {selectedLocation?.location_name || "Select location"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{formatDateRange()}</span>
              <span>{formatGuests()}</span>
            </div>
          </button>
        ) : (
          <div className="p-4 space-y-4 pb-24">
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4"
            >
              <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Location */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-700"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Location
              </p>
              <p className="font-medium text-midnight-navy dark:text-white">
                {selectedLocation?.location_name || "Where to?"}
              </p>
            </button>

            {/* Dates */}
            <button
              onClick={() => setShowCalendarModal(true)}
              className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-700"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Check-in & Check-out
              </p>
              <p className="font-medium text-midnight-navy dark:text-white">
                {selectedDates?.start && selectedDates?.end
                  ? `${new Date(selectedDates.start).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )} - ${new Date(selectedDates.end).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )}`
                  : "Add dates"}
              </p>
            </button>

            {/* Guests */}
            <button
              onClick={() => setShowGuestsModal(true)}
              className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-700"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Guests & Pets
              </p>
              <p className="font-medium text-midnight-navy dark:text-white">
                {selectedGuests
                  ? `${selectedGuests.adults + selectedGuests.children} guests${
                      selectedGuests.pets > 0
                        ? `, ${selectedGuests.pets} pets`
                        : ""
                    }`
                  : "Add guests"}
              </p>
            </button>

            {/* Search Button */}
            <button
              onClick={() => {
                setIsExpanded(false);
                onSearch();
              }}
              className="w-full bg-champagne-gold hover:bg-burnished-gold text-midnight-navy px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Search
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showLocationModal && (
        <LocationSearchModal
          isOpen={showLocationModal}
          onSelectLocation={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {showCalendarModal && (
        <CalendarModal
          selectedDates={selectedDates}
          onDateSelect={handleDateSelect}
          onClose={() => setShowCalendarModal(false)}
          isOpen={showCalendarModal}
        />
      )}

      {showGuestsModal && (
        <GuestsModal
          isOpen={showGuestsModal}
          onSelectGuests={handleGuestsSelect}
          onClose={() => setShowGuestsModal(false)}
        />
      )}
    </>
  );
}
