import { motion } from "motion/react";
import { Calendar, Zap } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export function PropertySeasonalPricing({ seasonalPricing }) {
  const { symbol, convertPrice } = useCurrency();

  if (!seasonalPricing || Object.keys(seasonalPricing).length === 0)
    return null;

  const seasons = [
    { key: "spring", label: "Spring", icon: "🌸", months: "Mar - May" },
    { key: "summer", label: "Summer", icon: "☀️", months: "Jun - Aug" },
    { key: "fall", label: "Fall", icon: "🍂", months: "Sep - Nov" },
    { key: "winter", label: "Winter", icon: "❄️", months: "Dec - Feb" },
  ];

  const validSeasons = seasons.filter(
    (s) =>
      seasonalPricing[`seasonal_pricing_${s.key}`] || seasonalPricing[s.key],
  );

  if (validSeasons.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-yellow-50/30 to-yellow-50/0 dark:from-slate-700/40 dark:to-slate-700/0 rounded-xl px-6 md:px-8"
      id="seasonal-pricing"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy dark:text-white mb-2 flex items-center gap-3">
        <Calendar className="w-8 h-8 text-champagne-gold" />
        Seasonal Pricing
      </h2>
      <p className="text-dusty-sky-blue dark:text-slate-400 mb-8">
        Prices vary by season for different times of the year
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {validSeasons.map((season, idx) => {
          const priceKey = `seasonal_pricing_${season.key}`;
          const price =
            seasonalPricing[priceKey] || seasonalPricing[season.key];

          return (
            <motion.div
              key={season.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -6,
                boxShadow: "0 16px 32px rgba(212, 175, 55, 0.2)",
              }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-6 bg-gradient-to-br from-yellow-50/60 to-yellow-50/20 dark:from-slate-700/60 dark:to-slate-700/20 rounded-2xl border border-champagne-gold/30 dark:border-slate-600/50 hover:border-champagne-gold/60 dark:hover:border-champagne-gold/40 transition-all duration-300"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {season.icon}
              </div>
              <h3 className="text-xl font-serif text-midnight-navy dark:text-white mb-1 group-hover:text-champagne-gold transition-colors">
                {season.label}
              </h3>
              <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mb-4">
                {season.months}
              </p>

              {price && (
                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif text-midnight-navy dark:text-white font-bold">
                      {symbol}
                      {Math.round(convertPrice(parseFloat(price)))}
                    </span>
                    <span className="text-dusty-sky-blue text-sm">/night</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
