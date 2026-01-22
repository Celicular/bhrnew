import { motion } from "motion/react";

const destinations = [
  {
    id: 1,
    name: "Los Angeles",
    image:
      "https://images.unsplash.com/photo-1634736794027-3297ad344057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzY5MDAzNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Miami Beach",
    image:
      "https://images.unsplash.com/photo-1614505241347-7f4765c1035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJlc29ydCUyMGx1eHVyeXxlbnwxfHx8fDE3NjkwNjc4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "Honolulu",
    image:
      "https://images.unsplash.com/photo-1728050829092-acd5cc835d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGF8ZW58MXx8fHwxNzY5MDAzNTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "New York City",
    image:
      "https://images.unsplash.com/photo-1738260530641-f945fa20a6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGx1eHVyeSUyMGhvdGVsfGVufDF8fHx8MTc2OTA3NDYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    name: "Aspen",
    image:
      "https://images.unsplash.com/photo-1709508496457-e2f9c42493c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NjkwNzQ2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    name: "Charleston",
    image:
      "https://images.unsplash.com/photo-1729708790802-1993d6f5634d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwaXNsYW5kJTIwcmVzb3J0fGVufDF8fHx8MTc2OTA3NDYxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function PopularDestinations() {
  return (
    <section className="py-32 px-6 bg-[#faf8f5]">
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
            Popular Destinations
          </h2>
          <p className="text-lg text-[#6b7280] max-w-2xl mx-auto font-light">
            Trending vacation spots across the United States
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {destinations.map((destination, index) => {
            // Alternate heights for masonry effect
            const isLarge = index % 3 === 0;

            return (
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
                className={isLarge ? "md:row-span-2" : ""}
              >
                <div className="group relative overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 h-full hover:scale-105 hover:-translate-y-2">
                  {/* Image */}
                  <div
                    className={`overflow-hidden ${isLarge ? "aspect-[3/4]" : "aspect-square"}`}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,31,46,0.8)] via-[rgba(26,31,46,0.2)] to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Destination Name */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-2xl md:text-3xl text-[#faf8f5] transform transition-transform duration-500 group-hover:translate-y-[-8px] font-serif font-medium">
                      {destination.name}
                    </h3>
                  </div>

                  {/* Hover Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-[2rem]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
