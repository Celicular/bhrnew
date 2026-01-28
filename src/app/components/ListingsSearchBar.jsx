import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, Filter, Search } from "lucide-react";
import { LocationSearchModal } from "@/app/components/modals/LocationSearchModal";
import { CalendarModal } from "@/app/components/PropertyDetail/modals/CalendarModal";
import { GuestsModal } from "@/app/components/modals/GuestsModal";
import { FilterModal } from "@/app/components/modals/FilterModal";

export function ListingsSearchBar({ onSearch, onFiltersChange }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

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
    if (!selectedDates?.start && !selectedDates?.end) return "Add dates";
    if (selectedDates?.start && !selectedDates?.end) {
      return new Date(selectedDates.start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    const startDate = new Date(selectedDates.start).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" },
    );
    const endDate = new Date(selectedDates.end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startDate} - ${endDate}`;
  };

  const formatGuests = () => {
    if (!selectedGuests) return "Add guests";
    const { adults = 0, children = 0, pets = 0 } = selectedGuests;
    const parts = [];
    if (adults > 0)
      parts.push(`${adults} ${adults === 1 ? "guest" : "guests"}`);
    if (pets > 0) parts.push(`${pets} ${pets === 1 ? "pet" : "pets"}`);
    return parts.length > 0 ? parts.join(", ") : "Add guests";
  };

  return (
    <>
      <div className="hidden md:block bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-8 mb-8 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Location */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white dark:bg-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-all duration-300 text-left group shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500"
          >
            <MapPin className="w-5 h-5 text-champagne-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                Location
              </p>
              <p className="font-semibold text-midnight-navy dark:text-white text-sm truncate">
                {selectedLocation?.location_name || "Where to?"}
              </p>
            </div>
          </button>

          {/* Check-in/Check-out */}
          <button
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white dark:bg-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-all duration-300 text-left group shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500"
          >
            <Calendar className="w-5 h-5 text-champagne-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                Dates
              </p>
              <p className="font-semibold text-midnight-navy dark:text-white text-sm truncate">
                {formatDateRange()}
              </p>
            </div>
          </button>

          {/* Guests */}
          <button
            onClick={() => setShowGuestsModal(true)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white dark:bg-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-all duration-300 text-left group shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500"
          >
            <Users className="w-5 h-5 text-champagne-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                Guests
              </p>
              <p className="font-semibold text-midnight-navy dark:text-white text-sm truncate">
                {formatGuests()}
              </p>
            </div>
          </button>

          {/* Filters */}
          <button 
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white dark:bg-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-all duration-300 group shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500"
          >
            <Filter className="w-5 h-5 text-champagne-gold group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-midnight-navy dark:text-white">
              Filters
            </span>
          </button>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="group relative overflow-hidden bg-gradient-to-r from-champagne-gold to-burnished-gold hover:from-burnished-gold hover:to-champagne-gold text-midnight-navy px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-champagne-gold/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 col-span-1 border border-champagne-gold/20"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Search</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
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

      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={(filters) => {
            if (onFiltersChange) {
              onFiltersChange(filters);
            }
            if (onSearch) {
              onSearch();
            }
          }}
        />
      )}
    </>
  );
}
