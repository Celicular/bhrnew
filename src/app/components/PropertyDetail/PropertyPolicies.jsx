import { motion } from "motion/react";
import { CreditCard, RotateCcw, ArrowRight, FileText } from "lucide-react";
import { useState } from "react";
import {
  formatPaymentPolicy,
  formatRefundPolicy,
} from "@/utils/policyMessages";
import { PoliciesModal } from "@/app/components/PropertyDetail/modals/PoliciesModal";

export function PropertyPolicies({ policies }) {
  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);

  if (!policies) return null;

  // Check if policies are enabled (custom flag must be 1)
  const hasPaymentPolicy =
    policies.payment_policy_custom === 1 && policies.payment_policy;
  const hasRefundPolicy =
    policies.refund_policy_custom === 1 && policies.refund_policy;
  const customPolicies = policies.custom_policies || [];
  const hasAnyPolicy =
    hasPaymentPolicy || hasRefundPolicy || customPolicies.length > 0;

  if (!hasAnyPolicy) return null;

  const paymentPolicy = hasPaymentPolicy
    ? formatPaymentPolicy(policies.payment_policy)
    : null;
  const refundPolicy = hasRefundPolicy
    ? formatRefundPolicy(policies.refund_policy)
    : null;

  // If no payment/refund policies but custom policies exist, show first custom policy
  const showFirstCustomPolicy =
    !hasPaymentPolicy && !hasRefundPolicy && customPolicies.length > 0;
  const firstCustomPolicy = showFirstCustomPolicy ? customPolicies[0] : null;
  const remainingCustomPolicies = showFirstCustomPolicy
    ? customPolicies.slice(1)
    : customPolicies;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-[color:var(--gray-200)]/50 bg-gradient-to-br from-[color:var(--accent-policy-50)]/20 to-transparent rounded-xl px-6 md:px-8"
      id="policies"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-8">
        Policies
      </h2>

      <div className="space-y-6">
        {/* Payment Policy */}
        {paymentPolicy && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true }}
            className="p-6 bg-gradient-to-br from-[color:var(--accent-policy-50)]/50 to-[color:var(--accent-policy-50)]/20 rounded-xl border border-[color:var(--accent-policy-200)]/50 hover:border-[color:var(--accent-policy-300)]/70 transition-all hover:shadow-md"
          >
            <h3 className="text-lg font-serif text-midnight-navy mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-champagne-gold" />
              Payment Policy
            </h3>
            <p className="text-dusty-sky-blue leading-relaxed">
              {paymentPolicy}
            </p>
          </motion.div>
        )}

        {/* Refund Policy */}
        {refundPolicy && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gradient-to-br from-[color:var(--accent-policy-50)]/50 to-[color:var(--accent-policy-50)]/20 rounded-xl border border-[color:var(--accent-policy-200)]/50 hover:border-[color:var(--accent-policy-300)]/70 transition-all hover:shadow-md"
          >
            <h3 className="text-lg font-serif text-midnight-navy mb-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-champagne-gold" />
              Refund Policy
            </h3>
            <p className="text-dusty-sky-blue leading-relaxed">
              {refundPolicy}
            </p>
          </motion.div>
        )}

        {/* First Custom Policy (shown if no payment/refund policies) */}
        {firstCustomPolicy && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true }}
            transition={{ delay: paymentPolicy || refundPolicy ? 0.1 : 0 }}
            className="p-6 bg-gradient-to-br from-[color:var(--accent-policy-50)]/50 to-[color:var(--accent-policy-50)]/20 rounded-xl border border-[color:var(--accent-policy-200)]/50 hover:border-[color:var(--accent-policy-300)]/70 transition-all hover:shadow-md"
          >
            <h3 className="text-lg font-serif text-midnight-navy mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-champagne-gold" />
              {firstCustomPolicy.title || "Policy"}
            </h3>
            <p className="text-dusty-sky-blue leading-relaxed">
              {firstCustomPolicy.description}
            </p>
          </motion.div>
        )}
      </div>

      {/* View More/All Policies Button */}
      {(remainingCustomPolicies.length > 0 ||
        (paymentPolicy && !showFirstCustomPolicy) ||
        (refundPolicy && !showFirstCustomPolicy)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 pt-6 border-t border-[color:var(--gray-200)]/50"
        >
          <button
            onClick={() => setIsPoliciesModalOpen(true)}
            className="w-full px-6 py-3 bg-gradient-to-r from-champagne-gold/10 to-champagne-gold/5 hover:from-champagne-gold/15 hover:to-champagne-gold/10 border-2 border-champagne-gold/50 hover:border-champagne-gold/70 rounded-lg text-midnight-navy font-medium transition-all flex items-center justify-center gap-2 group"
          >
            <span>
              {showFirstCustomPolicy
                ? "View More Policies"
                : "View All Policies"}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* Policies Modal */}
      <PoliciesModal
        isOpen={isPoliciesModalOpen}
        onClose={() => setIsPoliciesModalOpen(false)}
        policies={policies}
        customPolicies={remainingCustomPolicies}
      />
    </motion.section>
  );
}
