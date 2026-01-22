import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function InspirationalCTA() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1722409195473-d322e99621e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNvcnQlMjBwb29sfGVufDF8fHx8MTc2ODk3NjQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Pool"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,31,46,0.7)] via-[rgba(26,31,46,0.6)] to-[rgba(26,31,46,0.8)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-md bg-white/10 border border-white/20 mb-8">
            <Sparkles className="w-10 h-10 text-[#d4af37]" />
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#faf8f5] mb-8 leading-tight font-serif font-light">
            Your Dream Vacation
            <br />
            <span className="text-[#d4af37]">Starts Here</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-[#c5c3bd] mb-12 font-light max-w-2xl mx-auto">
            Book verified vacation rentals across the United States with
            confidence
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden px-12 py-6 rounded-full bg-[#d4af37] text-[#1a1f2e] shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              Start Your Journey
              <svg
                className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>

            {/* Animated Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[#9baab8]"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Verified Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>24/7 Concierge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Best Price Guarantee</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
