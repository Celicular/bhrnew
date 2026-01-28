import { useState, useEffect } from "react";
import {
  Heart,
  User,
  Menu,
  X,
  DollarSign,
  Sun,
  Moon,
  LogOut,
  FileText,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { rafThrottle } from "@/utils/throttle";
import { CurrencyModal } from "./modals/CurrencyModal";
import { SavedPropertiesModal } from "./modals/SavedPropertiesModal";
import { ProfileModal } from "./modals/ProfileModal";
import { BookingsModal } from "./modals/BookingsModal";
import { useCurrency } from "@/context/CurrencyContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Host with us", href: "/hosting" },
  { label: "Inspiration", href: "#inspiration" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Support", href: "#support" },
];

export function Navbar({ initialBackground = true, isFixed = true }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isSavedPropertiesOpen, setIsSavedPropertiesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const { currency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, userRole, user, logout } = useAuth();
  const { getTotalPropertyCount } = useWishlist(); // Get count, but will only show for guests
  const navigate = useNavigate();

  // Determine background and text colors based on props
  const shouldHaveWhiteBg = initialBackground === false || isScrolled;
  const shouldHaveDarkText = initialBackground === false || isScrolled;
  // In dark mode, always keep logo white; in light mode, show normal on scroll
  const shouldHaveNormalLogo =
    (initialBackground === false || isScrolled) && theme === "light";

  useEffect(() => {
    const handleScroll = () => {
      if (initialBackground === true) {
        setIsScrolled(window.scrollY > 50);
      }
    };
    const throttledScroll = rafThrottle(handleScroll);
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [initialBackground]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest("[aria-label='Account']") &&
        !e.target.closest(".profile-menu")
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isProfileMenuOpen]);

  return (
    <>
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />
      <SavedPropertiesModal
        isOpen={isSavedPropertiesOpen}
        onClose={() => setIsSavedPropertiesOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <BookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
      />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`${isFixed ? "fixed top-0 left-0 right-0" : "relative"} z-[9999] py-4 ${
          shouldHaveWhiteBg
            ? "bg-white/95 dark:bg-charcoal-blue backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="/assets/logo.png"
                alt="BHR Logo"
                className={`h-10 w-auto transition-all duration-300 ${
                  shouldHaveNormalLogo
                    ? "brightness-100 grayscale-0"
                    : "brightness-0 invert"
                }`}
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  onClick={() => {
                    // For routes, use navigate; for anchors, use default behavior
                    if (link.href.startsWith("/")) {
                      navigate(link.href);
                    } else {
                      // For anchor links, first navigate to home if not there
                      const isHomePage = window.location.hash === "" || window.location.hash === "#/";
                      if (!isHomePage) {
                        navigate("/");
                        // Scroll to element after navigation
                        setTimeout(() => {
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }, 300);
                      } else {
                        // Already on home page, just scroll
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${
                    shouldHaveDarkText
                      ? "text-midnight-navy hover:text-champagne-gold"
                      : "text-white hover:text-champagne-gold"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Currency Button */}
              <motion.button
                onClick={() => setIsCurrencyModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  shouldHaveDarkText
                    ? "border-midnight-navy/20 text-midnight-navy hover:border-champagne-gold hover:text-champagne-gold"
                    : "border-white/30 text-white hover:border-champagne-gold hover:text-champagne-gold"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">{currency}</span>
              </motion.button>

              {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  shouldHaveDarkText
                    ? "bg-warm-ivory text-midnight-navy hover:bg-champagne-gold/10 hover:text-champagne-gold"
                    : "bg-white/20 text-white hover:bg-champagne-gold/30"
                }`}
                aria-label="Toggle theme"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.button>

              {/* Favorites Button */}
              {/* Saved Properties Button - Show for guests and logged-out users (for localStorage) */}
              {(!isLoggedIn || userRole === "guest") && (
                <motion.button
                  onClick={() => setIsSavedPropertiesOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2.5 rounded-full transition-all duration-300 ${
                    shouldHaveDarkText
                      ? "bg-warm-ivory text-midnight-navy hover:bg-champagne-gold/10 hover:text-champagne-gold"
                      : "bg-white/20 text-white hover:bg-champagne-gold/30 hover:text-champagne-gold"
                  }`}
                  aria-label="Favorites"
                >
                  <Heart className="w-5 h-5" />
                  {getTotalPropertyCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                    >
                      {getTotalPropertyCount() > 9
                        ? "9+"
                        : getTotalPropertyCount()}
                    </motion.span>
                  )}
                </motion.button>
              )}

              {/* Profile Button - Show dropdown only for guests, redirect for hosts */}
              <div className="relative">
                <motion.button
                  onClick={() => {
                    if (isLoggedIn && userRole === "guest") {
                      // Show dropdown only for guest users
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    } else {
                      // For hosts or logged-out users, redirect to guest login with current path as redirect
                      const currentPath = window.location.hash.slice(1) || "/";
                      navigate(`/login?role=user&redirect=${encodeURIComponent(currentPath)}`);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    shouldHaveDarkText
                      ? "bg-midnight-navy dark:bg-charcoal-blue text-white hover:bg-charcoal-blue"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </motion.button>

                {/* Profile Dropdown - Only show for guest users */}
                <AnimatePresence>
                  {isLoggedIn && userRole === "guest" && isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="profile-menu absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-charcoal-blue shadow-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 py-2 z-[9999]"
                    >
                      <div className="px-4 py-3 border-b border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                        <p className="text-sm font-semibold text-midnight-navy dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue capitalize">
                          {userRole}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-midnight-navy dark:text-white hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsBookingsModalOpen(true);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-midnight-navy dark:text-white hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 transition-colors flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Bookings
                      </button>
                      <div className="border-t border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-midnight-navy dark:text-white hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${
                  shouldHaveDarkText
                    ? "bg-warm-ivory text-midnight-navy"
                    : "bg-white/20 text-white"
                }`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[88px] left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-charcoal-blue backdrop-blur-xl shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.label}
                    onClick={() => {
                      // For routes, use navigate; for anchors, use default behavior
                      if (link.href.startsWith("/")) {
                        navigate(link.href);
                      } else {
                        // For anchor links, scroll to element
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="text-lg text-midnight-navy hover:text-champagne-gold transition-colors duration-300 py-2 text-left w-full"
                  >
                    {link.label}
                  </motion.button>
                ))}

                {/* Account Section in Mobile */}
                {isLoggedIn ? (
                  <>
                    <div className="border-t border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 pt-4">
                      <p className="text-sm font-semibold text-midnight-navy dark:text-white mb-4">
                        {user?.name}
                      </p>
                      <motion.button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign out</span>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <motion.button
                    onClick={() => {
                      const currentPath = window.location.hash.slice(1) || "/";
                      navigate(`/login?role=user&redirect=${encodeURIComponent(currentPath)}`);
                      setIsMobileMenuOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 transition-colors duration-300 w-full font-semibold"
                  >
                    <User className="w-5 h-5" />
                    <span>Sign in</span>
                  </motion.button>
                )}

                {/* Currency in Mobile */}
                <motion.button
                  onClick={() => {
                    setIsCurrencyModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-warm-ivory text-midnight-navy hover:bg-champagne-gold/10 transition-colors duration-300 w-full"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>{currency} - Select Currency</span>
                </motion.button>

                {/* Theme Toggle in Mobile */}
                <motion.button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-warm-ivory text-midnight-navy hover:bg-champagne-gold/10 transition-colors duration-300 w-full"
                  title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-5 h-5" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-5 h-5" />
                      <span>Light Mode</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
