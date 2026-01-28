import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function PropertyCustomAmenities({ customAmenities, minimumStay }) {
  const [showAll, setShowAll] = useState(false);

  if (!customAmenities || customAmenities.length === 0) {
    return null;
  }

  const displayCount = 8;
  const hasMore = customAmenities.length > displayCount;
  const itemsToShow = showAll
    ? customAmenities
    : customAmenities.slice(0, displayCount);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-gray-200/50 dark:border-slate-700/50"
    >
      <h3 className="text-xl md:text-2xl font-serif text-midnight-navy mb-6">
        Custom Amenities
      </h3>

      <div className="flex flex-wrap gap-2">
        {itemsToShow.map((amenity, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-dusty-sky-blue/10 to-dusty-sky-blue/5 dark:from-slate-700/20 dark:to-slate-700/10 border border-dusty-sky-blue/30 dark:border-slate-600/30 rounded-full hover:border-champagne-gold/50 dark:hover:border-champagne-gold/40 transition-all text-sm text-midnight-navy dark:text-slate-200 font-medium"
          >
            <span className="text-champagne-gold">✓</span>
            {amenity}
          </motion.span>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 text-sm font-medium text-champagne-gold hover:text-[color:var(--hover-dark)] flex items-center gap-2 transition-colors"
        >
          {showAll
            ? "Show Less"
            : `Show More (+${customAmenities.length - displayCount})`}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {minimumStay && minimumStay > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <p className="text-sm text-dusty-sky-blue flex items-center gap-2">
            <span className="text-champagne-gold">🌙</span>
            <span>
              <strong>Minimum stay:</strong> {minimumStay} nights
            </span>
          </p>
        </div>
      )}
    </motion.section>
  );
}
