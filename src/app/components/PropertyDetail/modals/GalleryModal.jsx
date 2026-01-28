import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/app/components/ui/Modal";

export function GalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailContainerRef = useRef(null);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  // Auto-scroll thumbnails to keep selected image centered
  useEffect(() => {
    // Add "active" class to selected thumbnail and scroll it into view
    const thumbnails = document.querySelectorAll("[data-thumbnail]");
    thumbnails.forEach((thumb, idx) => {
      if (idx === currentIndex) {
        thumb.classList.add("active");
        thumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      } else {
        thumb.classList.remove("active");
      }
    });
  }, [currentIndex]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="p-0 overflow-hidden flex flex-col max-h-screen"
    >
      {/* Main Image */}
      <div className="relative bg-black/95 flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div
        ref={thumbnailContainerRef}
        className="bg-black/95 px-4 py-3 flex-shrink-0 overflow-x-auto border-t border-gray-600 scrollbar-hide"
      >
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              data-thumbnail
              onClick={() => setCurrentIndex(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? "border-champagne-gold shadow-lg shadow-champagne-gold/50"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-full h-full object-cover transition-opacity ${
                  idx === currentIndex
                    ? "opacity-100"
                    : "opacity-75 hover:opacity-100"
                }`}
              />
              {idx === currentIndex && (
                <motion.div
                  layoutId="thumbnail-indicator"
                  className="absolute inset-0 ring-2 ring-champagne-gold rounded-lg pointer-events-none"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
