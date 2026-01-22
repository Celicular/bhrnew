import { motion } from "motion/react";
import { Award, Shield, Globe, Heart } from "lucide-react";

const metrics = [
  { icon: Globe, value: "5,000+", label: "Properties Nationwide" },
  { icon: Award, value: "10+ Years", label: "Of Excellence" },
  { icon: Shield, value: "100%", label: "Verified Listings" },
  { icon: Heart, value: "250K+", label: "Happy Guests" },
];

export function BrandStory() {
  return (
    <section className="py-32 px-6 bg-[#faf8f5]" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1638799869566-b17fa794c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjkwNzAwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Luxury Vacation Rental Interior"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>

            {/* Floating Accent */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div>
              <div className="inline-block px-5 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-6">
                <span className="text-sm text-[#d4af37] uppercase tracking-wider">
                  Our Story
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl text-[#1a1f2e] mb-6 font-serif font-light">
                About Book
                <br />
                Holiday Rentals
              </h2>
              <div className="space-y-4 text-lg text-[#6b7280] font-light leading-relaxed">
                <p>
                  We are revolutionizing the way travelers discover and book
                  their perfect vacation homes. With over a decade of experience
                  in the hospitality industry, our mission is to connect guests
                  with extraordinary properties and unforgettable experiences.
                </p>
              </div>
            </div>

            {/* Value Props */}
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#f8f6f3] border border-[#1a1f2e]/5">
                  <Heart className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl text-[#1a1f2e] mb-2 font-serif font-medium">
                    Guest-Centric Approach
                  </h3>
                  <p className="text-[#6b7280] font-light">
                    Your satisfaction is our top priority. Every detail, every
                    feature, and every service is designed with you in mind.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#f8f6f3] border border-[#1a1f2e]/5">
                  <Shield className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl text-[#1a1f2e] mb-2 font-serif font-medium">
                    Trusted & Verified
                  </h3>
                  <p className="text-[#6b7280] font-light">
                    All properties undergo rigorous verification to ensure
                    quality, safety, and authenticity for your peace of mind.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#f8f6f3] border border-[#1a1f2e]/5">
                  <Globe className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl text-[#1a1f2e] mb-2 font-serif font-medium">
                    Nationwide Network
                  </h3>
                  <p className="text-[#6b7280] font-light">
                    Access thousands of curated properties across prime US
                    destinations, all in one place.
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#1a1f2e]/10">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl text-[#1a1f2e] mb-2 font-serif font-light">
                    {metric.value}
                  </div>
                  <div className="text-sm text-[#9baab8]">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-8">
              <button className="group relative overflow-hidden px-10 py-5 rounded-full bg-[#1a1f2e] text-[#faf8f5] hover:bg-[#2a3142] transition-all duration-500 shadow-lg hover:shadow-xl">
                <span className="relative z-10">Start Exploring</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/10 to-[#d4af37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <button
                className="px-10 py-5 rounded-full border-2 border-[#1a1f2e]/20 text-[#1a1f2e] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-500"
                id="host"
              >
                Become a Host
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
