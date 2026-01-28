import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { rafThrottle } from "@/utils/throttle";

export function PropertyNavigation({
  sections,
  activeSection,
  onSectionClick,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navOffset, setNavOffset] = useState(0);
  const navRef = useRef(null);

  // Calculate the navigation element's offset from top
  useEffect(() => {
    const calculateOffset = () => {
      if (navRef.current) {
        setNavOffset(navRef.current.offsetTop);
      }
    };

    // Calculate on mount and on window resize
    calculateOffset();
    window.addEventListener("resize", calculateOffset);
    return () => window.removeEventListener("resize", calculateOffset);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Turn white only when scrolled past the navigation's offset position (when it sticks)
      setIsScrolled(window.scrollY >= navOffset);
    };
    const throttledScroll = rafThrottle(handleScroll);
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [navOffset]);

  return (
    <motion.div
      ref={navRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-40 transition-all duration-300 mt-4 ${
        isScrolled
          ? "bg-white dark:bg-charcoal-blue shadow-lg"
          : "bg-bone-white dark:bg-warm-ivory"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center overflow-x-auto py-3 gap-8 border-b border-gray-200 dark:border-slate-700">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`whitespace-nowrap font-medium transition-all duration-300 relative pb-2 ${
                activeSection === section.id
                  ? "text-midnight-navy"
                  : "text-dusty-sky-blue hover:text-midnight-navy"
              }`}
            >
              {section.label}
              {activeSection === section.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-3 left-0 right-0 h-1 bg-champagne-gold rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden py-4">
          <select
            value={activeSection}
            onChange={(e) => onSectionClick(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-midnight-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
