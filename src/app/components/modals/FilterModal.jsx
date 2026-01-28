import { useState, useEffect } from "react";
import { X, Sliders, ChevronDown } from "lucide-react";
import { api } from "@/utils/client";

export function FilterModal({ isOpen, onClose, onApply }) {
  const [filters, setFilters] = useState({
    price_min: 0,
    price_max: 10000,
    bedrooms_min: 0,
    bathrooms_min: 0,
    distance: 5000, // miles
    property_types: [],
    amenities: [],
    rating_min: 0,
    filter_availability: false,
    check_in_date: "",
    check_out_date: "",
  });

  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [amenitiesSearch, setAmenitiesSearch] = useState("");

  const propertyTypes = [
    "House",
    "Villa",
    "Apartment",
    "Condo",
    "Cottage",
    "Townhouse",
  ];

  // Fetch amenities from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch("https://bookholidayrental.com/api/amenities/list.php");
        const data = await response.json();
        if (data.success && Array.isArray(data.data.amenities)) {
          setAmenitiesOptions(data.data.amenities);
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };

    if (isOpen) {
      fetchAmenities();
    }
  }, [isOpen]);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("appliedFilters"));
    if (savedFilters) {
      setFilters(savedFilters);
    }
  }, [isOpen]);

  const handlePriceChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: parseInt(value),
    }));
  };

  const handleCapacityChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: parseInt(value),
    }));
  };

  const handlePropertyTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      property_types: prev.property_types.includes(type)
        ? prev.property_types.filter((t) => t !== type)
        : [...prev.property_types, type],
    }));
  };

  const handleAmenityChange = (amenityId) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleApply = () => {
    localStorage.setItem("appliedFilters", JSON.stringify(filters));
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      price_min: 0,
      price_max: 10000,
      guests_min: 0,
      bedrooms_min: 0,
      bathrooms_min: 0,
      distance: 5000,
      property_types: [],
      amenities: [],
      rating_min: 0,
      filter_availability: false,
      check_in_date: "",
      check_out_date: "",
    };
    setFilters(defaultFilters);
    localStorage.setItem("appliedFilters", JSON.stringify(defaultFilters));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white dark:bg-slate-800 w-full md:w-1/2 md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-champagne-gold" />
            <h2 className="text-2xl font-serif text-midnight-navy dark:text-white">
              Filter Properties
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-midnight-navy dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">
                  Min
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={filters.price_min}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      price_min: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-midnight-navy dark:text-white text-sm focus:ring-2 focus:ring-champagne-gold focus:border-transparent"
                />
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">
                  Max
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={filters.price_max}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      price_max: parseInt(e.target.value) || 10000,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-midnight-navy dark:text-white text-sm focus:ring-2 focus:ring-champagne-gold focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Distance
            </h3>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-3">
                Up to {filters.distance} miles
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={filters.distance}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    distance: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-champagne-gold"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span>100 mi</span>
                <span>10,000 mi</span>
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Capacity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">
                  Min Bedrooms
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms_min: num,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                        filters.bedrooms_min === num
                          ? "bg-champagne-gold text-midnight-navy"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-champagne-gold"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">
                  Min Bathrooms
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          bathrooms_min: num,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                        filters.bathrooms_min === num
                          ? "bg-champagne-gold text-midnight-navy"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-champagne-gold"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Property Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      property_types: prev.property_types.includes(type)
                        ? prev.property_types.filter((t) => t !== type)
                        : [...prev.property_types, type],
                    }))
                  }
                  className={`p-3 rounded-lg font-medium text-sm transition-all ${
                    filters.property_types.includes(type)
                      ? "bg-champagne-gold text-midnight-navy"
                      : "bg-slate-100 dark:bg-slate-700 text-midnight-navy dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities - Show 8 max */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {amenitiesOptions.slice(0, 8).map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      amenities: prev.amenities.includes(amenity.id)
                        ? prev.amenities.filter((id) => id !== amenity.id)
                        : [...prev.amenities, amenity.id],
                    }))
                  }
                  className={`p-3 rounded-lg font-medium text-sm transition-all line-clamp-2 ${
                    filters.amenities.includes(amenity.id)
                      ? "bg-champagne-gold text-midnight-navy"
                      : "bg-slate-100 dark:bg-slate-700 text-midnight-navy dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {amenity.name}
                </button>
              ))}
            </div>
            {amenitiesOptions.length > 8 && (
              <button
                onClick={() => setShowAllAmenities(true)}
                className="w-full py-2 text-champagne-gold font-medium text-sm hover:text-burnished-gold transition-colors flex items-center justify-center gap-2"
              >
                <span>View all amenities</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Minimum Rating
            </h3>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      rating_min: rating,
                    }))
                  }
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filters.rating_min === rating
                      ? "bg-champagne-gold text-midnight-navy"
                      : "bg-slate-100 dark:bg-slate-700 text-midnight-navy dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {rating > 0 ? `${rating}+` : "Any"}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Availability
            </h3>
            <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={filters.filter_availability}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    filter_availability: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-champagne-gold rounded"
              />
              <span className="font-medium text-midnight-navy dark:text-white text-sm">
                Filter by specific dates
              </span>
            </label>

            {filters.filter_availability && (
              <div className="space-y-3 mt-3 pl-3 border-l-2 border-champagne-gold">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={filters.check_in_date}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        check_in_date: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-midnight-navy dark:text-white text-sm focus:ring-2 focus:ring-champagne-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={filters.check_out_date}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        check_out_date: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-midnight-navy dark:text-white text-sm focus:ring-2 focus:ring-champagne-gold focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-midnight-navy dark:text-white rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-champagne-gold hover:bg-burnished-gold text-midnight-navy rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Apply Filters
          </button>
        </div>

        {/* All Amenities Modal */}
        {showAllAmenities && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full max-h-[70vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-slate-750 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between z-10">
                <h3 className="font-semibold text-midnight-navy dark:text-white text-lg">All Amenities</h3>
                <button
                  onClick={() => setShowAllAmenities(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-midnight-navy dark:text-white" />
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Search amenities..."
                  value={amenitiesSearch}
                  onChange={(e) => setAmenitiesSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-midnight-navy dark:text-white text-sm focus:ring-2 focus:ring-champagne-gold focus:border-transparent"
                />
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {amenitiesOptions
                    .filter((a) =>
                      a.name.toLowerCase().includes(amenitiesSearch.toLowerCase())
                    )
                    .map((amenity) => (
                      <label
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={() =>
                            setFilters((prev) => ({
                              ...prev,
                              amenities: prev.amenities.includes(amenity.id)
                                ? prev.amenities.filter((id) => id !== amenity.id)
                                : [...prev.amenities, amenity.id],
                            }))
                          }
                          className="w-4 h-4 accent-champagne-gold rounded"
                        />
                        <span className="text-midnight-navy dark:text-white text-sm font-medium">
                          {amenity.name}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}