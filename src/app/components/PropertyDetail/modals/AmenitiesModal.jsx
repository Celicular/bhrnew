import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

export function AmenitiesModal({
  isOpen,
  onClose,
  amenities,
  customAmenities,
}) {
  const [showAllCustom, setShowAllCustom] = useState(false);

  if (!amenities || amenities.length === 0) return null;

  // Helper to convert icon name strings to Font Awesome icon objects
  const getIcon = (iconName) => {
    if (!iconName || typeof iconName !== "string") return Icons.faCheck;

    // Handle "fas fa-microwave" or "fa-microwave" or "faicon" formats
    let cleanName = iconName
      .replace(/^(fas|far|fal|fad)\s+/, "") // Remove "fas ", "far ", etc. with space
      .replace(/^fa-/, "") // Remove "fa-" prefix
      .trim();

    // If empty after cleaning, return default
    if (!cleanName) return Icons.faCheck;

    // Convert kebab-case to camelCase (microwave -> microwave, person-swimming -> personSwimming)
    const camelCase = cleanName
      .split("-")
      .map((word, idx) =>
        idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join("");

    // Create the Font Awesome icon key (faMicrowave, faPersonSwimming, etc.)
    const iconKey = `fa${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;

    // Check if icon exists, if not try the raw camelCase, then fallback
    return Icons[iconKey] || Icons[`fa${camelCase}`] || Icons.faCheck;
  };

  // Categorize amenities based on name mapping
  const amenityToCategory = {
    "Wi-Fi": "Connectivity",
    "High-Speed Internet": "Connectivity",
    "Work Desk": "Connectivity",
    "Swimming Pool": "Recreation",
    "Hot Tub": "Recreation",
    Gym: "Recreation",
    "Yoga Mat": "Recreation",
    "Air Conditioning": "Climate Control",
    Heating: "Climate Control",
    Fireplace: "Climate Control",
    Kitchen: "Kitchen & Dining",
    Refrigerator: "Kitchen & Dining",
    Microwave: "Kitchen & Dining",
    Dishwasher: "Kitchen & Dining",
    Oven: "Kitchen & Dining",
    Stove: "Kitchen & Dining",
    Toaster: "Kitchen & Dining",
    "Coffee Maker": "Kitchen & Dining",
    TV: "Entertainment",
    "Streaming Services": "Entertainment",
    Books: "Entertainment",
    "Board Games": "Entertainment",
    Washer: "Utilities",
    Dryer: "Utilities",
    Parking: "Access & Parking",
    Elevator: "Access & Parking",
    "First Aid Kit": "Safety",
    "Fire Extinguisher": "Safety",
    "Smoke Detector": "Safety",
  };

  const categoryIcons = {
    Connectivity: "fas fa-wifi",
    Recreation: "fas fa-person-swimming",
    "Climate Control": "fas fa-temperature-high",
    "Kitchen & Dining": "fas fa-kitchen-set",
    Entertainment: "fas fa-tv",
    Utilities: "fas fa-washing-machine",
    "Access & Parking": "fas fa-car",
    Safety: "fas fa-shield",
  };

  // Group amenities by category
  const grouped = {};
  amenities.forEach((amenity) => {
    const amenityName = typeof amenity === "string" ? amenity : amenity.name;
    const category = amenityToCategory[amenityName] || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(amenity);
  });

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-serif text-midnight-navy dark:text-white">
                All Amenities ({amenities.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-midnight-navy dark:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 dark:bg-slate-800">
              {/* Custom Amenities Section */}
              {customAmenities && customAmenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pb-6 border-b border-gray-200 dark:border-slate-700"
                >
                  <h3 className="text-sm font-semibold text-midnight-navy dark:text-white uppercase tracking-wide mb-4">
                    Custom Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(showAllCustom
                      ? customAmenities
                      : customAmenities.slice(0, 8)
                    ).map((amenity, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-dusty-sky-blue/10 to-dusty-sky-blue/5 dark:from-slate-700/20 dark:to-slate-700/10 border border-dusty-sky-blue/30 dark:border-slate-600/30 rounded-full text-sm text-midnight-navy dark:text-slate-200 font-medium"
                      >
                        <span className="text-champagne-gold">✓</span>
                        {amenity}
                      </motion.span>
                    ))}
                  </div>
                  {customAmenities.length > 8 && (
                    <button
                      onClick={() => setShowAllCustom(!showAllCustom)}
                      className="mt-3 text-sm font-medium text-champagne-gold hover:text-[color:var(--hover-dark)] flex items-center gap-2 transition-colors"
                    >
                      {showAllCustom
                        ? "Show Less"
                        : `Show More (+${customAmenities.length - 8})`}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${showAllCustom ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </motion.div>
              )}

              {sortedCategories.map((category, groupIdx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="pb-6 border-b border-gray-200 dark:border-slate-700 last:pb-0 last:border-b-0"
                >
                  {/* Category Title with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <FontAwesomeIcon
                      icon={getIcon(categoryIcons[category])}
                      style={{
                        color: "var(--champagne-gold)",
                        fontSize: "1.25rem",
                      }}
                    />
                    <h3 className="text-sm font-semibold text-midnight-navy dark:text-white uppercase tracking-wide">
                      {category}
                    </h3>
                  </div>

                  {/* Amenity Badges Grid */}
                  <div className="flex flex-wrap gap-3">
                    {grouped[category].map((amenity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: groupIdx * 0.1 + idx * 0.02 }}
                        className="amenity-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-dusty-sky-blue/10 to-dusty-sky-blue/5 dark:from-slate-700/20 dark:to-slate-700/10 border border-dusty-sky-blue/30 dark:border-slate-600/30 rounded-full hover:border-midnight-navy dark:hover:border-slate-500 hover:from-dusty-sky-blue/15 hover:to-dusty-sky-blue/10 dark:hover:from-slate-700/30 dark:hover:to-slate-700/20 transition-all"
                      >
                        <FontAwesomeIcon
                          icon={getIcon(
                            typeof amenity === "string" ? null : amenity?.icon,
                          )}
                          className="text-midnight-navy dark:text-champagne-gold"
                          style={{ fontSize: "0.875rem" }}
                        />
                        <span className="text-sm font-medium text-midnight-navy dark:text-slate-200 whitespace-nowrap">
                          {typeof amenity === "string"
                            ? amenity
                            : amenity?.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
