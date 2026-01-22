import { useState, useEffect, forwardRef } from "react";
import {
  Calendar,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const API_BASE_URL = "https://bookholidayrental.com";

const EventSkeleton = forwardRef(() => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    <div>
      {/* Image Skeleton */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative overflow-hidden rounded-[2rem] h-80 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600"
      />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
          className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded w-1/3"
        />
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          className="h-7 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded w-2/3"
        />
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded w-full"
        />
        <div className="space-y-2 pt-2">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded w-1/2"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded w-1/2"
          />
        </div>
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="h-12 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full"
        />
      </div>
    </div>
  </motion.div>
));

EventSkeleton.displayName = "EventSkeleton";

export function ExclusiveEvents() {
  const [currentPage, setCurrentPage] = useState(0);
  const [apiEvents, setApiEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/list.php`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          const transformed = data.data.map((event) => {
            let imageUrl = event.event_image || "";
            if (imageUrl && !imageUrl.startsWith("http")) {
              imageUrl = `${API_BASE_URL}/${imageUrl}`;
            }

            const words = event.description.split(" ");
            const truncatedDesc =
              words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");

            return {
              id: event.id,
              title: event.event_name,
              category: event.event_type,
              date: event.event_date,
              location: event.location,
              image: imageUrl,
              description: truncatedDesc,
              maxAttendees: event.max_attendees,
              currentAttendees: event.current_attendees,
              latitude: event.location_latitude,
              longitude: event.location_longitude,
            };
          });
          setApiEvents(transformed);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const cardsPerPage = isMobile ? 1 : 4;
  const totalPages = Math.ceil(apiEvents.length / cardsPerPage);
  const currentEvents = isMobile
    ? [apiEvents[currentPage]]
    : apiEvents.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage,
      );

  // Preload images
  useEffect(() => {
    if (apiEvents.length > 0) {
      apiEvents.forEach((event) => {
        if (event.image) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = event.image;
          document.head.appendChild(link);
        }
      });
    }
  }, [apiEvents]);

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-32 px-6 bg-[#1a1f2e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-6">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm text-[#d4af37] uppercase tracking-wider">
              Special Collections
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl text-[#faf8f5] mb-4 font-serif font-light">
            Exclusive Experiences
          </h2>
          <p className="text-lg text-[#9baab8] max-w-2xl mx-auto font-light">
            Book your stay for major events and seasonal celebrations
          </p>
        </motion.div>

        <div className="relative">
          {!loading && apiEvents.length > 4 && (
            <motion.button
              onClick={goToPrevious}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 p-3 bg-[#d4af37] text-[#1a1f2e] rounded-full hover:bg-[#c9a532] transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}

          {!loading && apiEvents.length > 4 && (
            <motion.button
              onClick={goToNext}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 p-3 bg-[#d4af37] text-[#1a1f2e] rounded-full hover:bg-[#c9a532] transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 scale-90 md:scale-100 origin-top">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <EventSkeleton key={`skeleton-${index}`} />
                    ))
                : currentEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="group relative overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full">
                        <div className="aspect-[16/10] overflow-hidden bg-[#2a3142]">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,31,46,0.95)] via-[rgba(26,31,46,0.4)] to-transparent" />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 mb-4">
                            <span className="text-xs text-[#ffd700] uppercase tracking-wider">
                              {event.category}
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-3xl text-[#faf8f5] mb-3 transform transition-transform duration-500 group-hover:translate-y-[-4px] font-serif font-medium line-clamp-2 bg-black/40 px-3 py-2 rounded-lg">
                            {event.title}
                          </h3>

                          <div className="flex flex-col gap-2 mb-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                              <span className="text-[#e8e6e1] truncate">
                                {event.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                              <span className="text-[#e8e6e1] truncate">
                                {event.location}
                              </span>
                            </div>
                          </div>

                          <button className="w-full px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#c9a532] text-[#1a1f2e] transition-all duration-300 flex items-center justify-between group-hover:shadow-lg group-hover:shadow-[#d4af37]/20 text-sm md:text-base">
                            <span className="font-medium">View Event</span>
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>

        {!loading && apiEvents.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center items-center gap-3 mt-12"
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPage(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentPage
                    ? "w-8 h-3 bg-[#d4af37]"
                    : "w-3 h-3 bg-[#d4af37]/30 hover:bg-[#d4af37]/60"
                }`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
