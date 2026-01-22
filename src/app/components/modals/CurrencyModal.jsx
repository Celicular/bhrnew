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
      (item) => item.country === newCountry
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
    item.country.toLowerCase().includes(countrySearch.toLowerCase())
  ).sort((a, b) => {
    // Put selected country at top
    if (a.country === tempCountry) return -1;
    if (b.country === tempCountry) return 1;
    return 0;
  });

  // Filter currencies - show ALL currencies, not just for selected country
  const filteredCurrencies = allCurrencies.filter(
    (item) =>
      item.currency.toLowerCase().includes(currencySearch.toLowerCase()) ||
      item.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  ).sort((a, b) => {
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
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#1a1f2e] via-[#2a3f5f] to-[#1a1f2e] px-8 py-6 flex items-center justify-between">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl" />
                </div>

                {/* Title */}
                <div className="relative z-10">
                  <h2 className="text-3xl font-serif font-light text-white flex items-center gap-3">
                    <Globe className="w-8 h-8 text-[#d4af37]" />
                    Currency & Location
                  </h2>
                  <p className="text-[#f8f6f3]/70 text-sm mt-1">
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
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Country Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1a1f2e] uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-[#faf8f5] text-[#1a1f2e] placeholder:text-[#1a1f2e]/40 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
                      />
                    </div>

                    {/* Country List */}
                    <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCountries.map((item) => (
                        <button
                          key={item.country}
                          onClick={() => handleCountryChange(item.country)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                            tempCountry === item.country
                              ? "bg-[#d4af37] text-white font-medium shadow-lg shadow-[#d4af37]/30"
                              : "bg-[#f8f6f3] text-[#1a1f2e] hover:bg-[#f0ece3] border border-[#e0dbd3]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.country}</span>
                            <span className="text-xs opacity-70">{item.code}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1a1f2e] uppercase tracking-wider">
                        Currency
                      </label>
                      <input
                        type="text"
                        placeholder="Search currencies..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-[#faf8f5] text-[#1a1f2e] placeholder:text-[#1a1f2e]/40 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
                      />
                    </div>

                    {/* Currency List */}
                    <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((item) => (
                          <button
                            key={item.currency}
                            onClick={() => handleCurrencyChange(item.currency)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                              tempCurrency === item.currency
                                ? "bg-[#d4af37] text-white font-medium shadow-lg shadow-[#d4af37]/30"
                                : "bg-[#f8f6f3] text-[#1a1f2e] hover:bg-[#f0ece3] border border-[#e0dbd3]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span>{item.currency}</span>
                              </div>
                              <span className="text-sm opacity-70">{item.symbol}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#1a1f2e]/50">
                          <p>No currencies found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Selection Summary */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#faf8f5] to-[#f0ece3] border border-[#d4af37]/20">
                  <p className="text-sm text-[#1a1f2e]">
                    <span className="font-medium">Selected:</span>{" "}
                    <span className="text-[#d4af37]">{tempCountry}</span> •{" "}
                    <span className="text-[#d4af37]">{tempCurrency}</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-8 py-4 bg-[#faf8f5] border-t border-[#e0dbd3]">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#d4af37] text-[#1a1f2e] hover:bg-[#c9a532] shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
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
              background: #d4af37;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #c9a532;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
