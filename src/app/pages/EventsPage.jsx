import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, Clock, ArrowLeft, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/utils/client";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { PropertyCard } from "@/app/components/PropertyCard";

export function EventsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [error, setError] = useState("");

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await api.get("api/events/list.php");
        if (response.data?.success && response.data?.data) {
          setEvents(response.data.data);
          // Check if there's an event ID in URL params
          const eventId = searchParams.get("eventId");
          if (eventId && response.data.data.length > 0) {
            const event = response.data.data.find(e => e.id === eventId);
            if (event) {
              selectEvent(event);
            } else {
              selectEvent(response.data.data[0]);
            }
          } else if (response.data.data.length > 0) {
            // Select first event by default
            selectEvent(response.data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  // Fetch nearby properties when event is selected
  const selectEvent = async (event) => {
    setSelectedEvent(event);
    await fetchNearbyProperties(event);
  };

  const fetchNearbyProperties = async (event) => {
    try {
      setLoadingProperties(true);
      const lat = event.location_latitude;
      const long = event.location_longitude;

      const response = await api.get(
        `api/property/nearby.php?lat=${lat}&long=${long}&radius=20&limit=9`
      );

      if (response.data?.success && response.data?.data) {
        setNearbyProperties(response.data.data);
      } else {
        setNearbyProperties([]);
      }
    } catch (err) {
      console.error("Error fetching nearby properties:", err);
      setNearbyProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  if (loadingEvents) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gradient-to-br dark:from-[#0f1219] dark:via-slate-900 dark:to-[#0f1219]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-champagne-gold mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-gradient-to-br dark:from-[#0f1219] dark:via-slate-900 dark:to-[#0f1219]">
      <Navbar initialBackground={false} />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-center text-midnight-navy dark:text-champagne-gold mb-4">
              Upcoming Events
            </h1>
            <p className="text-center text-gray-600 dark:text-dusty-sky-blue text-lg">
              Discover amazing events and book your perfect stay nearby
            </p>
          </motion.div>
        </section>

        {/* Main Content Grid */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {selectedEvent ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Detail - Left/Top */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-2"
                >
                  {/* Event Image */}
                  <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl h-96">
                    <img
                      src={`https://bookholidayrental.com/${selectedEvent.event_image}`}
                      alt={selectedEvent.event_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  {/* Event Details Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl"
                  >
                    {/* Event Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-midnight-navy dark:text-white mb-6 leading-tight">
                      {selectedEvent.event_name
                        .replace(/^["']|["']$/g, "")
                        .replace(/\\r\\n/g, "")}
                    </h2>

                    {/* Event Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
                      {/* Date */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 dark:from-champagne-gold/20 dark:to-champagne-gold/5 rounded-2xl p-4 border border-champagne-gold/20 dark:border-champagne-gold/30"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-champagne-gold" />
                          <span className="text-xs font-semibold text-champagne-gold uppercase">
                            Date
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-midnight-navy dark:text-white">
                          {new Date(selectedEvent.event_date).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </motion.div>

                      {/* Time */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 dark:from-champagne-gold/20 dark:to-champagne-gold/5 rounded-2xl p-4 border border-champagne-gold/20 dark:border-champagne-gold/30"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-champagne-gold" />
                          <span className="text-xs font-semibold text-champagne-gold uppercase">
                            Time
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-midnight-navy dark:text-white">
                          {new Date(selectedEvent.event_date).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </motion.div>

                      {/* Location */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 dark:from-champagne-gold/20 dark:to-champagne-gold/5 rounded-2xl p-4 border border-champagne-gold/20 dark:border-champagne-gold/30 md:col-span-2"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-champagne-gold" />
                          <span className="text-xs font-semibold text-champagne-gold uppercase">
                            Location
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-midnight-navy dark:text-white line-clamp-2">
                          {selectedEvent.location}
                        </p>
                      </motion.div>
                    </div>

                    {/* Event Description */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-midnight-navy dark:text-white mb-4">
                        About This Event
                      </h3>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: selectedEvent.description,
                        }}
                      />
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/listings")}
                      className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-champagne-gold to-champagne-gold/90 text-white font-semibold hover:shadow-2xl hover:shadow-champagne-gold/50 transition-all"
                    >
                      Browse All Properties
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Events List Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-1"
                >
                  <div className="sticky top-32">
                    <h3 className="text-2xl font-bold text-midnight-navy dark:text-white mb-6">
                      More Events
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                      {events.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => selectEvent(event)}
                          className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                            selectedEvent.id === event.id
                              ? "bg-champagne-gold/20 dark:bg-champagne-gold/10 border-champagne-gold dark:border-champagne-gold/50 shadow-lg"
                              : "bg-white/70 dark:bg-slate-800/50 border-gray-300 dark:border-white/10 hover:border-champagne-gold/50 dark:hover:border-champagne-gold/30"
                          }`}
                        >
                          <p className="font-semibold text-midnight-navy dark:text-white text-sm line-clamp-2">
                            {event.event_name
                              .replace(/^["']|["']$/g, "")
                              .substring(0, 50)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-dusty-sky-blue mt-2">
                            {new Date(event.event_date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No events available
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Nearby Properties Section */}
        {selectedEvent && (
          <section className="px-6 pb-20 bg-gradient-to-b from-stone-50 to-stone-100/50 dark:from-transparent dark:to-champagne-gold/10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-midnight-navy dark:text-white mb-4">
                    Stay Close to the Action
                  </h2>
                  <p className="text-gray-600 dark:text-dusty-sky-blue text-lg">
                    Discover premium properties near {selectedEvent.location}
                  </p>
                </div>

                {loadingProperties ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-champagne-gold"></div>
                  </div>
                ) : nearbyProperties.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {nearbyProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20 bg-white/80 dark:bg-slate-800/50 rounded-2xl">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      No properties available near this event at the moment
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
