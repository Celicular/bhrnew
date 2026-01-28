import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { getImageUrl } from "@/utils/client";

export const PropertyMap = forwardRef(function PropertyMap(
  { properties, selectedLocation },
  ref,
) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersGroup = useRef(null);
  const markersMap = useRef({});

  useEffect(() => {
    // Initialize map
    if (!map.current && mapContainer.current) {
      map.current = L.map(mapContainer.current).setView(
        [
          selectedLocation.location_lat || 20,
          selectedLocation.location_lon || 0,
        ],
        5,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    if (markersGroup.current) {
      map.current.removeLayer(markersGroup.current);
    }
    markersMap.current = {};

    // Create marker cluster group
    markersGroup.current = L.markerClusterGroup({
      maxClusterRadius: 80,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = "small";
        let icon;

        if (count > 100) {
          size = "large";
          icon = "📍";
        } else if (count > 50) {
          size = "medium";
          icon = "📍";
        } else {
          size = "small";
          icon = "📍";
        }

        return L.divIcon({
          html: `
            <div class="cluster cluster-${size} dark-mode-cluster">
              <span>${count}</span>
            </div>
          `,
          className: "cluster-icon",
          iconSize: L.point(40, 40),
        });
      },
    });

    // Add markers for each property
    properties.forEach((property) => {
      if (property.location_latitude && property.location_longitude) {
        const marker = L.marker(
          [
            parseFloat(property.location_latitude),
            parseFloat(property.location_longitude),
          ],
          {
            icon: L.divIcon({
              html: `
                <div class="custom-marker">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4af37" stroke="white" stroke-width="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 9 10 20 10 20s10-11 10-20c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                  </svg>
                </div>
              `,
              className: "custom-marker-icon",
              iconSize: [40, 48],
              iconAnchor: [20, 48],
              popupAnchor: [0, -48],
            }),
          },
        );

        // Get property image
        const imageUrl = property.images?.[0]?.image_url
          ? getImageUrl(property.images[0].image_url)
          : "https://via.placeholder.com/300x200?text=No+Image";

        // Create popup with property image and name
        const popup = L.popup({
          closeButton: true,
          autoClose: false,
          closeOnClick: false,
          maxWidth: 280,
        }).setContent(`
          <div class="map-property-popup">
            <img src="${imageUrl}" alt="${property.title}" class="popup-image" />
            <div class="popup-content">
              <h4 class="popup-title">${property.title}</h4>
              <p class="popup-location">${property.location_city}</p>
              <p class="popup-price">$${parseFloat(property.base_price).toFixed(0)}/night</p>
            </div>
          </div>
        `);

        marker.bindPopup(popup);
        marker.on("mouseover", () => marker.openPopup());
        marker.on("mouseout", () => marker.closePopup());

        // Click to open property
        marker.on("click", () => {
          window.open(`/#/property/${property.id}`, "_blank");
        });

        markersGroup.current.addLayer(marker);
        markersMap.current[property.id] = marker;
      }
    });

    // Add the marker cluster group to the map
    map.current.addLayer(markersGroup.current);

    // Fit bounds to show all markers
    if (properties.length > 0) {
      const bounds = markersGroup.current.getBounds();
      if (bounds.isValid()) {
        map.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      // Cleanup
    };
  }, [properties, selectedLocation]);

  // Expose zoom to marker method
  useImperativeHandle(ref, () => ({
    zoomToProperty: (propertyId) => {
      const marker = markersMap.current[propertyId];
      if (marker && map.current) {
        // Close any open popups
        map.current.closePopup();

        // Zoom to marker with animation
        map.current.setView(marker.getLatLng(), 16, {
          animate: true,
          duration: 1,
        });

        // Open popup
        marker.openPopup();
      }
    },
  }));

  return (
    <div className="w-full h-screen rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700">
      <div
        ref={mapContainer}
        className="w-full h-full bg-slate-50 dark:bg-slate-900"
      />

      <style>{`
        .custom-marker svg {
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
          transition: transform 0.2s ease;
        }

        .custom-marker-icon:hover svg {
          transform: scale(1.15);
          filter: drop-shadow(0 4px 8px rgba(212, 175, 55, 0.4));
        }

        .cluster {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 14px;
        }

        .cluster.cluster-small {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #d4af37, #b8956d);
        }

        .cluster.cluster-medium {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #c9a961, #a68f5e);
          font-size: 16px;
        }

        .cluster.cluster-large {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #b8956d, #8b7355);
          font-size: 18px;
        }

        .dark-mode-cluster {
          background-color: #2d3748;
          color: #f7fafc;
        }

        .cluster-icon {
          background: transparent !important;
        }

        .map-property-popup {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          min-width: 260px;
        }

        .dark .map-property-popup {
          background: #1e293b;
        }

        .popup-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
        }

        .popup-content {
          padding: 12px;
          background: white;
        }

        .dark .popup-content {
          background: #1e293b;
        }

        .popup-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dark .popup-title {
          color: #f1f5f9;
        }

        .popup-location {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .dark .popup-location {
          color: #cbd5e1;
        }

        .popup-price {
          font-size: 13px;
          font-weight: 600;
          color: #d4af37;
          margin: 0;
        }

        .leaflet-popup-content-wrapper {
          background-color: transparent;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          border: none;
          padding: 0;
        }

        .dark .leaflet-popup-content-wrapper {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        .leaflet-popup-tip {
          background-color: white;
          border: none;
        }

        .dark .leaflet-popup-tip {
          background-color: #1e293b;
        }

        .leaflet-container {
          background-color: #f8fafc;
          font-family: inherit;
        }

        .dark .leaflet-container {
          background-color: #0f172a;
        }

        .leaflet-control-attribution {
          background-color: rgba(255, 255, 255, 0.8);
          color: #1e293b;
        }

        .dark .leaflet-control-attribution {
          background-color: rgba(30, 41, 59, 0.8);
          color: #e2e8f0;
        }

        .leaflet-control {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background-color: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }

        .dark .leaflet-control-zoom-in,
        .dark .leaflet-control-zoom-out {
          background-color: #334155;
          color: #e2e8f0;
          border-color: #475569;
        }
      `}</style>
    </div>
  );
});
