import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function RulesModal({ isOpen, onClose, rules }) {
  if (!rules || !Array.isArray(rules) || rules.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-serif text-midnight-navy dark:text-white">
                All House Rules
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-midnight-navy dark:text-slate-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 dark:bg-slate-800">
              {rules.map((rule, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-warm-ivory dark:bg-slate-700 rounded-xl border-l-4 border-l-champagne-gold hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-champagne-gold text-midnight-navy dark:text-charcoal-blue rounded-full text-sm font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-dusty-sky-blue dark:text-slate-300 leading-relaxed flex-1">
                      {rule}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
