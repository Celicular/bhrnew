import { motion } from "motion/react";
import { Star, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ReviewsModal } from "@/app/components/PropertyDetail/modals/ReviewsModal";

export function PropertyReviews({ reviews, totalRating }) {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  if (!reviews || reviews.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--amber-50)]/20 to-transparent rounded-xl px-6 md:px-8"
        id="reviews"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
          Guest Reviews
        </h2>
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-dusty-sky-blue text-lg">
            No reviews yet. Be the first to review this property!
          </p>
        </div>
      </motion.section>
    );
  }

  // Calculate overall rating from reviews
  const averageRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  const roundedRating = Math.round(averageRating);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--amber-50)]/20 to-transparent rounded-xl px-6 md:px-8"
      id="reviews"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Guest Reviews
      </h2>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[color:var(--amber-50)]/60 to-[color:var(--amber-50)]/20 p-6 md:p-8 rounded-2xl mb-8 border border-[color:var(--amber-200)]/50"
      >
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-serif text-midnight-navy mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < roundedRating
                      ? "fill-champagne-gold text-champagne-gold"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-dusty-sky-blue">
              {reviews.length} Review{reviews.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-dusty-sky-blue leading-relaxed">
              Based on {reviews.length} verified guest review
              {reviews.length > 1 ? "s" : ""} from recent stays
            </p>
          </div>
        </div>
      </motion.div>

      {/* Individual Reviews - Show first 4 */}
      <div className="space-y-6 mb-8">
        {reviews.slice(0, 4).map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 bg-gradient-to-br from-white to-[color:var(--amber-50)]/10 rounded-xl border border-[color:var(--gray-100)]/50 hover:border-[color:var(--amber-200)]/50 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.guest_name}`}
                  alt={review.guest_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-midnight-navy">
                    {review.guest_name}
                  </p>
                  <p className="text-xs text-dusty-sky-blue">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (review.rating || 0)
                        ? "fill-champagne-gold text-champagne-gold"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-dusty-sky-blue leading-relaxed text-sm">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>

      {/* View More Reviews Button */}
      {reviews.length > 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setIsReviewsModalOpen(true)}
            className="w-full px-6 py-3 bg-gradient-to-r from-champagne-gold/10 to-champagne-gold/5 hover:from-champagne-gold/15 hover:to-champagne-gold/10 border-2 border-champagne-gold/50 hover:border-champagne-gold/70 rounded-lg text-midnight-navy font-medium transition-all flex items-center justify-center gap-2 group"
          >
            <span>Read More Reviews ({reviews.length - 4} more)</span>
          </button>
        </motion.div>
      )}

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        reviews={reviews}
        averageRating={averageRating}
      />
    </motion.section>
  );
}
