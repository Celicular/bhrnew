import { useEffect, useRef, useState } from "react";
import { Modal } from "@/app/components/ui/Modal";
import { MapPin, Navigation, X, Loader } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom property marker
const createPropertyMarker = () => {
  return L.divIcon({
    html: `<div style="font-size: 32px;">🏠</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: "",
  });
};

// Custom selected location marker
const createSelectedMarker = () => {
  return L.divIcon({
    html: `<div style="font-size: 28px;">📍</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: "",
  });
};

// POI markers
const poiMarkers = {
  hospital: "🏥",
  airport: "✈️",
  station: "🚉",
  museum: "🏛️",
};

const createPOIMarker = (type) => {
  return L.divIcon({
    html: `<div style="font-size: 20px;">${poiMarkers[type] || "📍"}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
    className: "",
  });
};

export function LocationMapModal({
  isOpen,
  onClose,
  latitude,
  longitude,
  location,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const routePolylineRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [poiStats, setPOIStats] = useState({});

  const lat = parseFloat(latitude) || 23.1815;
  const lng = parseFloat(longitude) || 85.2871;
  const MAX_DISTANCE_KM = 100;

  // Fetch POIs from Overpass API
  const fetchPOIs = async (map) => {
    try {
      // Overpass API bbox format: (south,west,north,east) - 0.2 degrees ≈ 22km radius
      const south = lat - 0.2;
      const west = lng - 0.2;
      const north = lat + 0.2;
      const east = lng + 0.2;

      const query = `[out:json];(node["amenity"="hospital"](${south},${west},${north},${east});node["aeroway"="aerodrome"](${south},${west},${north},${east});node["railway"="station"](${south},${west},${north},${east});node["tourism"="museum"](${south},${west},${north},${east}););out center;`;

      console.log("Fetching POIs with query:", query);
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await response.json();
      console.log("POI Data received:", data);

      const stats = {
        hospital: { count: 0, totalDistance: 0, minDistance: Infinity },
        airport: { count: 0, totalDistance: 0, minDistance: Infinity },
        station: { count: 0, totalDistance: 0, minDistance: Infinity },
        museum: { count: 0, totalDistance: 0, minDistance: Infinity },
      };

      if (data.elements && data.elements.length > 0) {
        console.log("Found", data.elements.length, "POI elements");
        data.elements.forEach((element) => {
          if (!element.lat || !element.lon) return;

          const poiLat = element.lat;
          const poiLng = element.lon;
          let type = "museum";

          if (element.tags?.amenity === "hospital") type = "hospital";
          else if (element.tags?.aeroway === "aerodrome") type = "airport";
          else if (element.tags?.railway === "station") type = "station";

          const dist = calculateDistance(lat, lng, poiLat, poiLng);

          // Add marker with safety check
          try {
            const icon = createPOIMarker(type);
            if (icon) {
              const marker = L.marker([poiLat, poiLng], { icon })
                .addTo(map)
                .bindPopup(
                  element.tags?.name ||
                    type.charAt(0).toUpperCase() + type.slice(1),
                );

              // Add click handler to draw route to POI
              marker.on("click", () => {
                setSelectedLocation({
                  lat: poiLat,
                  lng: poiLng,
                  name: element.tags?.name || type,
                });
                fetchAndDrawRoute(lat, lng, poiLat, poiLng, map);
              });
            }
          } catch (e) {
            console.warn("Failed to add POI marker:", e);
          }

          // Update stats
          stats[type].count += 1;
          stats[type].totalDistance += dist;
          stats[type].minDistance = Math.min(stats[type].minDistance, dist);
        });

        // Calculate closest distance
        Object.keys(stats).forEach((key) => {
          if (stats[key].count > 0 && stats[key].minDistance !== Infinity) {
            stats[key].closest = stats[key].minDistance.toFixed(1);
          }
        });

        console.log("POI Stats:", stats);
        setPOIStats(stats);
      } else {
        console.log("No POI elements found");
      }
    } catch (error) {
      console.error("Error fetching POIs:", error);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    // Destroy existing map instance completely
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Clear Leaflet DOM data
    if (mapRef.current) {
      mapRef.current.classList.remove("leaflet-container");
      mapRef.current.innerHTML = "";
    }

    // Create new map instance
    const map = L.map(mapRef.current).setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Add property marker
    markerRef.current = L.marker([lat, lng], {
      icon: createPropertyMarker(),
    })
      .addTo(map)
      .bindPopup(`<strong>${location || "Property Location"}</strong>`, {
        autoClose: false,
        closeButton: true,
      });

    // Draw 100km radius circle
    radiusCircleRef.current = L.circle([lat, lng], {
      radius: MAX_DISTANCE_KM * 1000, // Convert km to meters
      color: "var(--champagne-gold)",
      weight: 2,
      opacity: 0.3,
      fill: true,
      fillColor: "var(--champagne-gold)",
      fillOpacity: 0.05,
    }).addTo(map);

    // Fetch and display POIs
    fetchPOIs(map);

    // Handle map clicks for location selection
    const handleMapClick = (e) => {
      const clickedLat = e.latlng.lat;
      const clickedLng = e.latlng.lng;

      // Calculate distance in km
      const distanceKm = calculateDistance(lat, lng, clickedLat, clickedLng);

      if (distanceKm <= MAX_DISTANCE_KM) {
        // Remove previous selection
        if (selectedMarkerRef.current) {
          map.removeLayer(selectedMarkerRef.current);
        }
        if (routePolylineRef.current) {
          map.removeLayer(routePolylineRef.current);
        }

        // Add new selected marker
        selectedMarkerRef.current = L.marker([clickedLat, clickedLng], {
          icon: createSelectedMarker(),
        })
          .addTo(map)
          .bindPopup(
            `<div>
              <strong>Selected Location</strong>
              <p style="margin: 4px 0 0 0; font-size: 12px;">Distance: ${distanceKm.toFixed(2)} km</p>
              <p style="margin: 4px 0 0 0; font-size: 12px;">${clickedLat.toFixed(4)}, ${clickedLng.toFixed(4)}</p>
            </div>`,
            { autoClose: false, closeButton: true },
          );

        // Draw route polyline between markers
        routePolylineRef.current = L.polyline(
          [
            [lat, lng],
            [clickedLat, clickedLng],
          ],
          {
            color: "var(--teal-accent)",
            weight: 3,
            opacity: 0.7,
            dashArray: "5, 5",
          },
        ).addTo(map);

        // Fit map to show both markers
        const group = L.featureGroup([
          markerRef.current,
          selectedMarkerRef.current,
        ]);
        map.fitBounds(group.getBounds().pad(0.1));

        setSelectedLocation({ lat: clickedLat, lng: clickedLng });
        setDistance(distanceKm);

        // Fetch actual route from OSRM
        fetchAndDrawRoute(lat, lng, clickedLat, clickedLng, map);
      } else {
        // Show alert if outside radius
        alert(
          `Location is ${distanceKm.toFixed(2)} km away. Maximum allowed distance is ${MAX_DISTANCE_KM} km.`,
        );
      }
    };

    map.on("click", handleMapClick);

    mapInstanceRef.current = map;

    return () => {
      map.off("click", handleMapClick);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
      selectedMarkerRef.current = null;
      radiusCircleRef.current = null;
      routePolylineRef.current = null;
    };
  }, [isOpen, lat, lng, location]);

  // Fetch route from OSRM and draw it
  const fetchAndDrawRoute = async (startLat, startLng, endLat, endLng, map) => {
    setLoadingRoute(true);
    try {
      // Use OSRM (Open Route Service Machine) - free, no API key needed
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`,
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const routeDistance = route.distance / 1000; // Convert to km

        // Update distance with actual route distance
        setDistance(routeDistance);

        // Extract coordinates for the route
        const coordinates = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        // Remove old route if exists
        if (routePolylineRef.current && map) {
          map.removeLayer(routePolylineRef.current);
        }

        // Draw route on map
        routePolylineRef.current = L.polyline(coordinates, {
          color: "var(--teal-accent)",
          weight: 5,
          opacity: 0.8,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // Fit bounds to show full route
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds.pad(0.1));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      // Fall back to straight line if route fails
      const routeDistance = calculateDistance(
        startLat,
        startLng,
        endLat,
        endLng,
      );
      setDistance(routeDistance);

      if (routePolylineRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
      }

      routePolylineRef.current = L.polyline(
        [
          [startLat, startLng],
          [endLat, endLng],
        ],
        {
          color: "var(--teal-accent)",
          weight: 5,
          opacity: 0.7,
          dashArray: "5, 5",
        },
      ).addTo(mapInstanceRef.current);
    } finally {
      setLoadingRoute(false);
    }
  };

  const clearSelection = () => {
    if (mapInstanceRef.current) {
      if (selectedMarkerRef.current) {
        mapInstanceRef.current.removeLayer(selectedMarkerRef.current);
        selectedMarkerRef.current = null;
      }
      if (routePolylineRef.current) {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
        routePolylineRef.current = null;
      }
      setSelectedLocation(null);
      setDistance(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      noPadding={true}
      rounded={true}
      className="!p-0 !px-0 !py-0 !rounded-none !border-0 !max-h-[85vh] !overflow-hidden !m-0"
    >
      <div className="flex flex-col h-[85vh] w-full bg-white overflow-hidden !p-0 rounded-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-midnight-navy dark:from-slate-800 to-blue-900 dark:to-slate-900 flex-shrink-0 rounded-t-xl">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <MapPin className="w-5 h-5 text-champagne-gold flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-base md:text-lg font-serif text-white truncate">
                {location}
              </h2>
              <p className="text-xs text-white/70 dark:text-slate-400">
                Click to select location within {MAX_DISTANCE_KM}km
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 min-h-0 relative bg-gray-100 dark:bg-slate-900 overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Info Panel */}
        {selectedLocation && (
          <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 max-w-sm border border-gray-200 dark:border-slate-700 z-50">
            <div className="flex items-start gap-3">
              {loadingRoute ? (
                <Loader className="w-5 h-5 text-champagne-gold animate-spin flex-shrink-0 mt-1" />
              ) : (
                <Navigation className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-midnight-navy dark:text-white mb-3">
                  {loadingRoute ? "Calculating Route..." : "Route Information"}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="text-gray-600 dark:text-slate-400 text-xs">
                      Route Distance
                    </p>
                    <p className="font-bold text-champagne-gold text-lg">
                      {(distance * 0.621371)?.toFixed(2)} mi
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                      Coordinates
                    </p>
                    <p className="font-mono text-xs text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-700 p-2 rounded">
                      {selectedLocation.lat.toFixed(4)},{" "}
                      {selectedLocation.lng.toFixed(4)}
                    </p>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="w-full px-3 py-2 bg-[color:var(--destructive-light-100)] dark:bg-red-900/30 text-[color:var(--destructive-light-600)] dark:text-red-400 hover:bg-[color:var(--destructive-light-100)]/80 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POI Legend */}
        {Object.keys(poiStats).some((key) => poiStats[key].count > 0) && (
          <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 max-w-xs border border-gray-200 dark:border-slate-700 z-50 pointer-events-auto">
            <p className="text-sm font-semibold text-midnight-navy dark:text-white mb-3">
              📍 Nearby Places
            </p>
            <div className="space-y-2 text-xs">
              {Object.keys(poiStats).map(
                (type) =>
                  poiStats[type].count > 0 && (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span>{poiMarkers[type]}</span>
                        <span className="text-gray-600 dark:text-slate-400 capitalize">
                          {type}s
                        </span>
                      </span>
                      <span className="font-semibold text-champagne-gold">
                        {(poiStats[type].closest * 0.621371).toFixed(2)} mi
                      </span>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
