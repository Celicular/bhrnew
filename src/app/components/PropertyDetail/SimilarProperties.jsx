import { motion } from "motion/react";
import { Star, MapPin } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { getImageUrl } from "@/utils/client";

export function SimilarProperties({ properties, onPropertyClick }) {
  const { symbol, convertPrice } = useCurrency();

  if (!properties || properties.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 dark:border-slate-700/50 bg-gradient-to-br from-[color:var(--indigo-50)]/20 dark:from-slate-800/20 to-transparent rounded-xl px-6 md:px-8"
      id="relevant-properties"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy dark:text-white mb-8">
        Similar Properties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property, idx) => {
          // Handle different API response formats
          const title = property.title || property.name || "Untitled";
          const image = property.image || property.photo;
          const price = property.base_price || property.price || 0;
          const location =
            property.location_city || property.location || "Unknown";
          const rating = property.avg_rating || property.rating || 0;
          const bedrooms = property.bedrooms || 0;
          const bathrooms = property.bathrooms || 0;
          const guests = property.guests_max || 0;
          const convertedPrice = Math.round(convertPrice(price));

          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer rounded-xl bg-gradient-to-br from-white dark:from-slate-800 to-[color:var(--indigo-50)]/10 dark:to-slate-700/10 border border-[color:var(--indigo-100)]/30 dark:border-slate-700/50 hover:border-[color:var(--indigo-200)]/60 dark:hover:border-slate-600/60 hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all overflow-hidden flex flex-col h-full"
              onClick={() => onPropertyClick(property.id)}
            >
              {/* Image Section */}
              <div className="relative overflow-hidden rounded-t-xl h-48">
                <img
                  src={getImageUrl(image)}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white dark:bg-slate-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 fill-champagne-gold text-champagne-gold" />
                  <span className="text-xs font-semibold text-midnight-navy dark:text-white">
                    {rating > 0 ? rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="text-base font-serif text-midnight-navy dark:text-white font-semibold line-clamp-2 group-hover:text-champagne-gold transition-colors">
                  {title}
                </h3>

                <div className="flex items-center gap-1 text-dusty-sky-blue dark:text-slate-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{location}</span>
                </div>

                {/* Room Details */}
                <div className="flex gap-3 text-xs text-gray-600 dark:text-slate-400 flex-wrap">
                  {bedrooms > 0 && (
                    <div className="flex items-center gap-1 bg-[color:var(--blue-50)] dark:bg-slate-700/50 px-2 py-1 rounded">
                      <i className="fas fa-bed text-[color:var(--indigo-600)] dark:text-slate-400"></i>
                      <span className="dark:text-slate-300">
                        {bedrooms} Bed{bedrooms !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {bathrooms > 0 && (
                    <div className="flex items-center gap-1 bg-[color:var(--blue-50)] dark:bg-slate-700/50 px-2 py-1 rounded">
                      <i className="fas fa-bath text-[color:var(--indigo-600)] dark:text-slate-400"></i>
                      <span className="dark:text-slate-300">
                        {bathrooms} Bath{bathrooms !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {guests > 0 && (
                    <div className="flex items-center gap-1 bg-[color:var(--blue-50)] dark:bg-slate-700/50 px-2 py-1 rounded">
                      <i className="fas fa-users text-[color:var(--indigo-600)] dark:text-slate-400"></i>
                      <span className="dark:text-slate-300">
                        {guests} Guest{guests !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="pt-2 mt-auto border-t border-[color:var(--gray-200)] dark:border-slate-700 flex items-center justify-between">
                  <span className="text-lg font-serif text-midnight-navy dark:text-white font-bold">
                    {symbol}
                    {convertedPrice}
                    <span className="text-xs text-dusty-sky-blue dark:text-slate-400 font-normal">
                      /night
                    </span>
                  </span>
                  <a
                    href={`/property/${property.id}`}
                    className="px-3 py-2 bg-midnight-navy dark:bg-slate-700 text-white rounded-lg hover:bg-charcoal-blue dark:hover:bg-slate-600 transition-colors text-xs font-medium"
                  >
                    View
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
