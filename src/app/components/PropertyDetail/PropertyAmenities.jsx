import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

export function PropertyAmenities({ amenities, onViewAll }) {
  if (!amenities || amenities.length === 0) return null;

  // Helper function to convert API icon format (fas fa-microwave) to icon object (Icons.faMicrowave)
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

    // Check if icon exists, if not try variations, then fallback
    return Icons[iconKey] || Icons[`fa${camelCase}`] || Icons.faCheck;
  };

  // Show first 6 amenities
  const displayAmenities = amenities.slice(0, 6);
  const hasMore = amenities.length > 6;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-gray-200/50 bg-gradient-to-br from-dusty-sky-blue/5 to-transparent rounded-xl px-6 md:px-8"
      id="amenities"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Amenities
      </h2>

      {/* Display first 6 amenities in slim layout */}
      <div className="flex flex-wrap gap-3 mb-6">
        {displayAmenities.map((amenity, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="amenity-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-dusty-sky-blue/10 to-dusty-sky-blue/5 border border-dusty-sky-blue/30 rounded-full hover:border-midnight-navy hover:from-dusty-sky-blue/15 transition-all"
          >
            <FontAwesomeIcon
              icon={getIcon(amenity?.icon)}
              className="text-midnight-navy"
              style={{ fontSize: "0.875rem" }}
            />
            <span className="text-sm font-medium text-midnight-navy">
              {typeof amenity === "string" ? amenity : amenity?.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      {hasMore && (
        <button
          onClick={onViewAll}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-champagne-gold dark:bg-champagne-gold/90 text-midnight-navy dark:text-charcoal-blue rounded-lg hover:bg-opacity-90 dark:hover:bg-champagne-gold/80 transition-all hover:shadow-lg dark:hover:shadow-slate-900/50 font-medium"
        >
          View All {amenities.length} Amenities
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </motion.section>
  );
}
