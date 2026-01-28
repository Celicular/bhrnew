import { motion } from "motion/react";
import { X, Star } from "lucide-react";

export function ReviewsModal({ isOpen, onClose, reviews, averageRating }) {
  if (!isOpen) return null;

  // Sort reviews by rating (best first)
  const sortedReviews = [...reviews].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[color:var(--amber-50)] dark:from-slate-700 to-[color:var(--yellow-50)] dark:to-slate-700 px-6 md:px-8 py-6 border-b border-[color:var(--gray-200)]/50 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-midnight-navy dark:text-white">
              All Guest Reviews
            </h2>
            <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mt-1">
              {reviews.length} review{reviews.length > 1 ? "s" : ""} from
              verified guests
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Overall Rating Summary */}
        <div className="px-6 md:px-8 py-6 bg-gradient-to-br from-[color:var(--amber-50)]/40 dark:from-slate-700/40 to-[color:var(--yellow-50)]/20 dark:to-slate-700/20 border-b border-[color:var(--amber-200)]/30 dark:border-slate-700/50">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-serif text-midnight-navy dark:text-white mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "fill-champagne-gold text-champagne-gold"
                        : "text-gray-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-dusty-sky-blue dark:text-slate-400 font-medium">
                Average Rating
              </p>
            </div>
            <div className="flex-1">
              <p className="text-dusty-sky-blue dark:text-slate-300 text-sm leading-relaxed">
                Based on {reviews.length} verified guest review
                {reviews.length > 1 ? "s" : ""} from recent stays at this
                property
              </p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="p-6 md:p-8 space-y-6">
          {sortedReviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-gradient-to-br from-white dark:from-slate-700 to-[color:var(--amber-50)]/10 dark:to-slate-700/10 rounded-xl border border-[color:var(--gray-100)]/50 dark:border-slate-700 hover:border-[color:var(--amber-200)]/50 dark:hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.guest_name}`}
                    alt={review.guest_name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-midnight-navy dark:text-white">
                      {review.guest_name}
                    </p>
                    <p className="text-xs text-dusty-sky-blue dark:text-slate-400">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (review.rating || 0)
                          ? "fill-champagne-gold text-champagne-gold"
                          : "text-gray-300 dark:text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-dusty-sky-blue dark:text-slate-300 leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-[color:var(--amber-50)]/50 dark:from-slate-700/50 to-[color:var(--yellow-50)]/50 dark:to-slate-700/50 px-6 md:px-8 py-4 border-t border-[color:var(--gray-200)]/50 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-midnight-navy dark:bg-slate-700 text-white rounded-lg hover:bg-midnight-navy/90 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
