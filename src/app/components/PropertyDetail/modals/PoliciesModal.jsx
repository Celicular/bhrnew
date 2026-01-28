import { motion } from "motion/react";
import { X, CreditCard, RotateCcw, FileText } from "lucide-react";

export function PoliciesModal({ isOpen, onClose, policies, customPolicies }) {
  if (!isOpen) return null;

  const hasPaymentPolicy =
    policies?.payment_policy_custom === 1 && policies?.payment_policy;
  const hasRefundPolicy =
    policies?.refund_policy_custom === 1 && policies?.refund_policy;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[color:var(--blue-50)] dark:from-slate-700 to-[color:var(--accent-primary-50)] dark:to-slate-700 px-6 md:px-8 py-6 border-b border-[color:var(--gray-200)]/50 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-midnight-navy dark:text-white">
              All Policies
            </h2>
            <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mt-1">
              Complete policy information for this property
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 dark:bg-slate-800">
          {/* Payment Policy */}
          {hasPaymentPolicy && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-6 bg-gradient-to-br from-[color:var(--blue-50)]/50 dark:from-slate-700/30 to-[color:var(--blue-50)]/20 dark:to-slate-700/20 rounded-xl border border-[color:var(--blue-200)]/50 dark:border-slate-700"
            >
              <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-champagne-gold" />
                Payment Policy
              </h3>
              <p className="text-dusty-sky-blue dark:text-slate-300 leading-relaxed">
                {policies.payment_policy}
              </p>
            </motion.div>
          )}

          {/* Refund Policy */}
          {hasRefundPolicy && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-[color:var(--blue-50)]/50 dark:from-slate-700/30 to-[color:var(--blue-50)]/20 dark:to-slate-700/20 rounded-xl border border-[color:var(--blue-200)]/50 dark:border-slate-700"
            >
              <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-champagne-gold" />
                Refund Policy
              </h3>
              <p className="text-dusty-sky-blue dark:text-slate-300 leading-relaxed">
                {policies.refund_policy}
              </p>
            </motion.div>
          )}

          {/* Custom Policies */}
          {customPolicies && customPolicies.length > 0 && (
            <>
              <div className="pt-4 border-t border-gray-200/50 dark:border-slate-700">
                <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-champagne-gold" />
                  Additional Policies
                </h3>
              </div>

              <div className="space-y-4">
                {customPolicies.map((policy, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    className="p-6 bg-gradient-to-br from-[color:var(--accent-tertiary-50)]/50 dark:from-slate-700/30 to-[color:var(--accent-tertiary-50)]/20 dark:to-slate-700/20 rounded-xl border border-[color:var(--accent-tertiary-200)]/50 dark:border-slate-700"
                  >
                    <h4 className="text-base font-serif text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-champagne-gold" />
                      {policy.title}
                    </h4>
                    <p className="text-dusty-sky-blue dark:text-slate-300 leading-relaxed">
                      {policy.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-[color:var(--blue-50)]/50 dark:from-slate-700/50 to-[color:var(--accent-primary-50)]/50 dark:to-slate-700/50 px-6 md:px-8 py-4 border-t border-[color:var(--gray-200)]/50 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-midnight-navy dark:bg-slate-700 text-white rounded-lg hover:bg-midnight-navy/90 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
