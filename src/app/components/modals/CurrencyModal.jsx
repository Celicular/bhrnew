import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Globe, DollarSign } from "lucide-react";
import { UNIQUE_COUNTRIES, COUNTRIES_CURRENCIES } from "@/utils/currencyData";
import { useCurrency } from "@/context/CurrencyContext";

export function CurrencyModal({ isOpen, onClose }) {
  const { country, setCountry, currency, setCurrency } = useCurrency();
  const [tempCountry, setTempCountry] = useState(country);
  const [tempCurrency, setTempCurrency] = useState(currency);
  const [countrySearch, setCountrySearch] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");

  // Get all unique currencies from the data
  const allCurrencies = (() => {
    const seen = new Set();
    return COUNTRIES_CURRENCIES.filter((item) => {
      if (seen.has(item.currency)) return false;
      seen.add(item.currency);
      return true;
    }).sort((a, b) => a.currency.localeCompare(b.currency));
  })();

  // Handle country change
  const handleCountryChange = (newCountry) => {
    setTempCountry(newCountry);
    setCountrySearch("");

    // Auto-select the first available currency for this country
    const firstCurrency = COUNTRIES_CURRENCIES.find(
      (item) => item.country === newCountry,
    )?.currency;
    if (firstCurrency) {
      setTempCurrency(firstCurrency);
      setCurrencySearch("");
    }
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency) => {
    setTempCurrency(newCurrency);
    setCurrencySearch("");
  };

  // Apply changes and close
  const handleApply = () => {
    setCountry(tempCountry);
    setCurrency(tempCurrency);
    onClose();
  };

  // Filter countries
  const filteredCountries = UNIQUE_COUNTRIES.filter((item) =>
    item.country.toLowerCase().includes(countrySearch.toLowerCase()),
  ).sort((a, b) => {
    // Put selected country at top
    if (a.country === tempCountry) return -1;
    if (b.country === tempCountry) return 1;
    return 0;
  });

  // Filter currencies - show ALL currencies, not just for selected country
  const filteredCurrencies = allCurrencies
    .filter(
      (item) =>
        item.currency.toLowerCase().includes(currencySearch.toLowerCase()) ||
        item.symbol.toLowerCase().includes(currencySearch.toLowerCase()),
    )
    .sort((a, b) => {
      // Put selected currency at top
      if (a.currency === tempCurrency) return -1;
      if (b.currency === tempCurrency) return 1;
      return 0;
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4 py-4 md:py-0"
          >
            <div className="w-full max-w-2xl max-h-[90vh] md:max-h-none bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative h-24 md:h-32 bg-gradient-to-r from-midnight-navy dark:from-slate-700 via-deep-navy dark:via-slate-700 to-midnight-navy dark:to-slate-700 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-champagne-gold/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-champagne-gold/5 rounded-full blur-2xl" />
                </div>

                {/* Title */}
                <div className="relative z-10">
                  <h2 className="text-xl md:text-3xl font-serif font-light text-white flex items-center gap-2 md:gap-3">
                    <Globe className="w-5 md:w-8 h-5 md:h-8 text-champagne-gold" />
                    Currency & Location
                  </h2>
                  <p className="hidden md:block text-warm-ivory/70 text-sm mt-1">
                    Select your country and preferred currency
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="relative z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-8 flex-1 overflow-y-auto dark:bg-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* Country Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-midnight-navy dark:text-white uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-soft-beige dark:border-slate-600 bg-bone-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder:text-midnight-navy/40 dark:placeholder:text-white/40 focus:outline-none focus:border-champagne-gold focus:ring-2 focus:ring-[var(--champagne-gold)]/20 transition-all duration-300"
                      />
                    </div>

                    {/* Country List */}
                    <div className="space-y-2 h-40 md:h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCountries.map((item) => (
                        <button
                          key={item.country}
                          onClick={() => handleCountryChange(item.country)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                            tempCountry === item.country
                              ? "bg-champagne-gold dark:bg-champagne-gold text-white dark:text-charcoal-blue font-medium shadow-lg shadow-champagne-gold/30"
                              : "bg-warm-ivory dark:bg-slate-700 text-midnight-navy dark:text-slate-300 hover:bg-warm-taupe dark:hover:bg-slate-600 border border-soft-beige dark:border-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.country}</span>
                            <span className="text-xs opacity-70">
                              {item.code}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-midnight-navy dark:text-white uppercase tracking-wider">
                        Currency
                      </label>
                      <input
                        type="text"
                        placeholder="Search currencies..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-soft-beige dark:border-slate-600 bg-bone-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder:text-midnight-navy/40 dark:placeholder:text-white/40 focus:outline-none focus:border-champagne-gold focus:ring-2 focus:ring-[var(--champagne-gold)]/20 transition-all duration-300"
                      />
                    </div>

                    {/* Currency List */}
                    <div className="space-y-2 h-40 md:h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((item) => (
                          <button
                            key={item.currency}
                            onClick={() => handleCurrencyChange(item.currency)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                              tempCurrency === item.currency
                                ? "bg-champagne-gold dark:bg-champagne-gold text-white dark:text-charcoal-blue font-medium shadow-lg shadow-champagne-gold/30"
                                : "bg-warm-ivory dark:bg-slate-700 text-midnight-navy dark:text-slate-300 hover:bg-warm-taupe dark:hover:bg-slate-600 border border-soft-beige dark:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span>{item.currency}</span>
                              </div>
                              <span className="text-sm opacity-70">
                                {item.symbol}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-midnight-navy/50 dark:text-white/50">
                          <p>No currencies found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Selection Summary */}
                <div className="mt-4 md:mt-8 p-3 md:p-4 rounded-xl bg-gradient-to-r from-[var(--bone-white)] dark:from-slate-700 to-warm-taupe dark:to-slate-700 border border-champagne-gold/20 dark:border-slate-600">
                  <p className="text-xs md:text-sm text-midnight-navy dark:text-white">
                    <span className="font-medium">Selected:</span>{" "}
                    <span className="text-champagne-gold">{tempCountry}</span> •{" "}
                    <span className="text-champagne-gold">{tempCurrency}</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-bone-white dark:bg-slate-800 border-t border-soft-beige dark:border-slate-700">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl border border-champagne-gold text-champagne-gold dark:text-champagne-gold hover:bg-champagne-gold/5 dark:hover:bg-champagne-gold/10 transition-all duration-300 font-medium text-xs md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl bg-champagne-gold dark:bg-champagne-gold text-midnight-navy dark:text-charcoal-blue hover:bg-burnished-gold dark:hover:bg-burnished-gold shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-xs md:text-base"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </motion.div>

          {/* Custom Scrollbar Styles */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: var(--champagne-gold);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: var(--burnished-gold);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
