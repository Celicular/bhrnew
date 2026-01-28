import { motion } from "motion/react";
import { CheckCircle2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TIERS = [
  {
    id: 1,
    name: "Tier 1",
    price: 139,
    description: "Perfect for getting started",
    features: [
      "12 Months Subscription",
      "10 Photos",
      "2000 Character Description",
      "Availability Calendar",
      "City Page Featured Listing",
      "Location Map",
      "Direct Communication with Guests",
      "Placement Below Tier 2 & 3",
    ],
    highlighted: false,
  },
  {
    id: 2,
    name: "Tier 2",
    price: 239,
    description: "Most Popular",
    features: [
      "12 Months Subscription",
      "Unlimited Text Description",
      "Availability Calendar",
      "City & State Page Featured Listing",
      "Calendar Sync with One Website",
      "Location Map",
      "Direct Communication with Guests",
      "Personal Website Link",
      "Placement Below Tier 3",
    ],
    highlighted: true,
  },
  {
    id: 3,
    name: "Tier 3",
    price: 299,
    description: "Maximum exposure & features",
    features: [
      "12 Months Subscription",
      "Unlimited Text Description",
      "Availability Calendar",
      "Calendar Sync with Multiple Websites",
      "Home, City & State Page Featured Listing",
      "Location Map",
      "Direct Communication with Guests",
      "Personal Website Link",
      "Video Link Support",
      "Monthly Newsletter",
      "Quarterly Reporting",
      "Placement Above Tier 1 & 2",
    ],
    highlighted: false,
  },
];

export function HostingPricing() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-white dark:bg-slate-900">
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&q=80"
          alt="Pricing Background"
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-champagne-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-champagne-gold/5 rounded-full blur-3xl"></div>
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
            💎 Flexible Pricing
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-midnight-navy dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-soft-stone-gray dark:text-dusty-sky-blue max-w-2xl mx-auto">
            Select the perfect package to start your hosting journey with powerful features at every level
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                tier.highlighted
                  ? "ring-2 ring-champagne-gold shadow-2xl transform md:scale-105"
                  : "border border-soft-stone-gray/20 dark:border-white/10 shadow-lg hover:shadow-xl"
              } ${
                tier.highlighted
                  ? "bg-white dark:bg-slate-800/90"
                  : "bg-white dark:bg-slate-800/90 backdrop-blur-sm"
              } relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/0 to-champagne-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {tier.highlighted && (
                <div className="relative z-20 bg-gradient-to-r from-champagne-gold via-champagne-gold/90 to-champagne-gold/80 text-midnight-navy py-3 px-4 text-center font-bold text-sm flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 fill-midnight-navy" />
                  MOST POPULAR
                  <Star className="w-5 h-5 fill-midnight-navy" />
                </div>
              )}

              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-midnight-navy dark:text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-white/80 mb-6">
                  {tier.description}
                </p>

                <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
                  <span className="text-5xl font-bold text-champagne-gold">
                    ${tier.price}
                  </span>
                  <span className="text-gray-600 dark:text-white/80 ml-2 text-sm font-medium">
                    /year
                  </span>
                </div>

                <motion.button
                  onClick={() => navigate("/login?role=host")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-champagne-gold to-champagne-gold/90 text-midnight-navy hover:shadow-lg hover:shadow-champagne-gold/50"
                      : "border border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 hover:border-champagne-gold"
                  }`}
                >
                  Get Started
                </motion.button>

                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                        className="flex items-start gap-3 text-sm text-midnight-navy dark:text-white/90"
                    >
                      <CheckCircle2 className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
