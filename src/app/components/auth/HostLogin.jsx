import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { api } from "@/utils/client";

export function HostLogin({
  onSwitchToRegister,
  onVerificationRequired = () => {},
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.login(email, password, "host");

      // Validate response
      if (response.data && response.data.success) {
        const { user_id, role, full_name } = response.data;

        // Verify role matches
        if (role === "host") {
          // Check if profile details are complete
          if (response.data.requires_details) {
            // Store data and show details modal instead of logging in
            sessionStorage.setItem("user_id", user_id);
            sessionStorage.setItem("signup_email", email);
            sessionStorage.setItem("signup_fullName", full_name);
            sessionStorage.setItem("signup_role", "host");

            // Trigger OTP modal for verification (they need to complete profile)
            onVerificationRequired(user_id);
          } else {
            // Login successful
            login("host", { email, name: full_name, user_id, role });
            alert(`Welcome back, ${full_name}!`);
            navigate("/host-dashboard");
          }
        } else {
          setError("Invalid account type. Please use host login.");
          setIsLoading(false);
        }
      } else if (response.data?.requires_verification) {
        // Email not verified - check role
        const { user_id, role } = response.data;

        if (role && role !== "host") {
          // Wrong account type
          setError(`This is a ${role} account. Please use the ${role} login.`);
          setIsLoading(false);
          return;
        }

        // Email not verified for host account - show OTP modal
        sessionStorage.setItem("user_id", user_id);
        sessionStorage.setItem("signup_email", email);
        sessionStorage.setItem("signup_role", "host");
        // Resend OTP for verification
        await api.resendOtp(user_id);
        // Trigger OTP modal in parent with role
        onVerificationRequired(user_id, "host");
        setIsLoading(false);
      } else {
        setError(response.data?.message || "Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials.",
      );
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md"
    >
      <div>
        <h2 className="text-3xl font-bold text-midnight-navy dark:text-white mb-2">
          Host Login
        </h2>
        <p className="text-soft-stone-gray dark:text-dusty-sky-blue">
          Manage your properties and listings
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-midnight-navy dark:text-white">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-midnight-navy dark:text-white">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-champagne-gold hover:text-champagne-gold/80 transition-colors disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl font-semibold bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </motion.button>

      {/* Switch to Register */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm text-soft-stone-gray dark:text-dusty-sky-blue"
      >
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          disabled={isLoading}
          className="text-champagne-gold hover:text-champagne-gold/80 font-medium transition-colors disabled:opacity-50"
        >
          Create one
        </button>
      </motion.p>
    </motion.form>
  );
}
