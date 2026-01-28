import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

/**
 * Responsive Modal Wrapper Component
 * Ensures all modals are perfectly centered and responsive
 * Features:
 * - Backdrop click to close
 * - Keyboard ESC to close
 * - Smooth animations
 * - Responsive sizing
 * - Accessible with ARIA attributes
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  className = "",
  noPadding = false,
  rounded = true,
}) {
  // Size presets
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Modal Container - Centered without top padding */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`
                w-full ${sizeClasses[size]} 
                bg-white dark:bg-slate-800 ${rounded ? "rounded-2xl md:rounded-3xl" : ""} 
                shadow-2xl max-h-[85vh] overflow-y-auto pointer-events-auto
                ${className}
              `}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header with close button */}
              {title && (
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 md:px-8 py-4 md:py-6 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl">
                  <h2
                    id="modal-title"
                    className="text-2xl md:text-3xl font-serif text-midnight-navy dark:text-white"
                  >
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-warm-ivory dark:hover:bg-slate-700 rounded-full transition-colors duration-300"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6 text-midnight-navy dark:text-slate-300" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className={noPadding ? "" : "px-6 md:px-8 py-6 md:py-8"}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
