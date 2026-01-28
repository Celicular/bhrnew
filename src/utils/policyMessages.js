/**
 * Policy Messages Utility
 * Provides consistent, user-friendly messages for different policy types
 */

export const policyTypeMessages = {
  // Cancellation Policy Types - 4 states
  flexible: {
    label: "Flexible",
    description: "Free cancellation up to 1 day before check-in",
    color: "emerald",
  },
  moderate: {
    label: "Moderate",
    description: "Free cancellation up to 7 days before check-in",
    color: "amber",
  },
  strict: {
    label: "Strict",
    description: "Free cancellation up to 30 days before check-in",
    color: "rose",
  },
  "non-refundable": {
    label: "Non-Refundable",
    description: "No refunds after booking confirmed",
    color: "rose",
  },
};

/**
 * Get policy message by type
 * @param {string} type - Policy type (flexible, moderate, strict, non-refundable)
 * @returns {object} Policy message object with label, description, and color
 */
export function getPolicyMessage(type) {
  if (!type) return null;

  const normalizedType = type.toLowerCase().replace(/[-_\s]/g, "");
  const key = Object.keys(policyTypeMessages).find(
    (k) => k.toLowerCase().replace(/[-_\s]/g, "") === normalizedType,
  );

  return key ? policyTypeMessages[key] : null;
}

/**
 * Format payment policy message
 * @param {string} policy - Raw payment policy text
 * @returns {string} Formatted payment policy message
 */
export function formatPaymentPolicy(policy) {
  if (!policy) return null;

  // If it's already a custom policy, return as is
  if (typeof policy === "string") {
    return policy;
  }

  return policy;
}

/**
 * Format refund policy message
 * @param {string} policy - Raw refund policy text
 * @returns {string} Formatted refund policy message
 */
export function formatRefundPolicy(policy) {
  if (!policy) return null;

  // Check if it's "Non-refundable" or "Not refundable" and provide better message
  if (
    policy.toLowerCase().includes("non-refundable") ||
    policy.toLowerCase().includes("not refundable")
  ) {
    return "This booking is non-refundable. Please review the cancellation policy carefully before completing your booking.";
  }

  // If it's a basic policy text, enhance it
  if (policy.toLowerCase() === "refundable") {
    return "Full refund available if cancelled before the specified cancellation deadline.";
  }

  return policy;
}

/**
 * Get cancellation policy description with type
 * @param {string|object} cancellation - Cancellation policy type string or object with type and description
 * @returns {object|null} Enhanced cancellation policy object or null
 */
export function getCancellationPolicyInfo(cancellation) {
  if (!cancellation) return null;

  // Handle string type (just the policy type name)
  let policyType = cancellation;
  let customDescription = null;

  if (typeof cancellation === "object" && cancellation.type) {
    policyType = cancellation.type;
    customDescription = cancellation.description;
  }

  const policyInfo = getPolicyMessage(policyType);

  if (!policyInfo) return null;

  return {
    type: policyType,
    label: policyInfo.label,
    description: customDescription || policyInfo.description,
    color: policyInfo.color,
  };
}
