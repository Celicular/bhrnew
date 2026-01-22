import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "San Francisco, CA",
    review:
      "The Newark retreat was absolutely perfect for our family getaway. The home gym and outdoor grill made our stay incredibly comfortable. Highly recommend!",
    rating: 5,
    stay: "Newark Retreat, Alameda",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Austin, TX",
    review:
      "Booking was seamless and the property exceeded all expectations. The location was ideal and the amenities were top-notch. Will definitely book again!",
    rating: 5,
    stay: "Beachfront Paradise, Malibu",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Miami, FL",
    review:
      "Our mountain retreat in Colorado was a dream come true. Stunning views, cozy fireplace, and the hot tub was perfect after skiing. Book Holiday Rentals made it all so easy!",
    rating: 5,
    stay: "Mountain Chalet, Aspen",
  },
];

export function Testimonials() {
  return (
    <section
      className="py-32 px-6 bg-gradient-to-b from-[#f8f6f3] to-[#faf8f5]"
      id="testimonials"
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
            Guest Experiences
          </h2>
          <p className="text-lg text-[#6b7280] max-w-2xl mx-auto font-light">
            Stories from our distinguished travelers
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="group relative h-full">
                {/* Glass Card */}
                <div className="relative h-full p-8 rounded-[2rem] backdrop-blur-sm bg-white/60 border border-white/40 shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-500">
                  {/* Quote Icon */}
                  <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Quote className="w-16 h-16 text-[#d4af37]" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#d4af37] text-[#d4af37]"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-[#1a1f2e] mb-8 leading-relaxed font-light">
                    "{testimonial.review}"
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-6" />

                  {/* Author Info */}
                  <div>
                    <div className="text-lg text-[#1a1f2e] mb-1 font-serif font-medium">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[#9baab8] mb-3">
                      {testimonial.location}
                    </div>
                    <div className="text-xs text-[#d4af37] uppercase tracking-wider">
                      Stayed at {testimonial.stay}
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[2rem]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-16"
        >
          <button className="group px-10 py-5 rounded-full border-2 border-[#1a1f2e]/20 text-[#1a1f2e] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-500">
            Read More Stories
          </button>
        </motion.div>
      </div>
    </section>
  );
}
