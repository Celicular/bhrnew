import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function PropertyFAQs({ faqs }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const visibleFAQs = faqs.slice(0, 5); // Show first 5, rest can be in modal

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--accent-tertiary-50)]/20 to-transparent rounded-xl px-6 md:px-8"
      id="faqs"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {visibleFAQs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="border border-[color:var(--gray-200)]/50 rounded-xl overflow-hidden hover:border-champagne-gold/60 transition-colors bg-gradient-to-br from-white to-[color:var(--accent-tertiary-50)]/10 hover:bg-gradient-to-br hover:from-white hover:to-[color:var(--accent-tertiary-50)]/20 dark:bg-gradient-to-br dark:from-white/10 dark:to-black/40 dark:hover:from-white/20 dark:hover:to-black/60"
          >
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
              className="w-full px-6 py-4 flex items-start gap-4 hover:bg-warm-ivory transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
              <span className="text-left flex-1 font-serif text-midnight-navy font-semibold">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: expandedIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-dusty-sky-blue" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-[color:var(--gray-100)]"
                >
                  <div className="px-6 py-4 bg-warm-ivory/30 text-dusty-sky-blue leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {faqs.length > 5 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 border-2 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-midnight-navy transition-all duration-300 rounded-xl font-medium">
            View All FAQs ({faqs.length})
          </button>
        </div>
      )}
    </motion.section>
  );
}
