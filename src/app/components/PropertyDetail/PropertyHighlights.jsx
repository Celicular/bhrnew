import { motion } from "motion/react";
import { decodeHtmlEntities } from "@/utils/htmlDecoder";

export function PropertyHighlights({ highlights }) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-champagne-gold/5 to-transparent rounded-xl px-6 md:px-8"
      id="highlights"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Why Guests Love This Place
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{
              y: -4,
              boxShadow: "0 12px 24px rgba(212, 175, 55, 0.15)",
            }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 md:p-8 bg-gradient-to-br from-white to-warm-ivory/20 rounded-2xl border border-champagne-gold/20 hover:border-champagne-gold/40 transition-all"
          >
            {highlight.icon && (
              <div className="text-4xl mb-4">{highlight.icon}</div>
            )}
            <h3 className="text-lg font-serif text-midnight-navy mb-2">
              {decodeHtmlEntities(highlight.title)}
            </h3>
            <p className="text-[color:var(--gray-600)] text-sm leading-relaxed">
              {decodeHtmlEntities(highlight.description)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
