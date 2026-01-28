import { Star, Wifi, MapPin, Navigation, Map, Heart } from "lucide-react";
import { motion } from "motion/react";
import { getImageUrl } from "@/utils/client";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { WishlistSelectionModal } from "./modals/WishlistSelectionModal";
import { useState } from "react";

export function PropertyCard({ property, onShowOnMap }) {
  const { currency, symbol, convertPrice } = useCurrency();
  const { isPropertySaved, addProperty, wishlists } = useWishlist();
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const {
    id,
    title,
    property_type,
    location_city,
    distance,
    bedrooms,
    bathrooms,
    guests_max,
    base_price,
    rating,
    review_count,
    images,
    amenities,
  } = property;

  // Get first image
  const imageUrl = images?.[0]?.image_url
    ? getImageUrl(images[0].image_url)
    : "https://via.placeholder.com/400x300?text=No+Image";

  // Calculate miles from km
  const miles = distance ? (distance * 0.621371).toFixed(1) : "N/A";

  // Get first 1 amenity
  const displayAmenity = amenities?.[0] || null;

  // Check if property is saved
  const isSaved = isPropertySaved(id);

  const handleSaveProperty = (e) => {
    e.stopPropagation();

    // If user has no wishlists or only one, don't show modal
    if (wishlists.length <= 1) {
      if (wishlists.length === 0) {
        // This shouldn't happen as context creates default, but fallback
        alert("Please create a wishlist first");
        return;
      }
      // Auto-select the only wishlist
      addProperty(wishlists[0].id, id);
    } else {
      // Show wishlist selection modal
      setSelectedPropertyId(id);
      setShowWishlistModal(true);
    }
  };

  const handleWishlistSelect = async (wishlistId) => {
    await addProperty(wishlistId, id);
  };

  return (
    <div className="group h-full bg-white dark:bg-slate-800 rounded-3xl overflow-visible shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 cursor-pointer">
      <div
        onClick={() => window.open(`/#/property/${id}`, "_blank")}
        className="h-full flex flex-col cursor-pointer"
      >
        {/* Image Container with Badges */}
        <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-t-3xl">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-semibold">View Property</span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 shadow-lg rounded-full px-3 py-2 flex items-center gap-1.5 border border-slate-100 dark:border-slate-700 hidden">
            <Star className="w-4 h-4 fill-champagne-gold text-champagne-gold" />
            <span className="font-semibold text-midnight-navy dark:text-white text-sm">
              {rating?.toFixed(1) || "N/A"}
            </span>
            {review_count > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({review_count})
              </span>
            )}
          </div>

          {/* Distance Badge */}
          <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 shadow-lg rounded-full px-3 py-2 flex items-center gap-1.5 border border-slate-100 dark:border-slate-700">
            <Navigation className="w-4 h-4 text-champagne-gold" />
            <span className="font-semibold text-midnight-navy dark:text-white text-sm">
              {miles} mi
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Title and Location */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-champagne-gold flex-shrink-0" />
              <p className="text-sm font-semibold text-midnight-navy dark:text-white">
                {location_city}
              </p>
            </div>
            <h3 className="text-lg font-serif text-midnight-navy dark:text-white line-clamp-2 mb-3 leading-snug">
              {bedrooms}-bedroom {property_type || "Home"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 font-medium">
              {title}
            </p>
          </div>

          {/* Beds, Baths, and Amenity Row */}
          <div className="flex items-center justify-between gap-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-midnight-navy dark:text-white font-semibold">
                <span className="text-base">🛏️</span>
                <span>{bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5 text-midnight-navy dark:text-white font-semibold">
                <span className="text-base">🚿</span>
                <span>{bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5 text-midnight-navy dark:text-white font-semibold">
                <span className="text-base">👥</span>
                <span>{guests_max}</span>
              </div>
            </div>

            {/* Amenity Badge */}
            {displayAmenity && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-champagne-gold/10 dark:bg-champagne-gold/10 border border-champagne-gold/30">
                {displayAmenity.name === "Wi-Fi" && (
                  <Wifi className="w-4 h-4 text-champagne-gold" />
                )}
                <span className="text-xs font-semibold text-champagne-gold">
                  {displayAmenity.name}
                </span>
              </div>
            )}
          </div>

          {/* Price and Action Buttons */}
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-1">
                Starting from
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-midnight-navy dark:text-white">
                  {symbol}
                  {convertPrice(parseFloat(base_price)).toFixed(0)}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  /night
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Heart Button (Save to Wishlist) */}
              <motion.button
                onClick={handleSaveProperty}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-all duration-300 border border-slate-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-500 shadow-md hover:shadow-lg hover:-translate-y-1"
                title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isSaved
                      ? "fill-red-500 text-red-500"
                      : "text-slate-400 dark:text-slate-500 hover:text-red-500"
                  }`}
                />
              </motion.button>

              {/* Show on Map Button */}
              {onShowOnMap && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowOnMap(property.id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-champagne-gold/20 dark:hover:bg-champagne-gold/30 flex items-center justify-center transition-all duration-300 border border-slate-200 dark:border-slate-600 hover:border-champagne-gold/50 dark:hover:border-champagne-gold/50 shadow-md hover:shadow-lg hover:-translate-y-1"
                  title="Show on map"
                >
                  <Map className="w-5 h-5 text-champagne-gold" />
                </motion.button>
              )}
              {/* View Property Button */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-champagne-gold/20 to-burnished-gold/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-champagne-gold/40 group-hover:to-burnished-gold/20 transition-all cursor-pointer">
                <span className="text-champagne-gold font-bold text-lg">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Selection Modal */}
      <WishlistSelectionModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        onSelect={handleWishlistSelect}
        propertyId={selectedPropertyId}
      />
    </div>
  );
}
