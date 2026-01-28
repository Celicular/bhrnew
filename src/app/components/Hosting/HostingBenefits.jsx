import { motion } from "motion/react";
import { TrendingUp, Shield, Globe, Zap, Star, Megaphone } from "lucide-react";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Maximize Your Earnings",
    description:
      "Set your own prices, manage availability, and earn up to 95% of booking revenue with minimal fees.",
  },
  {
    icon: Shield,
    title: "Host Protection",
    description:
      "Comprehensive host protection insurance and 24/7 support to handle any situation with confidence.",
  },
  {
    icon: Globe,
    title: "Global Guest Network",
    description:
      "Access millions of travelers worldwide. Our platform connects you with guests from every corner of the globe.",
  },
  {
    icon: Zap,
    title: "Powerful Tools",
    description:
      "Professional calendar management, automated messaging, and smart pricing tools to streamline your hosting.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description:
      "Earn guest reviews and ratings that showcase your hospitality. Superhost status unlocks special badges.",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    description:
      "Get featured in our newsletter, social media, and trending searches. We help you reach more guests.",
  },
];

export function HostingBenefits() {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white/0 dark:from-slate-900/20 via-white/20 dark:via-slate-900/50 to-white/0 dark:to-slate-900/20"></div>
      
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=2000&q=80"
          alt="Benefits Background"
          className="w-full h-full object-cover opacity-25 dark:opacity-15"
        />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-champagne-gold/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-2 rounded-full bg-champagne-gold/20 text-champagne-gold font-semibold text-sm mb-4 backdrop-blur-sm"
          >
            🚀 Why Choose Us
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-midnight-navy dark:text-white mb-4">
            Why Host With Us?
          </h2>
          <p className="text-lg text-soft-stone-gray dark:text-dusty-sky-blue max-w-2xl mx-auto">
            Everything you need to succeed as a host
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:shadow-2xl dark:hover:shadow-xl dark:hover:shadow-champagne-gold/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/0 via-champagne-gold/0 to-champagne-gold/8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-gold/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 12 }}
                    className="mb-4 inline-block p-4 bg-gradient-to-br from-champagne-gold/20 to-champagne-gold/5 rounded-xl group-hover:from-champagne-gold/30 group-hover:to-champagne-gold/10 transition-all"
                  >
                    <Icon className="w-8 h-8 text-champagne-gold" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-midnight-navy dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 dark:text-white/80 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
