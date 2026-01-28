import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, MapPin, Globe, Hash } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/client";

export function GuestDetailsModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { syncLocalWishlists } = useWishlist();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone || !address || !city || !pinCode || !country) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.completeRegistration({
        phone,
        address,
        city,
        pin_code: pinCode,
        country,
        bio: bio || null,
      });

      if (response.data && response.data.success) {
        // Get data from sessionStorage
        const user_id = sessionStorage.getItem("user_id");
        const role = sessionStorage.getItem("signup_role");
        const email =
          sessionStorage.getItem("signup_email") || "user@example.com";
        const fullName = sessionStorage.getItem("signup_fullName") || "User";

        // Save to localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user_id,
            role: "guest",
            logged_in: true,
            timestamp: Date.now(),
          }),
        );

        // Update auth context
        login("guest", {
          email,
          name: fullName,
          user_id,
          role: "guest",
        });

        // Sync local wishlists to database
        await syncLocalWishlists();

        // Clear sessionStorage
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("signup_role");
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_fullName");

        // Redirect to home
        navigate("/");
      } else {
        setError(
          response.data?.message || "Registration failed. Please try again.",
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Completion error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
      );
      setIsLoading(false);
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
            className={`w-full max-w-md rounded-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-charcoal-blue border border-dusty-sky-blue/20"
                : "bg-white border border-soft-stone-gray/20"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between sticky top-0">
              <div>
                <h2 className="text-2xl font-bold text-midnight-navy dark:text-white">
                  Complete Your Profile
                </h2>
                <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue mt-1">
                  Just a few more details
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 rounded-lg transition-colors flex-shrink-0"
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
                  />
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
                  />
                </div>
              </motion.div>

              {/* City */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City name"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
                />
              </motion.div>

              {/* Pin Code */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  Pin Code *
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="12345"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
                  />
                </div>
              </motion.div>

              {/* Country */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  Country *
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country name"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
                  />
                </div>
              </motion.div>

              {/* Bio (Optional) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  Bio (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  disabled={isLoading}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50 resize-none"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading
                  ? "Completing Registration..."
                  : "Complete Registration"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
