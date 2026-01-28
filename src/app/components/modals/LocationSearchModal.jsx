import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Loader, X } from "lucide-react";
import axios from "axios";

const GEOAPIFY_API_KEY = "068dfbe8b45a4a1a9584374a3db736e2";
const ALLOWED_COUNTRIES =
  "us,ca,mx,gb,fr,de,it,es,nl,ch,se,no,dk,ie,pt,at,pl,be,au,nz,br,ar,cl,co,pe";

export function LocationSearchModal({ isOpen, onClose, onSelectLocation }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimer = useRef(null);

  // Fetch suggestions from Geoapify API
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/autocomplete",
        {
          params: {
            text: query,
            apiKey: GEOAPIFY_API_KEY,
            limit: 8,
            filter: `countrycode:${ALLOWED_COUNTRIES}`,
          },
        },
      );
      // Geoapify returns features array in GeoJSON format
      const formattedSuggestions =
        response.data.features?.map((feature) => ({
          name:
            feature.properties.city ||
            feature.properties.name ||
            feature.properties.address_line1,
          address_line1: feature.properties.address_line1,
          address_line2: feature.properties.address_line2,
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
        })) || [];
      setSuggestions(formattedSuggestions);
      setSelectedIndex(-1);
    } catch (error) {
      console.error(
        "Error fetching suggestions:",
        error.response?.data || error.message,
      );
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input with debouncing
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for API call
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 1000); // Wait 1 second after user stops typing
  };

  // Handle selection from dropdown
  const handleSelectLocation = (suggestion) => {
    const locationData = {
      location_name: suggestion.address_line1 || suggestion.name,
      location_lat: suggestion.lat,
      location_long: suggestion.lon,
    };

    // Save to localStorage
    localStorage.setItem("selectedLocation", JSON.stringify(locationData));

    // Call callback if provided
    if (onSelectLocation) {
      onSelectLocation(locationData);
    }

    // Reset and close
    setSearchInput("");
    setSuggestions([]);
    onClose();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectLocation(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-32 px-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              {/* Modal Container */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 overflow-hidden border border-gray-200 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-champagne-gold/20 dark:bg-champagne-gold/10 rounded-full">
                      <MapPin className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif text-midnight-navy dark:text-white">
                        Where are you going?
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Search for your destination
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-midnight-navy dark:text-slate-400" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="p-6 md:p-8 border-b border-gray-200 dark:border-slate-700">
                  <div className="relative">
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-700 px-4 py-3 rounded-2xl border-2 border-transparent hover:border-champagne-gold dark:hover:border-champagne-gold transition-all focus-within:border-champagne-gold">
                      <Search className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Search cities, landmarks, or regions..."
                        className="bg-transparent border-none outline-none w-full text-midnight-navy dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/50 font-medium"
                        autoFocus
                      />
                      {loading && (
                        <Loader className="w-5 h-5 text-champagne-gold animate-spin flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggestions Dropdown */}
                <div className="max-h-96 overflow-y-auto">
                  {searchInput && suggestions.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={`${suggestion.lat}-${suggestion.lon}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelectLocation(suggestion)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left px-6 md:px-8 py-4 md:py-5 transition-all duration-200 flex items-start gap-4 ${
                            selectedIndex === index
                              ? "bg-blue-50 dark:bg-slate-700 border-l-4 border-champagne-gold"
                              : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          <MapPin className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-medium text-midnight-navy dark:text-white truncate">
                              {suggestion.name}
                            </p>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                              {suggestion.address_line1 ||
                                suggestion.address_line2 ||
                                suggestion.name}
                            </p>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-mono flex-shrink-0 whitespace-nowrap">
                            {suggestion.lat.toFixed(2)}°,{" "}
                            {suggestion.lon.toFixed(2)}°
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : searchInput && !loading ? (
                    <div className="p-8 text-center">
                      <MapPin className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        No locations found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Try searching with a different name
                      </p>
                    </div>
                  ) : !searchInput ? (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        Start typing to search
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Search for cities, landmarks, beaches, and more
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Loader className="w-12 h-12 text-champagne-gold animate-spin mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        Searching...
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                {searchInput && suggestions.length > 0 && (
                  <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                      Found {suggestions.length} result
                      {suggestions.length !== 1 ? "s" : ""} • Use arrow keys to
                      navigate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
