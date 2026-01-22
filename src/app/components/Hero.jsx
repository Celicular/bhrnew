import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section 
      className="relative h-screen w-full overflow-hidden pt-20 bg-cover bg-center"
      style={{
        backgroundImage: "url(/src/assets/bg.png)",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/src/assets/hero-video.webm" type="video/webm" />
      </video>
      {/* Soft Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,31,46,0.5)] via-[rgba(26,31,46,0.3)] to-[rgba(26,31,46,0.7)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="mb-6 text-6xl md:text-7xl lg:text-8xl text-[#faf8f5] tracking-wide font-serif font-light">
            Your Perfect
            <br />
            <span className="text-[#d4af37]">Vacation Home</span>
            <br />
            Awaits
          </h1>
          <p className="mb-12 text-lg md:text-xl text-[#f8f6f3]/90 max-w-2xl mx-auto font-light">
            Discover exceptional vacation rentals across the United States.
            <br />
            From beachfront escapes to mountain retreats.
          </p>
        </motion.div>

        {/* Glassmorphism Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs text-[#f8f6f3]/70 uppercase tracking-wider font-medium">
                  Destination
                </label>
                <div className="flex items-center gap-3 text-[#faf8f5] bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <MapPin className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="bg-transparent border-none outline-none w-full placeholder:text-[#f8f6f3]/40 text-[#faf8f5] font-medium"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div className="space-y-2">
                <label className="text-xs text-[#f8f6f3]/70 uppercase tracking-wider font-medium">
                  Check In
                </label>
                <div className="flex items-center gap-3 text-[#faf8f5] bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Calendar className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add dates"
                    className="bg-transparent border-none outline-none w-full placeholder:text-[#f8f6f3]/40 text-[#faf8f5] font-medium"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-xs text-[#f8f6f3]/70 uppercase tracking-wider font-medium">
                  Guests
                </label>
                <div className="flex items-center gap-3 text-[#faf8f5] bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Users className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add guests"
                    className="bg-transparent border-none outline-none w-full placeholder:text-[#f8f6f3]/40 text-[#faf8f5] font-medium"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button className="group relative overflow-hidden bg-[#d4af37] hover:bg-[#c9a532] text-[#1a1f2e] px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/30 font-medium">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-[#f8f6f3]/60 uppercase tracking-wider">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-[#f8f6f3]/30 rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
