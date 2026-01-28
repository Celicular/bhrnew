import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { MapPin, ChevronDown, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { decodeHtmlEntities } from "@/utils/htmlDecoder";

// Custom marker icon
const createPropertyMarker = () => {
  return L.divIcon({
    html: `<div style="font-size: 28px;">🏠</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: "",
  });
};

export function PropertyLocation({
  location,
  address,
  latitude,
  longitude,
  description,
  nearbyPlaces,
  landmarks,
  onMapClick,
  onDescriptionClick,
  isMapModalOpen,
}) {
  const [expandedPlaces, setExpandedPlaces] = useState(false);
  const [expandedLandmarks, setExpandedLandmarks] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routePolylineRef = useRef(null);

  const lat = parseFloat(latitude) || 23.1815;
  const lng = parseFloat(longitude) || 85.2871;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing map completely
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Clear any Leaflet-specific data from the DOM element
    if (mapRef.current) {
      mapRef.current.classList.remove("leaflet-container");
      mapRef.current.innerHTML = "";
    }

    // Create map
    const map = L.map(mapRef.current).setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Add property marker
    L.marker([lat, lng], { icon: createPropertyMarker() })
      .addTo(map)
      .bindPopup(`<strong>${location}</strong>`, {
        autoClose: false,
        closeButton: true,
      });

    // Click map to expand
    const handleMapClick = () => {
      onMapClick();
    };
    map.on("click", handleMapClick);

    mapInstanceRef.current = map;

    return () => {
      map.off("click", handleMapClick);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, location, onMapClick]);

  // No need to fetch route here - just show the marker
  // Route calculation happens in LocationMapModal when user selects a destination

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-green-50/30 dark:from-slate-800/30 to-transparent rounded-xl px-6 md:px-8"
      id="location"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy dark:text-white mb-8">
        Location
      </h2>

      {/* Location Title */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-serif text-midnight-navy dark:text-white mb-2">
          {location}
        </h3>
        {address && (
          <p className="text-sm md:text-base text-dusty-sky-blue dark:text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-champagne-gold flex-shrink-0" />
            {address}
          </p>
        )}
      </div>

      {/* Leaflet Map */}
      <div
        className={`mb-8 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-slate-700/50 shadow-lg ${isMapModalOpen ? "hidden" : ""}`}
      >
        <div
          ref={mapRef}
          className="w-full h-80 md:h-96 bg-gray-100 dark:bg-slate-700"
        />
        <div className="bg-white dark:bg-slate-800 px-4 md:px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center gap-3">
          <Navigation className="w-5 h-5 text-champagne-gold flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              <strong>Map View:</strong> Click the map button in the top right
              to expand and select routes
            </p>
          </div>
          <motion.button
            onClick={onMapClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="ml-auto px-6 py-2.5 bg-champagne-gold text-midnight-navy dark:text-charcoal-blue rounded-lg hover:bg-burnished-gold dark:hover:bg-champagne-gold/90 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg"
          >
            Expand Map
          </motion.button>
        </div>
      </div>

      {/* Location Description */}
      <div className="mb-8 bg-gradient-to-br from-warm-ivory/30 dark:from-slate-700/30 to-transparent p-6 md:p-8 rounded-xl border border-gold/10 dark:border-slate-700/50">
        <h3 className="text-xl font-serif text-midnight-navy dark:text-white mb-4">
          About This Location
        </h3>
        <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
          {description
            ? decodeHtmlEntities(description)
            : `Located in ${location}. A wonderful destination with plenty to offer.`}
        </p>
        {description && description.length > 200 && (
          <button
            onClick={onDescriptionClick}
            className="text-champagne-gold hover:text-[color:var(--hover-dark)] font-medium transition-colors"
          >
            Read More
          </button>
        )}
      </div>

      {/* Nearby Places */}
      {nearbyPlaces && nearbyPlaces.length > 0 && (
        <div>
          <h3 className="text-2xl font-serif text-midnight-navy mb-6">
            Nearby Attractions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyPlaces
              .slice(0, expandedPlaces ? undefined : 4)
              .map((place, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 md:p-6 bg-gradient-to-br from-white dark:from-slate-800 to-warm-ivory/20 dark:to-slate-700/30 rounded-xl border border-gray-100/60 dark:border-slate-700/60 hover:border-champagne-gold/30 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">📍</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-midnight-navy dark:text-white mb-1">
                        {place.name}
                      </h4>
                      <p className="text-sm text-dusty-sky-blue dark:text-slate-400 mb-2">
                        {place.distance}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {nearbyPlaces.length > 4 && (
            <button
              onClick={() => setExpandedPlaces(!expandedPlaces)}
              className="mt-6 px-6 py-3 bg-midnight-navy text-white rounded-lg hover:bg-charcoal-blue transition-colors flex items-center gap-2 mx-auto"
            >
              {expandedPlaces
                ? "Show Less"
                : `Show All ${nearbyPlaces.length} Places`}
              <ChevronDown
                className={`w-5 h-5 transition-transform ${expandedPlaces ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      )}

      {/* Landmarks Subsection */}
      {landmarks && landmarks.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-slate-700/50">
          <h3 className="text-2xl font-serif text-midnight-navy dark:text-white mb-6">
            Nearby Landmarks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(expandedLandmarks ? landmarks : landmarks.slice(0, 6)).map(
              (landmark, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-br from-white dark:from-slate-800 to-warm-ivory/20 dark:to-slate-700/30 rounded-xl border border-gray-100/60 dark:border-slate-700/60 hover:border-champagne-gold/30 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-midnight-navy mb-1">
                        {landmark.name}
                      </h4>
                      {landmark.distance && (
                        <p className="text-sm text-dusty-sky-blue dark:text-slate-400">
                          {landmark.distance}
                        </p>
                      )}
                      {landmark.description && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                          {landmark.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ),
            )}
          </div>
          {landmarks.length > 6 && (
            <button
              onClick={() => setExpandedLandmarks(!expandedLandmarks)}
              className="mt-4 px-4 py-2 text-champagne-gold hover:text-[color:var(--hover-dark)] font-medium transition-colors flex items-center gap-2"
            >
              {expandedLandmarks
                ? "Show Less"
                : `Show More (+${landmarks.length - 6})`}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedLandmarks ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      )}
    </motion.section>
  );
}
