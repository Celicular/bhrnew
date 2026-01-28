import { motion } from "motion/react";
import { useCurrency } from "@/context/CurrencyContext";
import { getCancellationPolicyInfo } from "@/utils/policyMessages";
import { parseCancellationDescription } from "@/utils/htmlDecoder";
import { AlertCircle, Calendar, Gift, Tag } from "lucide-react";

export function PropertyPricing({
  basePrice,
  selectedDates,
  seasonalPricing,
  cancellationPolicy,
  weeklyDiscount = 0,
  monthlyDiscount = 0,
  customPricingOptions = [],
}) {
  const { symbol, convertPrice } = useCurrency();

  if (!basePrice) return null;

  // Calculate nights between selected dates
  const calculateNights = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const convertedPrice = convertPrice(basePrice);

  // Calculate with discounts
  const subtotal = nights > 0 ? convertedPrice * nights : 0;
  let total = subtotal;
  let discountApplied = "";
  let discountAmount = 0;

  if (nights > 0) {
    if (nights >= 30 && monthlyDiscount > 0) {
      discountAmount = (subtotal * monthlyDiscount) / 100;
      total = subtotal - discountAmount;
      discountApplied = `${monthlyDiscount}% monthly discount`;
    } else if (nights >= 7 && weeklyDiscount > 0) {
      discountAmount = (subtotal * weeklyDiscount) / 100;
      total = subtotal - discountAmount;
      discountApplied = `${weeklyDiscount}% weekly discount`;
    }
  }

  const baseCost = nights > 0 ? total : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--accent-primary-50)]/20 to-transparent rounded-xl px-6 md:px-8"
      id="pricing"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Pricing
      </h2>

      {/* Price Per Night */}
      <div className="bg-gradient-to-br from-[color:var(--accent-primary-50)]/60 to-[color:var(--accent-primary-50)]/20 p-6 md:p-8 rounded-2xl mb-8 border border-[color:var(--accent-primary-200)]/50">
        <p className="text-sm text-slate-600 font-medium mb-2">
          Price per night
        </p>
        <p className="text-4xl font-serif text-midnight-navy">
          {symbol}
          {Math.round(convertedPrice).toLocaleString()}
          <span className="text-lg text-slate-500 font-normal"> / night</span>
        </p>
      </div>

      {/* Seasonal Pricing */}
      {seasonalPricing && seasonalPricing.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-6 md:p-8 bg-gradient-to-br from-white via-[color:var(--accent-primary-50)]/30 to-[color:var(--accent-primary-50)]/10 dark:from-slate-800 dark:via-slate-700/30 dark:to-slate-700/10 rounded-2xl border-2 border-[color:var(--accent-primary-200)]/60 dark:border-slate-600/60 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/30 transition-shadow"
        >
          <h3 className="text-lg md:text-xl font-serif text-midnight-navy dark:text-white mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-champagne-gold" />
            Seasonal Pricing
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 font-medium">
            Nightly rates by season
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seasonalPricing.map((season, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-gradient-to-br from-white to-[color:var(--accent-primary-50)]/40 dark:from-slate-700 dark:to-slate-700/40 rounded-xl border-2 border-[color:var(--accent-primary-200)]/40 dark:border-slate-600/40 hover:border-[color:var(--accent-primary-300)]/70 dark:hover:border-slate-500/70 transition-all hover:shadow-md dark:hover:shadow-slate-900/30"
              >
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  {season.season}
                </p>
                <p className="text-lg font-serif text-midnight-navy dark:text-white mb-1">
                  {symbol}
                  {Math.round(convertPrice(season.price)).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  /night
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pricing Breakdown */}
      {nights > 0 && (
        <div className="bg-gradient-to-br from-white dark:from-slate-800 to-[color:var(--accent-primary-50)]/20 dark:to-slate-700/20 p-6 md:p-8 rounded-2xl border-2 border-champagne-gold/50 dark:border-champagne-gold/30 shadow-md hover:shadow-lg transition-shadow mb-8">
          <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-4">
            Booking Summary
          </h3>
          <div className="space-y-3 mb-4 pb-4 border-b border-[color:var(--gray-200)] dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-[color:var(--gray-600)] dark:text-slate-400">
                {symbol}
                {Math.round(convertedPrice).toLocaleString()} × {nights} night
                {nights > 1 ? "s" : ""}
              </span>
              <span className="font-medium text-midnight-navy dark:text-white">
                {symbol}
                {Math.round(subtotal).toLocaleString()}
              </span>
            </div>

            {/* Discount Line */}
            {discountApplied && (
              <div className="flex justify-between text-[color:var(--accent-primary-300)] dark:text-emerald-400">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {discountApplied}
                </span>
                <span>
                  -{symbol}
                  {Math.round(discountAmount).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-serif text-lg text-midnight-navy dark:text-white">
              Total
            </span>
            <span className="text-3xl font-serif text-champagne-gold">
              {symbol}
              {Math.round(baseCost).toLocaleString()}
            </span>
          </div>

          {/* Discount Incentives */}
          {weeklyDiscount > 0 && nights < 7 && (
            <div className="flex items-center gap-2 text-sm text-[color:var(--accent-primary-300)] dark:text-emerald-400 bg-[color:var(--accent-primary-50)]/50 dark:bg-slate-700/30 p-3 rounded-lg">
              <Gift className="w-4 h-4 flex-shrink-0" />
              Save {weeklyDiscount}% with a 7+ night stay
            </div>
          )}
          {monthlyDiscount > 0 && nights < 30 && (
            <div className="flex items-center gap-2 text-sm text-[color:var(--accent-primary-300)] bg-[color:var(--accent-primary-50)]/50 p-3 rounded-lg mt-2">
              <Gift className="w-4 h-4 flex-shrink-0" />
              Save {monthlyDiscount}% with a 30+ night stay
            </div>
          )}
        </div>
      )}

      {/* Seasonal Pricing Info - Custom Pricing Options */}
      {customPricingOptions && customPricingOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-6 md:p-8 bg-gradient-to-br from-white via-[color:var(--accent-secondary-50)]/30 to-[color:var(--accent-secondary-50)]/10 rounded-2xl border-2 border-[color:var(--accent-secondary-200)]/60 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg md:text-xl font-serif text-midnight-navy mb-1 flex items-center gap-2">
            <Tag className="w-5 h-5 text-champagne-gold" />
            Custom Pricing Options
          </h3>
          <p className="text-xs text-slate-600 mb-4 font-medium">
            Special pricing tiers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customPricingOptions.map((option, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-gradient-to-br from-white to-[color:var(--accent-secondary-50)]/40 rounded-xl border-2 border-[color:var(--accent-secondary-200)]/40 hover:border-[color:var(--accent-secondary-300)]/70 transition-all hover:shadow-md"
              >
                <p className="text-xs font-medium text-dusty-sky-blue mb-2 uppercase tracking-wide">
                  {option.name || "Pricing Option"}
                </p>
                <p className="text-2xl font-serif text-midnight-navy">
                  {symbol}
                  {Math.round(convertPrice(option.value)).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cancellation Policy */}
      {cancellationPolicy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 md:p-8 bg-gradient-to-br from-white dark:from-slate-800 via-champagne-gold/5 to-bone-white dark:to-slate-700 border-2 border-champagne-gold/60 dark:border-champagne-gold/40 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-slate-900/30 transition-shadow"
        >
          {(() => {
            const policyInfo = getCancellationPolicyInfo(cancellationPolicy);
            if (!policyInfo) return null;

            const colorMap = {
              emerald:
                "bg-[color:var(--accent-primary-50)]/50 border-[color:var(--accent-primary-300)]/60 text-[color:var(--accent-primary-300)]",
              amber:
                "bg-[color:var(--amber-50)]/50 border-[color:var(--amber-300)]/60 text-[color:var(--amber-600)]",
              rose: "bg-[color:var(--destructive-light-100)]/50 border-[color:var(--destructive-light-600)]/60 text-[color:var(--destructive-light-600)]",
              gray: "bg-[color:var(--gray-50)]/50 border-[color:var(--gray-200)]/60 text-[color:var(--gray-600)]",
            };

            const badgeColor = colorMap[policyInfo.color] || colorMap.gray;

            return (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-2">
                      Cancellation Policy
                    </h3>
                    <div
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${badgeColor} mb-3`}
                    >
                      {policyInfo.label}
                    </div>
                  </div>
                </div>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">
                  {parseCancellationDescription(policyInfo.description)}
                </div>
                <div className="pt-4 border-t border-champagne-gold/20 flex items-start gap-2 text-sm text-champagne-gold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    Please review this policy carefully before making your
                    booking.
                  </p>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </motion.section>
  );
}
