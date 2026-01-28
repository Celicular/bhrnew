import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/utils/client";

export function OTPVerificationModal({ isOpen, onClose, onVerified }) {
  const { theme } = useTheme();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain only numbers");
      return;
    }

    setIsLoading(true);

    try {
      const user_id = sessionStorage.getItem("user_id");
      const response = await api.verifyOtp(user_id, otp, true);

      if (response.data && response.data.success) {
        // Pass response data to parent so it can handle requires_details
        onVerified(response.data);
      } else {
        setError(response.data?.message || "Invalid OTP. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Verification failed. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendTimer(60);

    try {
      const user_id = sessionStorage.getItem("user_id");
      const response = await api.resendOtp(user_id);

      if (!response.data?.success) {
        setError(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl p-8 space-y-6 ${
              theme === "dark"
                ? "bg-charcoal-blue border border-dusty-sky-blue/20"
                : "bg-white border border-soft-stone-gray/20"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-midnight-navy dark:text-white">
                  Verify Your Email
                </h2>
                <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue mt-1">
                  We sent a 6-digit code to your email
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-soft-stone-gray dark:text-dusty-sky-blue" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              {/* OTP Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength="6"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white text-center text-2xl tracking-widest placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50 font-mono"
                />
                <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue text-center">
                  {otp.length}/6 digits
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                type="submit"
                disabled={isLoading || otp.length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </form>

            {/* Resend Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={isLoading || resendTimer > 0}
                className="text-champagne-gold hover:text-champagne-gold/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
