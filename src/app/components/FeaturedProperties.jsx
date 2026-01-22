import { useState, useEffect, forwardRef } from "react";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Heart,
  Wind,
  Home,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "@/context/CurrencyContext";

const API_BASE_URL = "https://bookholidayrental.com";

const amenityIcons = {
  "Air Conditioning": Wind,
  Balcony: Home,
  Books: BookOpen,
  Pool: Users,
  "Beach Access": MapPin,
  Gym: Users,
  Parking: Home,
  "Hot Tub": Wind,
  Fireplace: Home,
  "Ski Access": MapPin,
};

const PropertySkeleton = forwardRef(() => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="group cursor-pointer transition-transform duration-500"
  >
    <div>
      {/* Image Skeleton with shimmer */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative overflow-hidden rounded-[2rem] mb-6 shadow-xl h-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
      />

      {/* Content Skeleton */}
      <div className="space-y-4">
        {/* Title skeleton */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
          className="h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-4/5"
        />

        {/* Location skeleton */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-2/3"
        />

        {/* Icons skeleton */}
        <div className="flex items-center gap-6">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-24"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-24"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-24"
          />
        </div>

        {/* Amenities skeleton */}
        <div className="flex flex-wrap gap-2">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full w-24"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full w-24"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full w-24"
          />
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-300">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
            className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-16"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-20"
          />
        </div>
      </div>
    </div>
  </motion.div>
));

PropertySkeleton.displayName = "PropertySkeleton";

export function FeaturedProperties() {
  const { currency, symbol, convertPrice } = useCurrency();
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [apiProperties, setApiProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/property/view.php?list=1&limit=8`,
        );

        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          // Transform API data to match component structure
          const transformed = data.data.map((prop) => {
            let imageUrl = prop.images?.[0]?.image_url || "";
            // If image URL is relative, prepend the domain
            if (imageUrl && !imageUrl.startsWith("http")) {
              imageUrl = `${API_BASE_URL}/${imageUrl}`;
            }
            return {
              id: prop.id,
              name: prop.title,
              location: prop.location_city,
              image: imageUrl,
              rating: parseFloat(prop.average_rating) || 0,
              reviews: prop.reviews?.length || 0,
              price: Math.round(prop.base_price),
              guests: prop.guests_max,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              amenities: prop.amenities?.slice(0, 3).map((a) => a.name) || [],
            };
          });
          setApiProperties(transformed);
          setLoading(false);
        } else {
          // Keep loading state active if no valid data
          console.error("No valid data received from API");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        // Keep loading state active on error - skeletons will stay visible
      }
    };

    fetchProperties();
  }, []);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const cardsPerPage = isMobile ? 1 : 4;
  const totalPages = Math.ceil(apiProperties.length / cardsPerPage);
  const currentProperties = isMobile
    ? [apiProperties[currentPage]]
    : apiProperties.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage,
      );

  // Auto-rotate on mobile every 10 seconds
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || apiProperties.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) =>
        prev === apiProperties.length - 1 ? 0 : prev + 1,
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [apiProperties]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="px-6 bg-[#faf8f5]"
      style={{ marginTop: "128px", marginBottom: 0 }}
      id="inspiration"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl text-[#1a1f2e] mb-4 font-serif font-light">
            Featured Collection
          </h2>
          <p className="text-lg text-[#6b7280] max-w-2xl mx-auto font-light">
            Handpicked vacation homes across the United States
          </p>
        </motion.div>

        {/* Properties Grid with Navigation */}
        <div className="relative">
          {/* Left Navigation Button */}
          <motion.button
            onClick={goToPrevious}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 p-3 bg-[#1a1f2e] text-white rounded-full hover:bg-[#2a3142] transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Right Navigation Button */}
          <motion.button
            onClick={goToNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 p-3 bg-[#1a1f2e] text-white rounded-full hover:bg-[#2a3142] transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12 scale-90 md:scale-100 origin-top">
            <AnimatePresence mode="popLayout">
              {loading
                ? // Show 4 skeletons while loading
                  Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <PropertySkeleton key={`skeleton-${index}`} />
                    ))
                : // Show properties when loaded
                  currentProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="group cursor-pointer transition-transform duration-500">
                        {/* Image Container */}
                        <div className="relative overflow-hidden rounded-[2rem] mb-6 shadow-xl hover:shadow-2xl transition-all duration-500">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={property.image}
                              alt={property.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,31,46,0.6)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Rating Badge */}
                          <div className="absolute top-6 left-6 backdrop-blur-md bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                            <span className="text-sm font-medium text-[#1a1f2e]">
                              {property.rating.toFixed(1)}
                            </span>
                          </div>

                          {/* Heart Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(property.id);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-6 right-6 p-3 backdrop-blur-md bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                          >
                            <Heart
                              className={`w-5 h-5 transition-all duration-300 ${
                                favorites.includes(property.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-[#1a1f2e]"
                              }`}
                            />
                          </motion.button>
                        </div>

                        {/* Property Info */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl text-[#1a1f2e] mb-2 line-clamp-2 font-serif font-medium">
                              {property.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[#9baab8] mb-4">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">
                                {property.location}
                              </span>
                            </div>
                          </div>

                          {/* Guests, Beds, Baths */}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[#1a1f2e]">
                              <Users className="w-5 h-5 text-[#d4af37]" />
                              <span className="text-sm">
                                {property.guests} guests
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#1a1f2e]">
                              <Bed className="w-5 h-5 text-[#d4af37]" />
                              <span className="text-sm">
                                {property.bedrooms} beds
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#1a1f2e]">
                              <Bath className="w-5 h-5 text-[#d4af37]" />
                              <span className="text-sm">
                                {property.bathrooms} baths
                              </span>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity) => {
                              const Icon = amenityIcons[amenity] || Home;
                              return (
                                <div
                                  key={amenity}
                                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#f8f6f3] border border-[#1a1f2e]/5"
                                >
                                  <Icon className="w-4 h-4 text-[#d4af37]" />
                                  <span className="text-xs text-[#6b7280]">
                                    {amenity}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-[#1a1f2e]/10">
                            <div className="text-sm text-[#6b7280]">
                              {property.reviews} reviews
                            </div>
                            <div className="text-right">
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl text-[#1a1f2e] font-serif font-light">
                                  {symbol}
                                  {Math.abs(
                                    Math.round(convertPrice(property.price)),
                                  ).toLocaleString()}
                                </span>
                                <span className="text-sm text-[#9baab8]">
                                  /night
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Indicators */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center items-center gap-3 mt-12"
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPage(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentPage
                    ? "w-8 h-3 bg-[#d4af37]"
                    : "w-3 h-3 bg-[#d4af37]/30 hover:bg-[#d4af37]/60"
                }`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
