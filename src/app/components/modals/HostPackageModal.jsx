import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/client";

const PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    price: "$0",
    period: "Forever Free",
    description: "Perfect for hosts getting started",
    features: [
      "List up to 1 property",
      "Basic property information",
      "Standard booking management",
      "Email support",
      "Monthly insights",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    period: "Per Month",
    description: "For professional hosting businesses",
    features: [
      "Unlimited property listings",
      "Advanced analytics & insights",
      "Priority customer support",
      "Marketing tools & promotions",
      "Professional verification badge",
      "Featured listings",
      "Co-hosting support",
    ],
    popular: true,
  },
];

export function HostPackageModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { syncLocalWishlists } = useWishlist();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user_id = sessionStorage.getItem("user_id");
      const response = await api.completeRegistration({
        host_id: user_id, // Convert user_id to host_id
        package_type: selectedPackage, // "basic" or "premium"
        is_paid: 0, // Pay later
        payment_method: "pay_later",
      });

      if (response.data && response.data.success) {
        // Get data from sessionStorage
        const user_id = sessionStorage.getItem("user_id");
        const email =
          sessionStorage.getItem("signup_email") || "host@example.com";
        const fullName = sessionStorage.getItem("signup_fullName") || "Host";
        const packageType = response.data.data?.package_type || selectedPackage;

        // Save to localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user_id,
            role: "host",
            package: packageType,
            logged_in: true,
            timestamp: Date.now(),
          }),
        );

        // Update auth context
        login("host", {
          email,
          name: fullName,
          user_id,
          role: "host",
          package: packageType,
        });

        // Sync local wishlists to database
        await syncLocalWishlists();

        // Clear sessionStorage
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("signup_role");
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_fullName");
        sessionStorage.removeItem("selected_package");

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
            className={`w-full max-w-2xl rounded-2xl p-8 space-y-8 max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-charcoal-blue border border-dusty-sky-blue/20"
                : "bg-white border border-soft-stone-gray/20"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between sticky top-0">
              <div>
                <h2 className="text-2xl font-bold text-midnight-navy dark:text-white">
                  Choose Your Hosting Package
                </h2>
                <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue mt-1">
                  Select the plan that works best for you
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

            {/* Packages Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {PACKAGES.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? "border-champagne-gold bg-champagne-gold/5 dark:bg-champagne-gold/10"
                      : `border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 ${
                          theme === "dark"
                            ? "hover:bg-dusty-sky-blue/5"
                            : "hover:bg-warm-ivory"
                        }`
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block px-3 py-1 rounded-full bg-champagne-gold text-midnight-navy text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="space-y-3 mb-6 pt-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-midnight-navy dark:text-white">
                        {pkg.name}
                      </h3>
                      {selectedPackage === pkg.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-champagne-gold flex items-center justify-center flex-shrink-0"
                        >
                          <Check className="w-4 h-4 text-midnight-navy" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-champagne-gold">
                        {pkg.price}
                      </div>
                      <div className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue">
                        {pkg.period}
                      </div>
                    </div>
                    <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 text-sm text-midnight-navy dark:text-dusty-sky-blue"
                      >
                        <Zap className="w-4 h-4 text-champagne-gold flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 pt-4"
            >
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading
                  ? "Processing..."
                  : `Continue with ${selectedPackage === "basic" ? "Basic" : "Premium"}`}
              </button>
              <p className="text-xs text-center text-soft-stone-gray dark:text-dusty-sky-blue">
                You can change your plan anytime from your dashboard
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
