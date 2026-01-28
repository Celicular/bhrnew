import { motion } from "motion/react";
import { Heart, ChevronUp, ChevronDown, Star, MapPin } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export function BookingSidebar({
  property,
  hostData,
  selectedDates,
  guestCount,
  onDatesClick,
  onGuestChange,
  onReserveClick,
  onOpenHostModal,
  isSaved,
  onSaveClick,
}) {
  const { symbol, convertPrice } = useCurrency();

  const nights =
    selectedDates.start && selectedDates.end
      ? Math.ceil(
          (new Date(selectedDates.end) - new Date(selectedDates.start)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const convertedPrice = convertPrice(property.base_price);
  const totalPrice = convertedPrice * nights;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block sticky top-28 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-6 space-y-6 h-fit"
    >
      {/* Price Display */}
      <div>
        <p className="text-sm text-dusty-sky-blue dark:text-slate-300 mb-1">
          Price per night
        </p>
        <p className="text-4xl font-serif text-midnight-navy dark:text-white">
          {symbol}
          {Math.round(convertedPrice)}
          <span className="text-lg text-dusty-sky-blue dark:text-slate-300 font-normal">
            /night
          </span>
        </p>
      </div>

      {/* Date Inputs */}
      <div className="space-y-3">
        <button
          onClick={() => onDatesClick("checkin")}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-left hover:border-champagne-gold transition-colors"
        >
          <p className="text-xs text-dusty-sky-blue dark:text-slate-400">
            Check-in
          </p>
          <p className="font-medium text-midnight-navy dark:text-white">
            {selectedDates.start
              ? new Date(selectedDates.start).toLocaleDateString()
              : "Add date"}
          </p>
        </button>

        <button
          onClick={() => onDatesClick("checkout")}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-left hover:border-champagne-gold transition-colors"
        >
          <p className="text-xs text-dusty-sky-blue dark:text-slate-400">
            Check-out
          </p>
          <p className="font-medium text-midnight-navy dark:text-white">
            {selectedDates.end
              ? new Date(selectedDates.end).toLocaleDateString()
              : "Add date"}
          </p>
        </button>
      </div>

      {/* Guest Counter */}
      <div>
        <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mb-3">
          Guests
        </p>
        <div className="flex items-center justify-between bg-warm-ivory dark:bg-slate-700 p-3 rounded-lg">
          <span className="font-medium text-midnight-navy dark:text-white">
            {guestCount} guest{guestCount > 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onGuestChange("decrease")}
              disabled={guestCount <= 1}
              className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-5 h-5 text-midnight-navy dark:text-white" />
            </button>
            <button
              onClick={() => onGuestChange("increase")}
              disabled={guestCount >= property.guests_max}
              className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-5 h-5 text-midnight-navy dark:text-white" />
            </button>
          </div>
        </div>
        <p className="text-xs text-dusty-sky-blue dark:text-slate-400 mt-2">
          Maximum {property.guests_max} guests
        </p>
      </div>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="bg-warm-ivory dark:bg-slate-700 p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-slate-400">
              {symbol}
              {Math.round(convertedPrice)} × {nights} night
              {nights > 1 ? "s" : ""}
            </span>
            <span className="font-medium text-midnight-navy dark:text-white">
              {symbol}
              {Math.round(convertedPrice * nights)}
            </span>
          </div>
          <div className="border-t border-gray-300 dark:border-slate-600 pt-2">
            <div className="flex justify-between">
              <span className="font-serif text-midnight-navy dark:text-white">
                Total
              </span>
              <span className="font-serif text-lg text-champagne-gold">
                {symbol}
                {Math.round(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onReserveClick}
          className="w-full bg-midnight-navy dark:bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-charcoal-blue dark:hover:bg-slate-600 transition-colors"
        >
          Reserve
        </button>

        <button
          onClick={onSaveClick}
          className={`w-full py-3 rounded-lg font-medium border-2 transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
              : "border-slate-200 dark:border-slate-600 text-midnight-navy dark:text-white hover:border-champagne-gold dark:hover:border-champagne-gold hover:text-champagne-gold"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${isSaved ? "fill-current" : ""}`}
          />
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Host Info */}
      {hostData && (
        <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
          <h3 className="text-sm font-semibold text-midnight-navy dark:text-white mb-3">
            Hosted by
          </h3>
          <div className="flex items-start gap-3">
            <img
              src={
                hostData.profile_image
                  ? (() => {
                      const imagePath = hostData.profile_image;
                      if (
                        imagePath.startsWith("http://") ||
                        imagePath.startsWith("https://")
                      ) {
                        return imagePath;
                      }
                      return `https://bookholidayrental.com/${imagePath}`;
                    })()
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostData.full_name || "Host"}`
              }
              alt={hostData.full_name || "Host"}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostData.full_name || "Host"}`;
              }}
            />
            <div className="flex-1">
              <p className="font-medium text-midnight-navy mb-1">
                {hostData.full_name || "Unknown Host"}
              </p>
              {hostData.email && hostData.show_email === 1 && (
                <p className="text-xs text-dusty-sky-blue mb-1">
                  {hostData.email}
                </p>
              )}
              {hostData.average_rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-champagne-gold text-champagne-gold" />
                  <span className="text-sm text-dusty-sky-blue">
                    {hostData.average_rating.toFixed(1)}
                  </span>
                </div>
              )}
              <button
                onClick={onOpenHostModal}
                className="text-sm text-champagne-gold hover:text-accent font-medium transition-colors"
              >
                View Host Profile →
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Mobile Floating Button
export function BookingSidebarMobile({
  property,
  hostData,
  selectedDates,
  guestCount,
  onReserveClick,
  onOpenHostModal,
  isSaved,
  onSaveClick,
}) {
  const { symbol, convertPrice } = useCurrency();

  const nights =
    selectedDates.start && selectedDates.end
      ? Math.ceil(
          (new Date(selectedDates.end) - new Date(selectedDates.start)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const convertedPrice = convertPrice(property.base_price);
  const totalPrice = convertedPrice * nights;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4 safe-area-inset-bottom z-40"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-dusty-sky-blue dark:text-slate-400">
            {symbol}
            {Math.round(convertedPrice)}/night
          </p>
          {nights > 0 && (
            <p className="font-serif text-lg text-midnight-navy">
              {symbol}
              {Math.round(totalPrice)} total
            </p>
          )}
        </div>
        <button
          onClick={onReserveClick}
          className="px-6 py-3 bg-midnight-navy text-white rounded-lg font-medium hover:bg-charcoal-blue transition-colors whitespace-nowrap"
        >
          Reserve
        </button>
      </div>
    </motion.div>
  );
}
