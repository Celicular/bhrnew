import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "California",
    region: "West Coast",
    image:
      "https://images.unsplash.com/photo-1634736794027-3297ad344057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzY5MDAzNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 847,
  },
  {
    id: 2,
    name: "Florida",
    region: "Southeast",
    image:
      "https://images.unsplash.com/photo-1614505241347-7f4765c1035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJlc29ydCUyMGx1eHVyeXxlbnwxfHx8fDE3NjkwNjc4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 962,
  },
  {
    id: 3,
    name: "Hawaii",
    region: "Pacific Islands",
    image:
      "https://images.unsplash.com/photo-1728050829092-acd5cc835d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGF8ZW58MXx8fHwxNzY5MDAzNTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 423,
  },
  {
    id: 4,
    name: "New York",
    region: "Northeast",
    image:
      "https://images.unsplash.com/photo-1738260530641-f945fa20a6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGx1eHVyeSUyMGhvdGVsfGVufDF8fHx8MTc2OTA3NDYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 573,
  },
  {
    id: 5,
    name: "Colorado",
    region: "Mountain West",
    image:
      "https://images.unsplash.com/photo-1709508496457-e2f9c42493c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NjkwNzQ2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 334,
  },
  {
    id: 6,
    name: "Texas",
    region: "Southwest",
    image:
      "https://images.unsplash.com/photo-1729708790802-1993d6f5634d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwaXNsYW5kJTIwcmVzb3J0fGVufDF8fHx8MTc2OTA3NDYxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 628,
  },
];

export function Destinations() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#faf8f5] to-[#f8f6f3]">
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
            Explore Destinations
          </h2>
          <p className="text-lg text-[#6b7280] max-w-2xl mx-auto font-light">
            Discover vacation rentals across America's most beautiful states
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="group relative overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,31,46,0.85)] via-[rgba(26,31,46,0.3)] to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                    <h3 className="text-3xl text-[#faf8f5] mb-2 font-serif font-medium">
                      {destination.name}
                    </h3>
                    <p className="text-[#d4af37] text-sm mb-3 font-light tracking-wide">
                      {destination.region}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <span className="text-[#f8f6f3]/80 text-sm">
                        {destination.properties} properties
                      </span>
                      <div className="flex items-center gap-2 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-sm">View Properties</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/10 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See All Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 rounded-full text-[#1a1f2e] font-medium bg-transparent hover:bg-[#1a1f2e] hover:text-[#faf8f5] transition-all duration-500 shadow-md hover:shadow-xl cursor-pointer"
            style={{ border: "2px solid #d4af37" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#1a1f2e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#d4af37")
            }
          >
            View All Destinations
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
