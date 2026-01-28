import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function PropertyLandmarks({ landmarks }) {
  const [showAll, setShowAll] = useState(false);

  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  const displayCount = 6;
  const hasMore = landmarks.length > displayCount;
  const landmarksToShow = showAll
    ? landmarks
    : landmarks.slice(0, displayCount);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-gray-200/50 dark:border-slate-700/50"
      id="landmarks"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Nearby Landmarks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {landmarksToShow.map((landmark, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 bg-gradient-to-br from-white dark:from-slate-800 to-warm-ivory/20 dark:to-slate-700/30 rounded-xl border border-gray-100/60 dark:border-slate-700/60 hover:border-champagne-gold/30 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-midnight-navy dark:text-white mb-1">
                  {landmark.name}
                </h3>
                {landmark.distance && (
                  <p className="text-sm text-dusty-sky-blue dark:text-slate-400">
                    {landmark.distance}
                  </p>
                )}
                {landmark.description && (
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                    {landmark.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 flex items-center gap-2 px-4 py-2 text-champagne-gold hover:text-[color:var(--hover-dark)] font-medium transition-colors"
        >
          {showAll
            ? "Show Less"
            : `Show More (+${landmarks.length - displayCount})`}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </motion.section>
  );
}
