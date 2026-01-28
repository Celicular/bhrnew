import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Plus, Minus, X } from "lucide-react";

export function GuestsModal({ isOpen, onClose, onSelectGuests }) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedGuests");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setAdults(data.adults || 1);
        setChildren(data.children || 0);
        setPets(data.pets || 0);
      } catch (error) {
        console.error("Error parsing stored guests:", error);
      }
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const guestData = { adults, children, pets };
    localStorage.setItem("selectedGuests", JSON.stringify(guestData));
    if (onSelectGuests) {
      onSelectGuests(guestData);
    }
    onClose();
  };

  const Counter = ({
    label,
    count,
    onIncrement,
    onDecrement,
    maxCount = 10,
  }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
      <span className="font-medium text-midnight-navy dark:text-white">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={onDecrement}
          disabled={count === 0}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4 text-midnight-navy dark:text-white" />
        </button>
        <span className="w-8 text-center font-semibold text-midnight-navy dark:text-white">
          {count}
        </span>
        <button
          onClick={onIncrement}
          disabled={count === maxCount}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 text-midnight-navy dark:text-white" />
        </button>
      </div>
    </div>
  );

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
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-32 px-4 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto">
              {/* Modal Container */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 overflow-hidden border border-gray-200 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-champagne-gold/20 dark:bg-champagne-gold/10 rounded-full">
                      <Users className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif text-midnight-navy dark:text-white">
                        Who's coming?
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Add guests and pets
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-midnight-navy dark:text-slate-400" />
                  </button>
                </div>

                {/* Counters */}
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  <Counter
                    label="Adults (18+)"
                    count={adults}
                    onIncrement={() => setAdults(Math.min(adults + 1, 16))}
                    onDecrement={() => setAdults(Math.max(adults - 1, 1))}
                    maxCount={16}
                  />
                  <Counter
                    label="Children (0-17)"
                    count={children}
                    onIncrement={() => setChildren(Math.min(children + 1, 10))}
                    onDecrement={() => setChildren(Math.max(children - 1, 0))}
                    maxCount={10}
                  />
                  <Counter
                    label="Pets"
                    count={pets}
                    onIncrement={() => setPets(Math.min(pets + 1, 10))}
                    onDecrement={() => setPets(Math.max(pets - 1, 0))}
                    maxCount={10}
                  />
                </div>

                {/* Summary */}
                <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {adults + children} guest
                    {adults + children !== 1 ? "s" : ""}
                    {pets > 0 && ` • ${pets} pet${pets !== 1 ? "s" : ""}`}
                  </p>
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3 bg-midnight-navy dark:bg-slate-700 text-white hover:bg-charcoal-blue dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
