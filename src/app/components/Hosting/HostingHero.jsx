import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HostingHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-6 flex items-center overflow-hidden">
      {/* Background Image - Full Coverage */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=2000&q=80"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay for Both Modes */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 to-black/50 dark:from-black/85 dark:to-black/70"></div>
      
      {/* Content Wrapper */}
      <div className="relative z-20 flex items-center justify-center w-full h-full">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center">
            <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-champagne-gold/20 text-champagne-gold font-semibold text-sm backdrop-blur-sm"
            >
              ✨ Join 10K+ Successful Hosts
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-champagne-gold mb-6 leading-tight">
              <span className="text-champagne-gold">
                Host Your
              </span>
              <br />
              Property Now
            </h1>

            <p className="text-lg md:text-xl text-white/90 dark:text-white/90 mb-8 leading-relaxed max-w-xl">
              Transform your space into a source of income. Start earning with BookholidayRentals and join thousands of successful hosts worldwide making an average of $6,800/month.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-champagne-gold to-champagne-gold/90 text-white hover:shadow-2xl hover:shadow-champagne-gold/50 transition-all font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/login?role=host&mode=login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl border-2 border-champagne-gold/50 text-champagne-gold hover:border-champagne-gold hover:bg-champagne-gold/10 transition-all font-semibold text-lg backdrop-blur-sm"
              >
                Host Login
              </motion.button>
            </div>

            {/* Quick Stats with Enhanced Styling */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-soft-stone-gray/10 dark:border-dusty-sky-blue/10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/10 dark:border-white/10"
              >
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-champagne-gold to-champagne-gold/70 bg-clip-text text-transparent">10K+</p>
                <p className="text-xs md:text-sm text-white font-medium">Active Hosts</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/10 dark:border-white/10"
              >
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-champagne-gold to-champagne-gold/70 bg-clip-text text-transparent">50K+</p>
                <p className="text-xs md:text-sm text-white font-medium">Properties</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/10 dark:border-white/10"
              >
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-champagne-gold to-champagne-gold/70 bg-clip-text text-transparent">150K+</p>
                <p className="text-xs md:text-sm text-white font-medium">Happy Guests</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-96"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/30 via-champagne-gold/10 to-transparent rounded-3xl blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-champagne-gold/20 rounded-full blur-3xl"></div>
            
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
              alt="Beautiful Property"
              className="relative rounded-3xl w-full h-full shadow-2xl object-cover border border-white/20 dark:border-dusty-sky-blue/20"
            />
            
            <div className="absolute bottom-8 left-8 right-8 p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-xl">
              <p className="text-sm font-semibold text-white mb-2">Premium Properties</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80">Average earnings</span>
                <span className="text-lg font-bold text-champagne-gold">$6,800/mo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
}
