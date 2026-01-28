import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, Check, X, User } from "lucide-react";
import { api } from "@/utils/client";

const HOSTING_PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    features: ["1 property", "10 photos per listing", "Email support"],
  },
  {
    id: "premium",
    name: "Premium",
    features: ["5 properties", "Unlimited photos", "24/7 support", "Analytics"],
  },
];

export function HostRegister({ onSwitchToLogin, onStepComplete = () => {} }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.register(
        email,
        password,
        confirmPassword,
        fullName,
        "host",
      );

      if (response.data && response.data.success) {
        const { user_id, role } = response.data;

        // Store in sessionStorage
        sessionStorage.setItem("user_id", user_id);
        sessionStorage.setItem("signup_role", role);
        sessionStorage.setItem("selected_package", selectedPackage);
        sessionStorage.setItem("signup_email", email);
        sessionStorage.setItem("signup_fullName", fullName);

        // Move to Step 2 (OTP verification)
        onStepComplete(2);
      } else {
        setError(
          response.data?.message || "Registration failed. Please try again.",
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
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
          Start Hosting
        </h2>
        <p className="text-soft-stone-gray dark:text-dusty-sky-blue">
          List your properties and earn money
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

      {/* Full Name Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-midnight-navy dark:text-white">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
          />
        </div>
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-midnight-navy dark:text-white">
          Email Address
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
            placeholder="Min 8 chars, uppercase, number"
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

        {/* Password Requirements */}
        {password && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 space-y-2 p-3 bg-warm-ivory dark:bg-charcoal-blue/50 rounded-lg"
          >
            <p className="text-xs font-medium text-soft-stone-gray dark:text-dusty-sky-blue">
              Password must have:
            </p>
            {Object.entries(passwordChecks).map(([check, isValid]) => (
              <div
                key={check}
                className={`text-xs flex items-center gap-2 ${
                  isValid
                    ? "text-green-600 dark:text-green-400"
                    : "text-soft-stone-gray dark:text-dusty-sky-blue/60"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${
                    isValid ? "bg-green-600" : "bg-soft-stone-gray/30"
                  }`}
                >
                  {isValid ? "✓" : "○"}
                </span>
                {check === "length" && "At least 8 characters"}
                {check === "uppercase" && "One uppercase letter"}
                {check === "lowercase" && "One lowercase letter"}
                {check === "number" && "One number"}
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Confirm Password Field */}
      {/* Confirm Password Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-midnight-navy dark:text-white">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-gold" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            disabled={isLoading}
            className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
              confirmPassword && !passwordsMatch
                ? "border-red-300 dark:border-red-700"
                : "border-soft-stone-gray/20 dark:border-dusty-sky-blue/20"
            } bg-white dark:bg-charcoal-blue text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-champagne-gold hover:text-champagne-gold/80 transition-colors disabled:opacity-50"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Passwords do not match
          </p>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        type="submit"
        disabled={isLoading || !isPasswordValid || !passwordsMatch}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl font-semibold bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isLoading ? "Creating account..." : "Continue to Verification"}
      </motion.button>

      {/* Switch to Login */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-center text-sm text-soft-stone-gray dark:text-dusty-sky-blue"
      >
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-champagne-gold hover:text-champagne-gold/80 font-medium transition-colors disabled:opacity-50"
        >
          Sign in
        </button>
      </motion.p>
    </motion.form>
  );
}
