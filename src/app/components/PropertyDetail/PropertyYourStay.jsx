import { motion } from "motion/react";
import { Star, MapPin, Users, Bed, Bath, Share2 } from "lucide-react";
import { decodeHtmlEntities } from "@/utils/htmlDecoder";

export function PropertyYourStay({
  title,
  description,
  location,
  bedrooms,
  bathrooms,
  maxGuests,
  propertyType,
  rating,
  reviews,
  onDescriptionClick,
  onShare,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-br from-warm-ivory/30 dark:from-slate-800/30 to-transparent rounded-xl px-6 md:px-8"
      id="your-stay"
    >
      {/* Title and Share */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-serif text-midnight-navy mb-2">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-dusty-sky-blue mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {location && !location.includes("NaN") ? location : "Location"}
              </span>
            </div>
            {rating && !isNaN(rating) && rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-champagne-gold text-champagne-gold" />
                <span className="text-sm font-serif">{rating.toFixed(1)}</span>
                {reviews && (
                  <span className="text-sm font-serif">
                    ({reviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onShare}
          className="p-3 hover:bg-warm-ivory rounded-full transition-colors"
          title="Share property"
        >
          <Share2 className="w-6 h-6 text-midnight-navy" />
        </button>
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="text-gray-700 dark:text-slate-300 leading-relaxed line-clamp-3">
          {decodeHtmlEntities(description)}
        </p>
        {description && description.length > 300 && (
          <button
            onClick={onDescriptionClick}
            className="text-champagne-gold hover:text-accent font-medium mt-2 transition-colors"
          >
            Read More
          </button>
        )}
      </div>

      {/* Basic Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bedrooms && (
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bed className="w-5 h-5 text-champagne-gold" />
              <span className="text-sm text-dusty-sky-blue">Bedrooms</span>
            </div>
            <p className="text-2xl font-serif text-midnight-navy">{bedrooms}</p>
          </motion.div>
        )}
        {bathrooms && (
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bath className="w-5 h-5 text-champagne-gold" />
              <span className="text-sm text-dusty-sky-blue">Bathrooms</span>
            </div>
            <p className="text-2xl font-serif text-midnight-navy">
              {bathrooms}
            </p>
          </motion.div>
        )}
        {maxGuests && (
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-champagne-gold" />
              <span className="text-sm text-dusty-sky-blue">Guests</span>
            </div>
            <p className="text-2xl font-serif text-midnight-navy">
              {maxGuests}
            </p>
          </motion.div>
        )}
        {propertyType && (
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-dusty-sky-blue">Type</span>
            </div>
            <p className="text-lg font-serif text-midnight-navy truncate">
              {propertyType}
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
