import { useState, useEffect } from "react";
import { Heart, User, Menu, X, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CurrencyModal } from "./modals/CurrencyModal";
import { useCurrency } from "@/context/CurrencyContext";

const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Host with us", href: "#host" },
  { label: "Inspiration", href: "#inspiration" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Support", href: "#support" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg py-4"
            : "bg-transparent py-6"
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
                src="/public/assets/logo.png"
                alt="BHR Logo"
                className="h-10 w-auto transition-all duration-500"
                style={{
                  filter: isScrolled ? "none" : "brightness(0) invert(1)",
                }}
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isScrolled
                      ? "text-[#1a1f2e] hover:text-[#d4af37]"
                      : "text-white hover:text-[#d4af37]"
                  }`}
                >
                  {link.label}
                </motion.a>
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
                  isScrolled
                    ? "border-[#1a1f2e]/20 text-[#1a1f2e] hover:border-[#d4af37] hover:text-[#d4af37]"
                    : "border-white/30 text-white hover:border-[#d4af37] hover:text-[#d4af37] backdrop-blur-md bg-white/10"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">{currency}</span>
              </motion.button>

              {/* Favorites Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#f8f6f3] text-[#1a1f2e] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
                    : "backdrop-blur-md bg-white/10 text-white hover:bg-white/20"
                }`}
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              {/* Profile Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#1a1f2e] text-white hover:bg-[#2a3142]"
                    : "backdrop-blur-md bg-white/20 text-white hover:bg-white/30"
                }`}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#f8f6f3] text-[#1a1f2e]"
                    : "backdrop-blur-md bg-white/10 text-white"
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
            className="fixed top-[88px] left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg text-[#1a1f2e] hover:text-[#d4af37] transition-colors duration-300 py-2"
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Currency in Mobile */}
                <motion.button
                  onClick={() => {
                    setIsCurrencyModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f8f6f3] text-[#1a1f2e] hover:bg-[#d4af37]/10 transition-colors duration-300 w-full"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>{currency} - Select Currency</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
