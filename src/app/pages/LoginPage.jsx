import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

import { UserLogin } from "@/app/components/auth/UserLogin";
import { UserRegister } from "@/app/components/auth/UserRegister";
import { HostLogin } from "@/app/components/auth/HostLogin";
import { HostRegister } from "@/app/components/auth/HostRegister";
import { AdminLogin } from "@/app/components/auth/AdminLogin";
import { OTPVerificationModal } from "@/app/components/modals/OTPVerificationModal";
import { GuestDetailsModal } from "@/app/components/modals/GuestDetailsModal";
import { HostPackageModal } from "@/app/components/modals/HostPackageModal";

const ROLES = {
  USER: "user",
  HOST: "host",
  ADMIN: "admin",
};

const MODES = {
  LOGIN: "login",
  REGISTER: "register",
};

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { isLoggedIn, logout } = useAuth();

  const roleParam = searchParams.get("role") || ROLES.USER;
  const adminAccess = searchParams.get("admin") === "true";
  const redirectParam = decodeURIComponent(searchParams.get("redirect") || "/");
  const modeParam = searchParams.get("mode") || MODES.LOGIN;

  const [currentRole, setCurrentRole] = useState(
    adminAccess && roleParam === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER,
  );
  const [currentMode, setCurrentMode] = useState(modeParam);

  // Registration flow state
  const [registrationStep, setRegistrationStep] = useState(1);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isLoginVerification, setIsLoginVerification] = useState(false);
  const [loginVerificationRole, setLoginVerificationRole] = useState(null);
  const [guestDetailsModalOpen, setGuestDetailsModalOpen] = useState(false);
  const [hostPackageModalOpen, setHostPackageModalOpen] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      logout();
    }
  }, []);

  const handleRoleChange = (role) => {
    // Block admin tab if not accessed with proper authorization
    if (role === ROLES.ADMIN && !adminAccess) {
      return;
    }
    setCurrentRole(role);
    setCurrentMode(MODES.LOGIN);
    // Reset registration state when changing roles
    setRegistrationStep(1);
    setOtpModalOpen(false);
    setIsLoginVerification(false);
    setLoginVerificationRole(null);
    setGuestDetailsModalOpen(false);
    setHostPackageModalOpen(false);
  };

  const handleRegistrationStepComplete = useCallback((step) => {
    // Store email and full name in sessionStorage for later modals
    setRegistrationStep(step);

    if (step === 2) {
      // Open OTP Modal after Step 1
      setOtpModalOpen(true);
    }
  }, []);

  const handleOTPVerified = (responseData = {}) => {
    setOtpModalOpen(false);

    // Check if details are required
    if (responseData.requires_details) {
      // Open appropriate details modal based on role from response or login context
      const userRole = responseData.role || loginVerificationRole;

      if (userRole === "guest") {
        setGuestDetailsModalOpen(true);
      } else if (userRole === "host") {
        setHostPackageModalOpen(true);
      }
      return;
    }

    // If this is login verification, just redirect to home
    if (isLoginVerification) {
      setIsLoginVerification(false);
      setLoginVerificationRole(null);
      navigate("/");
      return;
    }

    // Step 3: Open role-specific modal (registration flow)
    if (currentRole === ROLES.USER) {
      setGuestDetailsModalOpen(true);
    } else if (currentRole === ROLES.HOST) {
      setHostPackageModalOpen(true);
    }
  };

  const handleVerificationRequired = useCallback((user_id, role) => {
    // Open OTP modal for verification during login
    setOtpModalOpen(true);
    setIsLoginVerification(true);
    setLoginVerificationRole(role);
    setRegistrationStep(2);
  }, []);

  const availableRoles = adminAccess
    ? Object.values(ROLES)
    : Object.values(ROLES).filter((r) => r !== ROLES.ADMIN);

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  const handleLoginSuccess = () => {
    // Redirect to host dashboard if logging in as host
    if (currentRole === ROLES.HOST) {
      navigate("/host-dashboard");
    } else {
      navigate("/");
    }
  };

  const renderAuthComponent = () => {
    if (currentRole === ROLES.USER) {
      if (currentMode === MODES.LOGIN) {
        return (
          <UserLogin
            onSwitchToRegister={() => handleModeChange(MODES.REGISTER)}
            onVerificationRequired={handleVerificationRequired}
          />
        );
      }
      return (
        <UserRegister
          onStepComplete={handleRegistrationStepComplete}
          onSwitchToLogin={() => handleModeChange(MODES.LOGIN)}
        />
      );
    }

    if (currentRole === ROLES.HOST) {
      if (currentMode === MODES.LOGIN) {
        return (
          <HostLogin
            onSwitchToRegister={() => handleModeChange(MODES.REGISTER)}
            onVerificationRequired={handleVerificationRequired}
          />
        );
      }
      return (
        <HostRegister
          onStepComplete={handleRegistrationStepComplete}
          onSwitchToLogin={() => handleModeChange(MODES.LOGIN)}
        />
      );
    }

    if (currentRole === ROLES.ADMIN) {
      return <AdminLogin />;
    }
  };

  return (
    <div
      className={`h-screen flex transition-colors duration-300 overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#0f1219] via-charcoal-blue to-[#0f1219]"
          : "bg-gradient-to-br from-bone-white via-warm-ivory to-bone-white"
      }`}
    >
      {/* Left Section - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`hidden lg:flex flex-col justify-between p-12 w-1/2 h-screen overflow-hidden fixed left-0 top-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1219] via-[#1a1f2e] to-charcoal-blue"
            : "bg-gradient-to-br from-midnight-navy to-charcoal-blue"
        }`}
      >
        {/* Header */}
        <div>
          <motion.a
            href="/"
            className="flex items-center gap-2 mb-16"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 rounded-lg bg-champagne-gold/10">
              <Home className="w-6 h-6 text-champagne-gold" />
            </div>
            <span className="text-2xl font-bold text-white">
              BookHolidayRental
            </span>
          </motion.a>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Your Home Away
              <br />
              From Home
            </h1>
            <p className="text-dusty-sky-blue text-lg">
              Discover exceptional vacation rentals and create unforgettable
              memories.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {[
              "✓ Handpicked luxury properties",
              "✓ Secure & transparent bookings",
              "✓ 24/7 customer support",
            ].map((feature, idx) => (
              <p
                key={idx}
                className="text-dusty-sky-blue flex items-center gap-3"
              >
                <span className="text-champagne-gold font-bold">•</span>
                {feature}
              </p>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-dusty-sky-blue/60 text-sm"
        >
          © 2026 BookHolidayRental. All rights reserved.
        </motion.p>
      </motion.div>

      {/* Right Section - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 lg:ml-auto flex flex-col h-screen overflow-hidden"
      >
        {/* Fixed Header - Logo, Back Button and Tabs */}
        <div
          className="flex-shrink-0 p-8 md:p-12 space-y-6 border-b"
          style={{
            borderColor:
              theme === "dark"
                ? "rgba(221, 192, 121, 0.1)"
                : "rgba(100, 79, 59, 0.1)",
          }}
        >
          {/* Back Button and Logo Container */}
          <div className="flex items-center justify-between">
            {/* Back Button - Left */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate(redirectParam)}
              className="flex items-center gap-2 text-soft-stone-gray dark:text-dusty-sky-blue hover:text-champagne-gold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </motion.button>

            {/* Logo - Center */}
            <motion.a
              href="/"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/assets/logo.png"
                alt="BookHolidayRental"
                className={`h-10 w-auto transition-all duration-300 ${theme === "dark" ? "brightness-0 invert" : "brightness-100"}`}
              />
            </motion.a>

            {/* Spacer - Right */}
            <div className="w-12"></div>
          </div>

          {/* Role Selector Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full flex justify-center"
          >
            <div
              className={`flex gap-3 p-2 rounded-xl border w-full max-w-sm ${
                theme === "dark"
                  ? "bg-charcoal-blue/50 border-dusty-sky-blue/20"
                  : "bg-warm-ivory border-soft-stone-gray/20"
              }`}
            >
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all capitalize ${
                    currentRole === role
                      ? "bg-champagne-gold text-midnight-navy shadow-lg"
                      : `text-soft-stone-gray dark:text-dusty-sky-blue hover:text-champagne-gold`
                  }`}
                >
                  {role === ROLES.HOST
                    ? "For Hosts"
                    : role === ROLES.ADMIN
                      ? "Admin"
                      : "Guest"}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentRole}-${currentMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderAuthComponent()}
              </motion.div>
            </AnimatePresence>

            {/* Divider - Only show for non-admin roles */}
            {currentRole !== ROLES.ADMIN && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={`w-full h-px ${
                        theme === "dark"
                          ? "bg-dusty-sky-blue/20"
                          : "bg-soft-stone-gray/20"
                      }`}
                    ></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className={`px-3 ${
                        theme === "dark"
                          ? "bg-[#0f1219] text-dusty-sky-blue"
                          : "bg-bone-white text-soft-stone-gray"
                      }`}
                    >
                      Continue with
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Login - Only for non-admin */}
            {currentRole !== ROLES.ADMIN && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full space-y-3"
              >
                {/* Google Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 text-midnight-navy dark:text-white hover:shadow-lg hover:border-gray-300 dark:hover:border-white/20"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </motion.button>

                {/* Apple Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 border-2 ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                      : "bg-black/5 border-black/20 text-midnight-navy hover:bg-black/10 hover:border-black/30"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.02-1.62-.59-3.21-.59-1.59 0-1.9.61-3.23.66-1.32.12-2.34-1.313-3.18-2.553-1.59-2.97-2.286-7.864-1.012-10.141.562-1.087 1.585-1.911 2.755-1.932 1.267-.023 2.461.646 3.315.646.854 0 2.462-.846 4.151-.921 1.117-.053 2.319.389 3.227 1.024 3.007 3.246 2.666 10.016-.857 13.47zM12.75 13.02c.03-1.42 1.2-2.69 2.59-2.74 1.39-.05 2.58 1.06 2.54 2.48-.04 1.42-1.19 2.7-2.59 2.76-1.39.06-2.58-1.06-2.54-2.5z" />
                  </svg>
                  <span>Continue with Apple</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Registration Modals */}
      <OTPVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerified={handleOTPVerified}
      />
      <GuestDetailsModal
        isOpen={guestDetailsModalOpen}
        onClose={() => setGuestDetailsModalOpen(false)}
      />
      <HostPackageModal
        isOpen={hostPackageModalOpen}
        onClose={() => setHostPackageModalOpen(false)}
      />
    </div>
  );
}
