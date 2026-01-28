import { useState } from "react";
import { motion } from "motion/react";
import { ZoomIn, Image, ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({ images, onImageClick, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[45vh] bg-warm-ivory rounded-2xl flex flex-col items-center justify-center gap-4">
        <Image className="w-12 h-12 text-dusty-sky-blue" />
        <p className="text-dusty-sky-blue font-medium">No images available</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Desktop gallery - uses data-image-count for CSS selectors
  const renderDesktopGallery = () => {
    const displayCount = Math.min(images.length, 4);
    const allImages = images.slice(0, 4);

    return (
      <div className="w-full hidden md:flex justify-center">
        <div className="w-[60%]">
          <style>{`
          [data-image-count="1"] {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            gap: 1rem;
            height: 45vh;
          }
          
          [data-image-count="2"] {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 1rem;
            height: 45vh;
          }
          
          [data-image-count="3"] {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 1rem;
            height: 45vh;
          }
          
          [data-image-count="4"] {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 1rem;
            height: 45vh;
          }
          
          .gallery-item-1 {
            grid-column: span 2;
            grid-row: span 2;
          }
          
          .gallery-item-2 {
            grid-column: span 1;
            grid-row: span 1;
          }
          
          .gallery-item-3 {
            grid-column: span 1;
            grid-row: span 1;
          }
          
          .gallery-item-4 {
            grid-column: span 2;
            grid-row: span 1;
          }
        `}</style>

          <div data-image-count={displayCount}>
            {allImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`gallery-item-${idx + 1} relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg hover:shadow-xl transition-shadow`}
                onClick={() => onImageClick(idx)}
              >
                <img
                  src={img}
                  alt={`${title} - Image ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>

                {/* Overlay for 4th image if more than 4 images */}
                {idx === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-2xl group-hover:bg-black/70 transition-colors">
                    <div className="text-center">
                      <Image className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-serif text-xl font-medium">
                        +{images.length - 4} more
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Mobile carousel
  return (
    <div className="w-full">
      {/* Desktop Grid */}
      {renderDesktopGallery()}

      {/* Mobile Carousel */}
      <div className="md:hidden relative w-full h-[45vh] rounded-2xl overflow-hidden">
        <motion.div
          animate={{ x: -currentIndex * 100 + "%" }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="flex h-full"
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 rounded-2xl overflow-hidden"
              onClick={() => onImageClick(idx)}
            >
              <img
                src={img}
                alt={`${title} - Image ${idx + 1}`}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          ))}
        </motion.div>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg z-10 hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-midnight-navy" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg z-10 hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-midnight-navy" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-champagne-gold w-8 h-2"
                      : "bg-white/60 w-2 h-2"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-midnight-navy/80 text-white px-3 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PropertyGallery;
