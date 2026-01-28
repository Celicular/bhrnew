import { motion } from "motion/react";
import { Bed, Bath, Sofa, UtensilsCrossed } from "lucide-react";

export function PropertyRooms({ rooms }) {
  if (!rooms || Object.keys(rooms).length === 0) return null;

  const hasData =
    rooms.bedrooms?.items?.length > 0 ||
    rooms.bathrooms?.items?.length > 0 ||
    rooms.halls?.items?.length > 0 ||
    rooms.kitchens?.items?.length > 0;

  if (!hasData) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--blue-50)]/30 to-transparent rounded-xl px-6 md:px-8"
      id="amenities-facilities"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Rooms & Spaces
      </h2>

      <div className="space-y-8">
        {/* Bedrooms */}
        {rooms.bedrooms?.items && rooms.bedrooms.items.length > 0 && (
          <div>
            <h3 className="text-xl font-serif text-midnight-navy mb-4 flex items-center gap-3">
              <Bed className="w-6 h-6 text-champagne-gold" />
              Bedrooms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.bedrooms.items.map((bedroom, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-md transition-all"
                >
                  <h4 className="font-serif text-midnight-navy font-semibold mb-2">
                    {bedroom.type || `Bedroom ${idx + 1}`}
                  </h4>
                  <p className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                    {bedroom.description || "Comfortable bedroom space"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bathrooms */}
        {rooms.bathrooms?.items && rooms.bathrooms.items.length > 0 && (
          <div>
            <h3 className="text-xl font-serif text-midnight-navy mb-4 flex items-center gap-3">
              <Bath className="w-6 h-6 text-champagne-gold" />
              Bathrooms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.bathrooms.items.map((bathroom, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-md transition-all"
                >
                  <h4 className="font-serif text-midnight-navy font-semibold mb-2">
                    {bathroom.type || `Bathroom ${idx + 1}`}
                  </h4>
                  <p className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                    {bathroom.description || "Well-equipped bathroom"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Living Areas */}
        {rooms.halls?.items && rooms.halls.items.length > 0 && (
          <div>
            <h3 className="text-xl font-serif text-midnight-navy mb-4 flex items-center gap-3">
              <Sofa className="w-6 h-6 text-champagne-gold" />
              Living Areas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.halls.items.map((hall, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-md transition-all"
                >
                  <h4 className="font-serif text-midnight-navy font-semibold mb-2">
                    {hall.type || `Living Room ${idx + 1}`}
                  </h4>
                  <p className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                    {hall.description || "Spacious living area"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Kitchens */}
        {rooms.kitchens?.items && rooms.kitchens.items.length > 0 && (
          <div>
            <h3 className="text-xl font-serif text-midnight-navy mb-4 flex items-center gap-3">
              <UtensilsCrossed className="w-6 h-6 text-champagne-gold" />
              Kitchens
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.kitchens.items.map((kitchen, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 rounded-xl border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-md transition-all"
                >
                  <h4 className="font-serif text-midnight-navy font-semibold mb-2">
                    {kitchen.type || `Kitchen ${idx + 1}`}
                  </h4>
                  <p className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                    {kitchen.description || "Fully equipped kitchen"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
