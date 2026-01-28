// ========================
// SAFE CURRENCY CONVERSION WRAPPERS
// ========================
// These functions safely call the currency functions from nav-utils.js if available
function safeGetSelectedCurrency() {
  return typeof getSelectedCurrency === "function"
    ? getSelectedCurrency()
    : "USD";
}

function safeGetCurrencySymbol(currency) {
  return typeof getCurrencySymbol === "function"
    ? getCurrencySymbol(currency)
    : "$";
}

function safeConvertPrice(priceInUSD, currency) {
  if (typeof convertPrice === "function" && currency !== "USD") {
    return convertPrice(priceInUSD, currency);
  }
  return priceInUSD;
}

// ========================
// CURRENCY CHANGE LISTENER
// ========================
window.addEventListener("currencyChanged", () => {
  // Re-render properties with new currency
  if (allProperties && allProperties.length > 0) {
    renderProperties(allProperties);
  }
});

// ========================
// INITIALIZATION
// ========================

// DOM Elements
const searchButtons = document.querySelectorAll(".search-button");
const customSelects = document.querySelectorAll(".custom-select");
const dialog = document.getElementById("calendarDialog");

// Get both desktop and mobile inputs
const inputs = {
  desktop: {
    location: document.getElementById("location"),
    fromDate: document.getElementById("fromDate"),
    toDate: document.getElementById("toDate"),
  },
  mobile: {
    location: document.getElementById("location-mobile"),
    fromDate: document.getElementById("fromDate-mobile"),
    toDate: document.getElementById("toDate-mobile"),
  },
};

// State
let map = null;
let markers = {};
let markerClusterGroup = null; // For marker clustering
let allProperties = [];
let selectedLocationCoords = null;
let currentDate = new Date();
let isDialogActive = false;
let selectedDates = { start: null, end: null };

// Extract unique locations from properties
let extractedLocations = [];

function extractLocationsFromProperties() {
  const locations = new Map(); // Use Map to avoid duplicates

  allProperties.forEach((prop) => {
    if (
      prop.location_city &&
      prop.location_latitude &&
      prop.location_longitude
    ) {
      const key = prop.location_city.toLowerCase();
      if (!locations.has(key)) {
        locations.set(key, {
          name: prop.location_city,
          lat: parseFloat(prop.location_latitude),
          lon: parseFloat(prop.location_longitude),
        });
      }
    }
  });

  extractedLocations = Array.from(locations.values());
  console.log("Extracted locations from properties:", extractedLocations);
}

// ========================
// HAVERSINE DISTANCE CALCULATION
// ========================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ========================
// AVERAGE RATING CALCULATION
// ========================

function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 5;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

// ========================
// LOAD PROPERTIES FROM API
// ========================

async function loadProperties() {
  try {
    console.log("🔄 loadProperties() started");
    const response = await fetch("api/property/view.php?list=1");
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      allProperties = data.data.map((prop) => ({
        ...prop,
        rating: getAverageRating(prop.reviews || []),
      }));

      console.log("✅ Properties loaded:", allProperties.length, "properties");

      // Extract unique locations from properties
      extractLocationsFromProperties();

      renderProperties(allProperties);

      // Initialize map IMMEDIATELY after properties are loaded (not before!)
      if (document.getElementById("leafletMap")) {
        console.log(
          "🗺️ Initializing map with",
          allProperties.length,
          "properties"
        );
        initializeMap();
      }
    }
  } catch (error) {
    console.error("❌ Error loading properties:", error);
  }
}

// ========================
// RENDER PROPERTIES TO DOM
// ========================

function getPriceDisplay(basePriceUSD) {
  const selectedCurrency = safeGetSelectedCurrency();
  const currencySymbol = safeGetCurrencySymbol(selectedCurrency);
  let displayPrice = safeConvertPrice(basePriceUSD, selectedCurrency);

  // Ensure displayPrice is a valid number
  if (typeof displayPrice !== "number" || isNaN(displayPrice)) {
    displayPrice = basePriceUSD || 0;
  }

  // Ensure displayPrice is numeric and safe to call toFixed
  displayPrice = parseFloat(displayPrice);
  return currencySymbol + displayPrice.toFixed(0);
}

function renderProperties(properties) {
  const resultsList = document.querySelector(".results-list");
  const resultsCounter = document.getElementById("resultsCounter");

  // Update results counter
  const totalResults = properties.length;
  if (resultsCounter) {
    if (totalResults === 0) {
      resultsCounter.textContent = "No properties found";
    } else if (totalResults === 1) {
      resultsCounter.textContent = "1 property found";
    } else {
      resultsCounter.textContent = `${totalResults} properties found`;
    }
  }

  // Clear the entire results list and rebuild it with real data
  resultsList.innerHTML = "";

  if (properties.length === 0) {
    resultsList.innerHTML =
      '<div style="padding: 40px; text-align: center; grid-column: 1/-1;"><p>No properties available</p></div>';
    return;
  }

  // Create card HTML for each property
  const propertiesHTML = properties
    .map((prop) => {
      const images = prop.images && prop.images.length > 0 ? prop.images : [];
      const firstImage =
        images.length > 0 ? images[0].image_url : "assets/r1.avif";
      const distance = prop.distance
        ? `<span class="room-distance"><i class="fas fa-location-dot"></i> ${(prop.distance * 0.6214).toFixed(
            1
          )} miles away</span>`
        : "";

      const priceDisplay = getPriceDisplay(prop.base_price || 0);

      return `
        <div class="room-card" data-property-id="${prop.id}">
          <img src="${firstImage}" alt="${prop.title}" class="room-image">
          <div class="room-details">
            <h3>${prop.title}</h3>
            <div class="room-meta">
              <span class="location"><i class="fas fa-map-marker-alt"></i> ${
                prop.location_city || prop.location_address || "Location"
              }</span>
              <span class="rating"><i class="fas fa-star"></i> ${
                prop.rating
              }</span>
            </div>
            ${distance}
            <div class="room-features">
              <span><i class="fas fa-bed"></i> ${prop.bedrooms || 2} Beds</span>
              <span><i class="fas fa-bath"></i> ${
                prop.bathrooms || 1
              } Bath</span>
              <span><i class="fas fa-wifi"></i> WiFi</span>
            </div>
            <div class="room-price-section">
              <div class="room-price">
                <span class="price">${priceDisplay}</span>
                <span class="per-night">per night</span>
              </div>
              <div class="room-actions">
                <button class="share-btn-room" onclick="openShareMenuRoom(event, ${
                  prop.id
                }, '${prop.title.replace(/'/g, "\\'")}')">
                  <i class="fas fa-share-alt"></i>
                </button>
                <button class="book-now-btn" onclick="viewProperty(${
                  prop.id
                })">View</button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // Insert all properties at once
  resultsList.insertAdjacentHTML("afterbegin", propertiesHTML);

  // Add event handlers to dynamically loaded cards
  document.querySelectorAll(".room-card[data-property-id]").forEach((card) => {
    const propId = card.getAttribute("data-property-id");

    // Click to highlight and focus
    card.addEventListener("click", () => {
      highlightCardAndMarker(propId);
    });

    // Hover to highlight marker
    card.addEventListener("mouseenter", () => {
      highlightMarker(propId);
      card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
      unhighlightMarker(propId);
      card.classList.remove("hovered");
    });
  });
}

function viewProperty(propId) {
  // Redirect to property details page
  window.location.href = `viewlisting.html?id=${propId}`;
}
// ========================
// INITIALIZE LEAFLET MAP
// ========================

function initializeMap() {
  console.log(
    "🗺️ initializeMap() called with",
    allProperties.length,
    "properties"
  );

  const mapContainer = document.getElementById("leafletMap");
  if (!mapContainer) {
    console.error("❌ Map container not found");
    return;
  }

  try {
    // If map already exists, clear markers and reinitialize
    if (map) {
      console.log("📍 Map already exists, clearing old markers...");
      markers = {}; // Clear markers object
      if (markerClusterGroup) {
        markerClusterGroup.clearLayers();
      }
      // Don't reinitialize Leaflet, just re-add markers
      allProperties.forEach((prop) => {
        const lat = parseFloat(prop.location_latitude);
        const lng = parseFloat(prop.location_longitude);

        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          prop.location_latitude = lat;
          prop.location_longitude = lng;
          addMarkerToMap(prop);
        }
      });

      if (Object.keys(markers).length > 0) {
        const bounds = L.latLngBounds(
          Object.values(markers).map((m) => m.getLatLng())
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      console.log(
        "✅ Map markers updated:",
        Object.keys(markers).length,
        "markers"
      );
      return;
    }

    // Initialize map centered on India - zoomed out to see more area
    map = L.map("leafletMap", {
      center: [20.5937, 78.9629],
      zoom: 1,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    console.log("✅ Leaflet map initialized");

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    console.log("✅ OpenStreetMap tiles added");

    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 200, // Increased from 80 to 200px (~500-750m at typical zoom levels)
      chunkedLoading: true,
    });
    map.addLayer(markerClusterGroup);
    console.log("✅ Marker cluster group initialized");

    // Add markers for all properties
    allProperties.forEach((prop) => {
      // Ensure coordinates are numbers and valid
      const lat = parseFloat(prop.location_latitude);
      const lng = parseFloat(prop.location_longitude);

      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        // Update prop with parsed coordinates for consistency
        prop.location_latitude = lat;
        prop.location_longitude = lng;
        addMarkerToMap(prop);
      }
    });

    console.log("📊 Total markers added:", Object.keys(markers).length);

    // Fit all markers in view
    if (Object.keys(markers).length > 0) {
      const bounds = L.latLngBounds(
        Object.values(markers).map((m) => m.getLatLng())
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      console.log("🎯 Map bounds fitted to show all markers");
    } else {
      console.warn("⚠️ No valid markers to display");
    }

    map.invalidateSize();
    console.log("✅ Map invalidateSize called - map ready!");
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

// ========================
// ADD MARKER TO MAP
// ========================

function addMarkerToMap(prop) {
  // Validate and parse coordinates
  const lat = parseFloat(prop.location_latitude);
  const lng = parseFloat(prop.location_longitude);

  // Skip if coordinates are invalid
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    console.warn(
      `Invalid coordinates for property ${prop.id}: lat=${lat}, lng=${lng}`
    );
    return;
  }

  // Create a flag-style marker icon with SVG - BIGGER SIZE
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-flag">
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Flag pole -->
          <line x1="20" y1="40" x2="20" y2="14" stroke="#333" stroke-width="2"/>
          <!-- Flag shape - bigger -->
          <path d="M 20 14 Q 23 14 28 17 Q 25 18 28 20 Q 23 23 20 23 Z" fill="#0a7c59" stroke="#0a7c59" stroke-width="1.2"/>
          <!-- Home icon inside flag - bigger -->
          <path d="M 21 17 L 24 15 L 24 19 L 21 19 Z" fill="white" stroke="white" stroke-width="0.7"/>
        </svg>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  const marker = L.marker([lat, lng], {
    icon: customIcon,
  }).bindPopup(
    `<div style="font-family: Poppins; font-size: 14px;">
        <strong>${prop.title}</strong><br/>
        <span style="color: #0a7c59; font-weight: 600;">₹${prop.base_price}/night</span>
      </div>`,
    { maxWidth: 250 }
  );

  marker.propertyId = prop.id;
  marker.on("click", () => highlightCardAndMarker(prop.id));

  // Add hover effects to marker
  marker.on("mouseover", () => {
    highlightMarker(prop.id);
  });

  marker.on("mouseout", () => {
    unhighlightMarker(prop.id);
  });

  // Add marker to cluster group instead of directly to map
  if (markerClusterGroup) {
    markerClusterGroup.addLayer(marker);
  }

  markers[prop.id] = marker;
  console.log(`🔧 addMarkerToMap() called for property:`, prop.id, prop.title);
  console.log(`  Parsed coordinates: lat=${lat}, lng=${lng}`);
  console.log(
    `  ✅ Marker created and added to cluster for property ${prop.id}`
  );
  console.log(
    `  ✅ Marker stored in markers object. Total markers:`,
    Object.keys(markers).length
  );
}

// ========================
// HIGHLIGHT FUNCTIONS
// ========================

function highlightMarker(propId) {
  if (!markers[propId]) return;

  const marker = markers[propId];
  const highlightIcon = L.divIcon({
    className: "custom-marker highlighted",
    html: `
      <div class="marker-flag highlighted">
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Flag pole -->
          <line x1="20" y1="40" x2="20" y2="14" stroke="#333" stroke-width="2"/>
          <!-- Flag shape highlighted - bigger -->
          <path d="M 20 14 Q 23 14 28 17 Q 25 18 28 20 Q 23 23 20 23 Z" fill="#ff6b6b" stroke="#ff6b6b" stroke-width="1.2"/>
          <!-- Home icon inside flag - bigger -->
          <path d="M 21 17 L 24 15 L 24 19 L 21 19 Z" fill="white" stroke="white" stroke-width="0.7"/>
        </svg>
        <div class="marker-pulse highlighted"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
  marker.setIcon(highlightIcon);
}

function unhighlightMarker(propId) {
  if (!markers[propId]) return;

  const marker = markers[propId];
  const normalIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-flag">
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Flag pole -->
          <line x1="20" y1="40" x2="20" y2="14" stroke="#333" stroke-width="2"/>
          <!-- Flag shape - bigger -->
          <path d="M 20 14 Q 23 14 28 17 Q 25 18 28 20 Q 23 23 20 23 Z" fill="#0a7c59" stroke="#0a7c59" stroke-width="1.2"/>
          <!-- Home icon inside flag - bigger -->
          <path d="M 21 17 L 24 15 L 24 19 L 21 19 Z" fill="white" stroke="white" stroke-width="0.7"/>
        </svg>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
  marker.setIcon(normalIcon);
}

function highlightCardAndMarker(propId) {
  // Remove previous highlights from all cards
  document.querySelectorAll(".room-card.highlighted").forEach((card) => {
    card.classList.remove("highlighted");
  });

  // Unhighlight all markers
  Object.keys(markers).forEach((id) => {
    unhighlightMarker(id);
  });

  // Highlight selected card
  const card = document.querySelector(
    `.room-card[data-property-id="${propId}"]`
  );
  if (card) {
    card.classList.add("highlighted");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Highlight selected marker
  highlightMarker(propId);

  // Pan and zoom map to marker
  if (markers[propId]) {
    map.setView(markers[propId].getLatLng(), 18, {
      animate: true,
      duration: 1,
    });
  }
}

// ========================
// SORT PROPERTIES BY DISTANCE
// ========================

function sortByDistance(lat, lon) {
  if (!lat || !lon) return allProperties;

  return allProperties
    .map((prop) => ({
      ...prop,
      distance: calculateDistance(
        lat,
        lon,
        prop.location_latitude,
        prop.location_longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// ========================
// LOCATION DROPDOWN INITIALIZATION
// ========================

function initLocationDropdown() {
  let searchTimeout;

  // Handle input changes for both desktop and mobile
  [inputs.desktop.location, inputs.mobile.location].forEach((input) => {
    if (!input) return;

    // Show dropdown on focus
    input.addEventListener("focus", () => {
      const dropdown = input.closest(".custom-select");
      if (dropdown) {
        dropdown.classList.add("active");
      }
    });

    // Search as user types
    input.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      const dropdown = input.closest(".custom-select");
      if (!dropdown) return;

      const list = dropdown.querySelector(".location-list");
      if (!list) return;

      // Clear previous timeout
      clearTimeout(searchTimeout);

      // Only show dropdown if user has typed something
      if (query.length === 0) {
        dropdown.classList.remove("active");
        list.innerHTML = "";
        return;
      }

      // Dropdown should be visible while typing
      dropdown.classList.add("active");

      if (query.length < 2) {
        list.innerHTML =
          '<div style="padding: 12px; color: #999; text-align: center; font-size: 13px;"><i class="fas fa-keyboard"></i> Type at least 2 characters...</div>';
        return;
      }

      // Show loading state
      list.innerHTML =
        '<div style="padding: 12px; color: #999; text-align: center; font-size: 13px;"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';

      // Search with a small delay to avoid too many requests
      searchTimeout = setTimeout(() => {
        searchLocations(list, input, query);
      }, 400);
    });

    // Close dropdown on blur
    input.addEventListener("blur", () => {
      setTimeout(() => {
        const dropdown = input.closest(".custom-select");
        if (dropdown) {
          dropdown.classList.remove("active");
        }
      }, 200);
    });
  });

  async function searchLocations(list, input, query) {
    try {
      // Use our PHP proxy endpoint to avoid CORS issues
      const response = await fetch(
        `api/search-location.php?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();

      if (!Array.isArray(results) || results.length === 0) {
        list.innerHTML =
          '<div style="padding: 12px; color: #999; text-align: center; font-size: 13px;">No locations found</div>';
        return;
      }

      displaySuggestions(list, input, results.slice(0, 5));
    } catch (error) {
      console.error("Error searching locations:", error);
      list.innerHTML =
        '<div style="padding: 12px; color: #d9534f; text-align: center; font-size: 13px;">Error searching. Please try again.</div>';
    }
  }

  function displaySuggestions(list, input, results) {
    list.innerHTML = results
      .map((result) => {
        const displayName = result.name || result.address || "";
        const address = result.address || "";
        return `
      <div class="location-option nominatim-suggestion" data-lat="${
        result.lat
      }" data-lon="${result.lon}" title="${displayName}">
        <i class="fas fa-map-marker-alt"></i>
        <div>
          <strong>${displayName}</strong>
          <small>${address.substring(0, 50)}${
          address.length > 50 ? "..." : ""
        }</small>
        </div>
      </div>
    `;
      })
      .join("");

    list.querySelectorAll(".nominatim-suggestion").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lat = option.getAttribute("data-lat");
        const lon = option.getAttribute("data-lon");
        const mainText = option.querySelector("strong").textContent;
        applyLocationSelection(input, mainText, lat, lon);
      });
    });
  }

  function applyLocationSelection(input, locName, lat, lon) {
    selectedLocationCoords = { lat: parseFloat(lat), lon: parseFloat(lon) };
    inputs.desktop.location.value = locName;
    inputs.mobile.location.value = locName;

    // Close dropdown
    const dropdown = input.closest(".custom-select");
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    // Don't close mobile dialog here - only close it when search button is clicked
    // User should be able to select location without dialog closing

    // Sort and render properties by distance
    const sorted = sortByDistance(parseFloat(lat), parseFloat(lon));

    // Clear old property cards (keep dummies)
    document
      .querySelectorAll(".room-card[data-property-id]")
      .forEach((card) => {
        card.remove();
      });

    // Render sorted properties
    renderProperties(sorted);

    // Update map center and zoom to fit all markers
    if (map) {
      const filteredProps = sorted.filter(
        (p) => p.location_latitude && p.location_longitude
      );

      if (filteredProps.length > 0) {
        // Create bounds from all filtered properties
        const bounds = L.latLngBounds(
          filteredProps.map((p) => [
            parseFloat(p.location_latitude),
            parseFloat(p.location_longitude),
          ])
        );

        // Fit map to bounds with padding
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } else {
        // No properties in this location, just pan to the searched location
        map.setView([parseFloat(lat), parseFloat(lon)], 10, {
          animate: true,
          duration: 0.8,
        });
      }
    }

    localStorage.setItem("selectedLocation", locName);
    localStorage.setItem(
      "selectedCoords",
      JSON.stringify({ lat: parseFloat(lat), lon: parseFloat(lon) })
    );
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    customSelects.forEach((select) => {
      if (!select.contains(e.target)) {
        select.classList.remove("active");
      }
    });
  });
}

// ========================
// DATE PICKER INITIALIZATION
// ========================

function initDateInputs() {
  const calendarDialog = document.getElementById("calendarDialog");
  const calendarDays = document.getElementById("calendarDays");
  const monthYear = document.getElementById("monthYear");

  const saved = JSON.parse(localStorage.getItem("chosenDates")) || {};
  if (saved.from) {
    selectedDates.start = new Date(saved.from);
    if (inputs.desktop.fromDate) {
      inputs.desktop.fromDate.value = selectedDates.start.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
    }
    if (inputs.mobile.fromDate) {
      inputs.mobile.fromDate.value = selectedDates.start.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
    }
  }
  if (saved.to) {
    selectedDates.end = new Date(saved.to);
    if (inputs.desktop.toDate) {
      inputs.desktop.toDate.value = selectedDates.end.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
    }
    if (inputs.mobile.toDate) {
      inputs.mobile.toDate.value = selectedDates.end.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
    }
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    let html = "";
    for (let i = 0; i < startingDayOfWeek; i++) {
      html += `<div class="calendar-day other-month"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected =
        (selectedDates.start &&
          date.toDateString() === selectedDates.start.toDateString()) ||
        (selectedDates.end &&
          date.toDateString() === selectedDates.end.toDateString());
      const isBetween =
        selectedDates.start &&
        selectedDates.end &&
        date > selectedDates.start &&
        date < selectedDates.end;

      let className = "calendar-day";
      if (isToday) className += " today";
      if (isSelected) className += " selected";
      if (isBetween) className += " between";

      html += `
        <div class="${className}" data-date="${date.toISOString()}" onclick="selectDate(this)">
          ${day}
        </div>
      `;
    }

    calendarDays.innerHTML = html;
  }

  window.selectDate = function (element) {
    const date = new Date(element.getAttribute("data-date"));

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      selectedDates.start = date;
      selectedDates.end = null;
    } else {
      if (date < selectedDates.start) {
        selectedDates.end = selectedDates.start;
        selectedDates.start = date;
      } else {
        selectedDates.end = date;
      }
    }

    localStorage.setItem(
      "chosenDates",
      JSON.stringify({
        from: selectedDates.start?.toISOString(),
        to: selectedDates.end?.toISOString(),
      })
    );

    [inputs.desktop.fromDate, inputs.mobile.fromDate].forEach((input) => {
      if (input && selectedDates.start) {
        input.value = selectedDates.start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    });

    [inputs.desktop.toDate, inputs.mobile.toDate].forEach((input) => {
      if (input && selectedDates.end) {
        input.value = selectedDates.end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    });

    renderCalendar();
  };

  document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  [inputs.desktop.fromDate, inputs.desktop.toDate].forEach((input) => {
    if (input) {
      input.addEventListener("click", () => {
        calendarDialog.showModal();
        isDialogActive = true;
      });
    }
  });

  [inputs.mobile.fromDate, inputs.mobile.toDate].forEach((input) => {
    if (input) {
      input.addEventListener("click", () => {
        calendarDialog.showModal();
        isDialogActive = true;
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (isDialogActive && e.target === calendarDialog) {
      calendarDialog.close();
      isDialogActive = false;
    }
  });

  renderCalendar();
}

// ========================
// MOBILE SEARCH DIALOG
// ========================

function initMobileSearch() {
  console.log("=== initMobileSearch() called ===");

  const mobileSearchDialog = document.getElementById("mobileSearchDialog");
  console.log("Mobile search dialog found:", !!mobileSearchDialog);

  // Try to find and setup open button
  const openSearchButton = document.getElementById("openSearchDialog");
  console.log("Open search button element:", openSearchButton);
  console.log("Open search button ID found:", !!openSearchButton);

  if (openSearchButton) {
    console.log("Adding click listener to open button");
    openSearchButton.addEventListener("click", (e) => {
      console.log("FLOATING SEARCH BUTTON CLICKED!");
      e.preventDefault();
      e.stopPropagation();
      if (mobileSearchDialog) {
        console.log("Setting mobileSearchDialog.classList to show");
        mobileSearchDialog.classList.add("show");
        console.log(
          "Mobile search dialog opened - class list:",
          mobileSearchDialog.className
        );
      } else {
        console.error("mobileSearchDialog is null/undefined");
      }
    });
    console.log("Click listener added successfully");
  } else {
    console.error(
      "❌ Open search button (openSearchDialog) NOT FOUND - checking all buttons with class .float-search-button"
    );
    const allFloatButtons = document.querySelectorAll(".float-search-button");
    console.log(
      "Found",
      allFloatButtons.length,
      "buttons with class .float-search-button"
    );
    allFloatButtons.forEach((btn, idx) => {
      console.log(`Button ${idx}:`, btn);
      btn.addEventListener("click", (e) => {
        console.log("FLOAT BUTTON (via class) CLICKED!");
        e.preventDefault();
        e.stopPropagation();
        if (mobileSearchDialog) {
          mobileSearchDialog.classList.add("show");
          console.log("Dialog opened via class button");
        }
      });
    });
  }

  // Try to find and setup close button
  const closeSearchButton = document.getElementById("closeSearchDialog");
  console.log("Close search button element:", closeSearchButton);
  console.log("Close search button ID found:", !!closeSearchButton);

  if (closeSearchButton) {
    console.log("Adding click listener to close button");
    closeSearchButton.addEventListener("click", (e) => {
      console.log("CLOSE BUTTON CLICKED!");
      e.preventDefault();
      e.stopPropagation();
      if (mobileSearchDialog) {
        console.log("Removing show class from dialog");
        mobileSearchDialog.classList.remove("show");
        console.log("Mobile search dialog closed");
      }
    });
  } else {
    console.warn("Close search button (closeSearchDialog) not found");
  }

  console.log("=== initMobileSearch() completed ===\n");
}

// ========================
// INITIALIZE ON LOAD
// ========================

// Check for imported wishlist from shared link
function checkAndImportSharedWishlist() {
  const params = new URLSearchParams(window.location.search);
  const importedWishlist = params.get("import_wishlist");

  if (importedWishlist) {
    try {
      // Decode the wishlist data
      const wishlistData = JSON.parse(decodeURIComponent(importedWishlist));

      // Call the handler function that checks if wishlist exists
      handleSharedWishlist(wishlistData);
    } catch (error) {
      console.error("Error importing shared wishlist:", error);
    }
  }
}

// Handle shared wishlist - add to localStorage if doesn't exist and open modal
async function handleSharedWishlist(wishlistData) {
  try {
    const authData = localStorage.getItem("guestAuth");

    // Check if wishlist already exists
    let wishlistExists = false;
    let existingLocation = "";

    if (authData) {
      // User is logged in - check database wishlists
      try {
        const response = await fetch("api/wishlist/list.php");
        const result = await response.json();

        if (result.success && Array.isArray(result.wishlists)) {
          wishlistExists = result.wishlists.some(
            (w) => w.list_name === wishlistData.list_name
          );
          if (wishlistExists) {
            existingLocation = "your account";
          }
        }
      } catch (error) {
        console.error("Error checking database wishlists:", error);
      }
    }

    // Also check localStorage
    if (!wishlistExists) {
      const localWishlists = getLocalWishlists();
      wishlistExists = localWishlists.some(
        (w) => w.list_name === wishlistData.list_name
      );
      if (wishlistExists) {
        existingLocation = "your saved wishlists";
      }
    }

    if (wishlistExists) {
      // Show message that wishlist already exists
      alert(
        `"${wishlistData.list_name}" already exists in ${existingLocation}. Opening your saved wishlists...`
      );
    } else {
      // Create new wishlist
      if (authData) {
        // Add to database
        await importWishlistToDatabase(wishlistData);
      } else {
        // Add to localStorage
        await importWishlistToLocalStorage(wishlistData);
      }
    }

    // Open the saved properties modal
    if (typeof openSavedPropertiesModal === "function") {
      openSavedPropertiesModal();
    } else {
      console.warn("openSavedPropertiesModal function not found");
    }

    // Clean up the URL - remove the import_wishlist parameter
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (error) {
    console.error("Error handling shared wishlist:", error);
  }
}

// Import wishlist to database for logged-in users
async function importWishlistToDatabase(wishlistData) {
  try {
    // First, create the list
    const createFormData = new FormData();
    createFormData.append("list_name", wishlistData.list_name);

    const createResponse = await fetch("api/wishlist/create_list.php", {
      method: "POST",
      body: createFormData,
    });

    const createResult = await createResponse.json();

    if (!createResult.success) {
      console.error("Error creating wishlist:", createResult.message);
      alert("Error importing wishlist: " + createResult.message);
      return;
    }

    const listId = createResult.list_id;

    // Then add all properties
    let addedCount = 0;
    for (const propertyId of wishlistData.properties) {
      try {
        const addFormData = new FormData();
        addFormData.append("wishlist_id", listId);
        addFormData.append("property_id", propertyId);

        const addResponse = await fetch("api/wishlist/add_property.php", {
          method: "POST",
          body: addFormData,
        });

        const addResult = await addResponse.json();

        if (addResult.success) {
          addedCount++;
        }
      } catch (error) {
        console.error("Error adding property " + propertyId, error);
      }
    }

    console.log(
      "Created shared wishlist in database:",
      wishlistData.list_name,
      "with",
      addedCount,
      "properties"
    );
  } catch (error) {
    console.error("Error importing wishlist to database:", error);
    alert("Error importing wishlist. Please try again.");
  }
}

// Import wishlist to localStorage for logged-out users
function importWishlistToLocalStorage(wishlistData) {
  try {
    let wishlists = getLocalWishlists();

    // Create new wishlist with imported data
    const newList = {
      id: "local_" + Date.now(),
      list_name: wishlistData.list_name,
      properties: wishlistData.properties || [],
      created_at: new Date().toISOString(),
    };

    wishlists.push(newList);
    localStorage.setItem("wishlists", JSON.stringify(wishlists));

    console.log(
      "Created shared wishlist in localStorage:",
      wishlistData.list_name,
      "with",
      newList.properties.length,
      "properties"
    );
  } catch (error) {
    console.error("Error importing wishlist to localStorage:", error);
    alert("Error importing wishlist. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check for location URL parameter and store it in localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocation = urlParams.get("location");
  searchAndSetLocationCoords(urlLocation);

  if (urlLocation) {
    // Store the location from URL param in localStorage
    localStorage.setItem("selectedLocation", urlLocation);
    console.log("Location from URL param:", urlLocation);
  }

  // Wait for nav modules to load before using functions from nav-utils
  if (typeof navModulesLoaded !== "undefined") {
    navModulesLoaded
      .then(() => {
        checkAndImportSharedWishlist();
        // Load properties with correct currency after nav-utils is available
        loadProperties();
      })
      .catch(() => {
        // If nav modules fail to load, still proceed without wishlist import
        console.warn("Nav modules failed to load, skipping wishlist import");
        loadProperties();
      });
  } else {
    // Fallback if navModulesLoaded is not available
    loadProperties();
    setTimeout(() => {
      if (typeof getLocalWishlists === "function") {
        checkAndImportSharedWishlist();
      }
    }, 500);
  }

  initLocationDropdown();
  initDateInputs();
  initMobileSearch();
  initSearchButtons();

  // Initialize with geolocation after properties are loaded
  setTimeout(() => {
    initializeWithGeolocation();
  }, 500);
});

// ========================
// SEARCH BUTTON HANDLER
// ========================

function initSearchButtons() {
  const searchButtons = document.querySelectorAll(".search-button");

  searchButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
    });
  });
}

function performSearch() {
  const location =
    inputs.desktop.location.value.trim() || inputs.mobile.location.value.trim();
  const fromDate =
    inputs.desktop.fromDate.value || inputs.mobile.fromDate.value;
  const toDate = inputs.desktop.toDate.value || inputs.mobile.toDate.value;

  // Store search parameters in localStorage
  if (location) {
    localStorage.setItem("selectedLocation", location);
  }
  if (fromDate && toDate && selectedDates.start && selectedDates.end) {
    localStorage.setItem(
      "chosenDates",
      JSON.stringify({
        from: selectedDates.start.toISOString(),
        to: selectedDates.end.toISOString(),
      })
    );

    // If dates are selected, enable availability filtering
    advancedFilters.filter_availability = true;

    // Apply advanced filters with dates
    console.log("Dates selected, applying availability filter");
    applyAdvancedFiltersWithoutModal();

    // Close mobile search dialog after search
    const mobileDialog = document.getElementById("mobileSearchDialog");
    if (mobileDialog && mobileDialog.classList.contains("show")) {
      mobileDialog.classList.remove("show");
    }
    return;
  }

  // FORCEFULLY UPDATE COORDINATES based on selectedLocation
  if (location) {
    console.log(
      "Search button pressed - forcefully updating coordinates for:",
      location
    );

    // Try to fetch new coordinates for the location
    fetchAndUpdateCoordinates(location).then((newCoords) => {
      if (newCoords && newCoords.lat && newCoords.lon) {
        console.log("New coordinates fetched:", newCoords);

        // Update global variable
        selectedLocationCoords = newCoords;

        // Update localStorage
        localStorage.setItem("selectedCoords", JSON.stringify(newCoords));

        // Re-render with new coordinates
        renderSearchResults(newCoords);
      } else {
        // Fallback to old coordinates if new ones not found
        console.log("Could not fetch new coordinates, using old ones");

        if (
          selectedLocationCoords &&
          selectedLocationCoords.lat &&
          selectedLocationCoords.lon
        ) {
          renderSearchResults(selectedLocationCoords);
        } else {
          console.warn("No coordinates available, showing all properties");
          showAllProperties();
        }
      }
    });
    return;
  }

  // No location provided
  console.log("No location selected, showing all properties");
  showAllProperties();
}

// Helper function to fetch and update coordinates
async function fetchAndUpdateCoordinates(locationName) {
  try {
    const response = await fetch(
      `api/search-location.php?q=${encodeURIComponent(locationName)}`
    );

    if (!response.ok) {
      console.warn("Failed to fetch coordinates for:", locationName);
      return null;
    }

    const results = await response.json();

    if (Array.isArray(results) && results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);

      if (!isNaN(lat) && !isNaN(lon)) {
        console.log(
          `Coordinates found for "${locationName}": (${lat}, ${lon})`
        );
        return { lat, lon };
      }
    }

    console.warn("No valid coordinates found for:", locationName);
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

// Helper function to render search results
function renderSearchResults(coords) {
  console.log("Rendering search results with coordinates:", coords);

  // Sort properties by distance
  const sorted = sortByDistance(coords.lat, coords.lon);

  // Clear old property cards
  document.querySelectorAll(".room-card[data-property-id]").forEach((card) => {
    card.remove();
  });

  // Render sorted properties
  renderProperties(sorted);

  // Update map center and zoom to fit all markers
  if (map) {
    const filteredProps = sorted.filter(
      (p) => p.location_latitude && p.location_longitude
    );

    if (filteredProps.length > 0) {
      const bounds = L.latLngBounds(
        filteredProps.map((p) => [
          parseFloat(p.location_latitude),
          parseFloat(p.location_longitude),
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }

  // Scroll to results
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: "smooth" });
  }

  // Close mobile search dialog after search
  const mobileDialog = document.getElementById("mobileSearchDialog");
  if (mobileDialog && mobileDialog.classList.contains("show")) {
    mobileDialog.classList.remove("show");
  }
}

// Helper function to show all properties
function showAllProperties() {
  // Clear old property cards
  document.querySelectorAll(".room-card[data-property-id]").forEach((card) => {
    card.remove();
  });

  // Render all properties
  renderProperties(allProperties);

  // Fit map to show all properties
  if (map && Object.keys(markers).length > 0) {
    const bounds = L.latLngBounds(
      Object.values(markers).map((m) => m.getLatLng())
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }

  // Scroll to results
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: "smooth" });
  }

  // Close mobile search dialog after search
  const mobileDialog = document.getElementById("mobileSearchDialog");
  if (mobileDialog && mobileDialog.classList.contains("show")) {
    mobileDialog.classList.remove("show");
  }
}

// Helper function to get user location from IP
async function getUserLocationFromIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const data = await response.json();
      return {
        lat: data.latitude,
        lon: data.longitude,
      };
    }
  } catch (error) {
    console.error("Error getting location from IP:", error);
  }
  return null;
}

// ========================
// LOCATION COORDINATE DETECTION
// ========================

// Search for location coordinates and apply filtering
async function searchAndSetLocationCoords(locationName) {
  try {
    console.log("Searching for location coordinates:", locationName);

    // Search using the API
    const response = await fetch(
      `api/search-location.php?q=${encodeURIComponent(locationName)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();

    if (Array.isArray(results) && results.length > 0) {
      const result = results[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.warn("Invalid coordinates for location:", locationName);
        // Fallback to showing all properties if coordinates are invalid
        showAllPropertiesWithMessage(
          "Could not determine exact location coordinates"
        );
        return;
      }

      // Set the location coordinates
      selectedLocationCoords = { lat, lon };
      console.log(`Location found: ${result.name} (${lat}, ${lon})`);

      // Sort and render properties by distance
      const sorted = sortByDistance(lat, lon);

      // Clear old property cards
      document
        .querySelectorAll(".room-card[data-property-id]")
        .forEach((card) => {
          card.remove();
        });

      // Render sorted properties
      renderProperties(sorted);

      // Fit map to show all properties in that location
      if (map) {
        const filteredProps = sorted.filter(
          (p) => p.location_latitude && p.location_longitude
        );
        if (filteredProps.length > 0) {
          const bounds = L.latLngBounds(
            filteredProps.map((p) => [
              parseFloat(p.location_latitude),
              parseFloat(p.location_longitude),
            ])
          );
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
      }

      // Scroll to results
      const resultsContainer = document.querySelector(".results-container");
      if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: "smooth" });
      }

      // Save coordinates to localStorage
      localStorage.setItem("selectedCoords", JSON.stringify({ lat, lon }));
      localStorage.setItem("selectedLocation", locationName);
    } else {
      console.warn("No location found for:", locationName);
      showAllPropertiesWithMessage(
        `No exact location found for "${locationName}". Showing all properties.`
      );
    }
  } catch (error) {
    console.error("Error searching for location coordinates:", error);
    showAllPropertiesWithMessage(
      "Error searching for location. Showing all properties."
    );
  }
}

// Show all properties with an optional message
function showAllPropertiesWithMessage(message) {
  console.log(message);

  // Clear old property cards
  document.querySelectorAll(".room-card[data-property-id]").forEach((card) => {
    card.remove();
  });

  // Render all properties
  renderProperties(allProperties);

  // Fit map to show all properties
  if (map && Object.keys(markers).length > 0) {
    const bounds = L.latLngBounds(
      Object.values(markers).map((m) => m.getLatLng())
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }

  // Scroll to results
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: "smooth" });
  }
}

// ========================
// VIEW PROPERTY HANDLER
// ========================

function viewProperty(propertyId) {
  // Store the property ID in localStorage
  localStorage.setItem("selectedPropertyId", propertyId);
  // Navigate to viewlisting page
  window.location.href = `viewlisting.html?id=${propertyId}`;
}

// ========================
// LOCATION COORDINATE VALIDATION
// ========================

// Validate that coordinates are reasonably close to the location
async function validateAndFixCoordinates(locationName, lat, lon) {
  try {
    // Search for the correct coordinates for this location
    const response = await fetch(
      `api/search-location.php?q=${encodeURIComponent(locationName)}`
    );

    if (!response.ok) {
      console.warn("Could not validate coordinates");
      return { lat, lon }; // Return original coordinates if validation fails
    }

    const results = await response.json();

    if (Array.isArray(results) && results.length > 0) {
      const correctLat = parseFloat(results[0].lat);
      const correctLon = parseFloat(results[0].lon);

      // Calculate distance between stored and correct coordinates
      const distance = calculateDistance(lat, lon, correctLat, correctLon);

      console.log(`Coordinate validation for "${locationName}":`, {
        stored: { lat, lon },
        correct: { lat: correctLat, lon: correctLon },
        distance: distance + " km",
      });

      // If distance is more than 50km, coordinates are incorrect
      if (distance > 50) {
        console.warn(
          `Coordinates are ${distance.toFixed(
            1
          )} km away from actual location. Using corrected coordinates.`
        );
        return { lat: correctLat, lon: correctLon };
      }

      // Coordinates are reasonably close
      return { lat, lon };
    }

    return { lat, lon };
  } catch (error) {
    console.error("Error validating coordinates:", error);
    return { lat, lon }; // Return original if validation fails
  }
}

// ========================
// GEOLOCATION INITIALIZATION
// ========================

async function initializeWithGeolocation() {
  try {
    // Initialize map first
    if (!map && document.getElementById("leafletMap")) {
      initializeMap();
    }

    // SCENARIO 1: Check URL parameter for location (?location="...")
    const urlParams = new URLSearchParams(window.location.search);
    const urlLocation = urlParams.get("location");

    if (urlLocation) {
      console.log("Location from URL parameter:", urlLocation);
      localStorage.setItem("selectedLocation", urlLocation);

      // Search for coordinates of the location
      await searchAndSetLocationCoords(urlLocation);
      return;
    }

    // SCENARIO 2: Check if there are coordinates in localStorage (from previous or index search)
    const savedCoordsStr = localStorage.getItem("selectedCoords");
    const savedLocation = localStorage.getItem("selectedLocation");

    if (savedCoordsStr && savedLocation) {
      console.log("Found location in localStorage:", savedLocation);

      try {
        const coords = JSON.parse(savedCoordsStr);

        // Check if coordinates are valid (not null)
        if (coords.lat && coords.lon) {
          const lat = parseFloat(coords.lat);
          const lon = parseFloat(coords.lon);

          console.log("Using coordinates from localStorage:", lat, lon);

          // Validate that coordinates match the location name
          const validatedCoords = await validateAndFixCoordinates(
            savedLocation,
            lat,
            lon
          );

          console.log("Validated coordinates:", validatedCoords);

          // Set location inputs
          inputs.desktop.location.value = savedLocation;
          inputs.mobile.location.value = savedLocation;

          // Set location coordinates (use validated coordinates)
          selectedLocationCoords = validatedCoords;

          // Update localStorage if coordinates were corrected
          if (validatedCoords.lat !== lat || validatedCoords.lon !== lon) {
            localStorage.setItem(
              "selectedCoords",
              JSON.stringify(validatedCoords)
            );
            console.log("Updated coordinates in localStorage", validatedCoords);
          }

          // Sort and render properties by distance
          const sorted = sortByDistance(
            validatedCoords.lat,
            validatedCoords.lon
          );

          // Clear old property cards
          document
            .querySelectorAll(".room-card[data-property-id]")
            .forEach((card) => {
              card.remove();
            });

          // Render sorted properties
          renderProperties(sorted);

          // Fit map to show all properties in that location
          if (map) {
            const filteredProps = sorted.filter(
              (p) => p.location_latitude && p.location_longitude
            );
            if (filteredProps.length > 0) {
              const bounds = L.latLngBounds(
                filteredProps.map((p) => [
                  parseFloat(p.location_latitude),
                  parseFloat(p.location_longitude),
                ])
              );
              map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
            }
          }
          return;
        } else {
          // Coordinates are null/empty, need to search for them
          console.log(
            "Coordinates are empty, searching for location:",
            savedLocation
          );
          await searchAndSetLocationCoords(savedLocation);
          return;
        }
      } catch (error) {
        console.error("Error parsing saved coordinates:", error);
      }
    }

    // SCENARIO 3: No location found, show all properties
    console.log("No saved location found, showing all properties");

    // Clear old property cards
    document
      .querySelectorAll(".room-card[data-property-id]")
      .forEach((card) => {
        card.remove();
      });

    // Render all properties
    renderProperties(allProperties);

    // Fit map to show all properties
    if (map && Object.keys(markers).length > 0) {
      const bounds = L.latLngBounds(
        Object.values(markers).map((m) => m.getLatLng())
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  } catch (error) {
    console.log("Geolocation error (non-critical):", error);
    // Initialize map with default location
    if (document.getElementById("leafletMap")) {
      initializeMap();
    }
  }
}

// ========================
// SHARE FUNCTIONALITY
// ========================

function openShareMenuRoom(e, propertyId, propertyTitle) {
  e.stopPropagation();

  const url = `${window.location.origin}/viewlisting.html?id=${propertyId}`;
  const text = `Check out this amazing property: ${propertyTitle}`;

  const menu = document.createElement("div");
  menu.className = "share-menu";
  menu.innerHTML = `
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}" target="_blank" class="share-option">
      <i class="fab fa-facebook"></i> Facebook
    </a>
    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}" target="_blank" class="share-option">
      <i class="fab fa-twitter"></i> Twitter
    </a>
    <a href="https://wa.me/?text=${encodeURIComponent(
      text + " " + url
    )}" target="_blank" class="share-option">
      <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
    <a href="mailto:?subject=${encodeURIComponent(
      propertyTitle
    )}&body=${encodeURIComponent(text + " " + url)}" class="share-option">
      <i class="fas fa-envelope"></i> Email
    </a>
    <button class="share-option copy-link" onclick="copyToClipboardRoom('${url}')">
      <i class="fas fa-link"></i> Copy Link
    </button>
  `;

  document.body.appendChild(menu);

  // Position menu near the button
  const btn = e.target.closest(".share-btn-room");
  const rect = btn.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top = rect.bottom + 10 + "px";
  menu.style.right = window.innerWidth - rect.right + "px";

  setTimeout(() => menu.classList.add("show"), 10);

  // Close on scroll
  function closeOnScroll() {
    menu.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(menu)) {
        document.body.removeChild(menu);
      }
    }, 200);
    window.removeEventListener("scroll", closeOnScroll);
    document.removeEventListener("click", closeMenu);
  }

  // Close menu on outside click
  function closeMenu(evt) {
    if (!menu.contains(evt.target) && !evt.target.closest(".share-btn-room")) {
      menu.classList.remove("show");
      setTimeout(() => {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
      }, 200);
      window.removeEventListener("scroll", closeOnScroll);
      document.removeEventListener("click", closeMenu);
    }
  }

  window.addEventListener("scroll", closeOnScroll);
  document.addEventListener("click", closeMenu);
}

function copyToClipboardRoom(url) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch(() => {
      alert("Failed to copy link");
    });
}

// ========================
// ADVANCED FILTER SYSTEM
// ========================

let advancedFilters = {
  distance: 50,
  price_min: 0,
  price_max: 999999,
  bedrooms_min: 0,
  guests_min: 0,
  bathrooms_min: 0,
  amenities: [],
  property_types: [],
  rating_min: 0,
  cancellation_policy: null,
  filter_availability: false,
};

let allAmenities = [];

// Initialize advanced filter modal
function initAdvancedFilterModal() {
  const openBtn = document.getElementById("openAdvancedFilter");
  const openBtnMobile = document.getElementById("openAdvancedFilterMobile");
  const closeBtn = document.getElementById("closeAdvancedFilter");
  const modal = document.getElementById("advancedFilterModal");
  const applyBtn = document.getElementById("applyFilters");
  const resetBtn = document.getElementById("resetFilters");

  if (!openBtn && !openBtnMobile) {
    console.warn("No advanced filter open button found (desktop or mobile)");
    return;
  }

  // Open modal from desktop button
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.showModal();
      loadAmenitiesForFilter();
    });
  }

  // Open modal from mobile button
  if (openBtnMobile) {
    openBtnMobile.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (modal) {
        modal.showModal();
        loadAmenitiesForFilter();
      }
    });
  }

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.close();
    });
  }

  // Close on backdrop click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });
  }

  // Apply filters
  if (applyBtn) {
    applyBtn.addEventListener("click", applyAdvancedFilters);
  }

  // Reset filters
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAdvancedFilters);
  }

  // Initialize filter option buttons
  initializeFilterOptions();

  // Initialize sliders and inputs
  initializeFilterControls();
}

// Initialize filter option buttons with proper toggle and single-select logic
function initializeFilterOptions() {
  const optionBtns = document.querySelectorAll(".filter-option-btn");

  optionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterType = btn.getAttribute("data-filter");
      const value = btn.getAttribute("data-value");

      // Single-selection filters: deselect siblings
      const singleSelectFilters = [
        "bedrooms",
        "bathrooms",
        "guests",
        "rating",
        "cancellation",
      ];

      if (singleSelectFilters.includes(filterType)) {
        // Remove active from siblings
        const siblings = document.querySelectorAll(
          `[data-filter="${filterType}"].active`
        );
        siblings.forEach((sibling) => {
          if (sibling !== btn) {
            sibling.classList.remove("active");
          }
        });
        // Toggle current button
        btn.classList.toggle("active");
      } else {
        // Multi-select filters (property_type)
        btn.classList.toggle("active");
      }

      // Update filter object based on filter type
      if (filterType === "bedrooms") {
        advancedFilters.bedrooms_min = btn.classList.contains("active")
          ? parseInt(value)
          : 0;
      } else if (filterType === "guests") {
        advancedFilters.guests_min = btn.classList.contains("active")
          ? parseInt(value)
          : 0;
      } else if (filterType === "bathrooms") {
        advancedFilters.bathrooms_min = btn.classList.contains("active")
          ? parseInt(value)
          : 0;
      } else if (filterType === "property_type") {
        if (btn.classList.contains("active")) {
          if (!advancedFilters.property_types.includes(value)) {
            advancedFilters.property_types.push(value);
          }
        } else {
          advancedFilters.property_types =
            advancedFilters.property_types.filter((t) => t !== value);
        }
      } else if (filterType === "rating") {
        advancedFilters.rating_min = btn.classList.contains("active")
          ? parseFloat(value)
          : 0;
      } else if (filterType === "cancellation") {
        advancedFilters.cancellation_policy = btn.classList.contains("active")
          ? value
          : null;
      }

      console.log("Updated filters:", advancedFilters);
    });
  });
}

// Initialize filter controls (sliders, inputs)
function initializeFilterControls() {
  const distanceSlider = document.getElementById("distanceSlider");
  const distanceValue = document.getElementById("distanceValue");
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const priceDisplay = document.getElementById("priceDisplay");
  const filterAvailability = document.getElementById("filterAvailability");
  const minStayDays = document.getElementById("minStayDays");

  // Distance slider handler
  if (distanceSlider) {
    distanceSlider.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      advancedFilters.distance = value;
      if (distanceValue) {
        distanceValue.textContent = value;
      }
    });
  }

  // Price range handlers with dynamic display
  if (priceMin) {
    priceMin.addEventListener("input", (e) => {
      advancedFilters.price_min = parseFloat(e.target.value) || 0;
      updatePriceDisplay();
    });
  }

  if (priceMax) {
    priceMax.addEventListener("input", (e) => {
      advancedFilters.price_max = parseFloat(e.target.value) || 10000;
      updatePriceDisplay();
    });
  }

  // Update price display on input
  function updatePriceDisplay() {
    if (priceDisplay) {
      const min = parseFloat(priceMin?.value || 0);
      const max = parseFloat(priceMax?.value || 10000);
      priceDisplay.textContent = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
  }

  // Minimum stay days handler
  if (minStayDays) {
    minStayDays.addEventListener("input", (e) => {
      advancedFilters.min_stay_days = parseInt(e.target.value) || 1;
    });
  }

  // Availability filter handler
  if (filterAvailability) {
    filterAvailability.addEventListener("change", (e) => {
      advancedFilters.filter_availability = e.target.checked;
    });
  }

  // Initialize price display on load
  updatePriceDisplay();

  // Property type dropdown handler
  const propertyTypeSelect = document.getElementById("propertyTypeSelect");
  if (propertyTypeSelect) {
    propertyTypeSelect.addEventListener("change", (e) => {
      const selectedValue = e.target.value;
      // Convert to array - "All" means empty array (no filter)
      advancedFilters.property_types =
        selectedValue && selectedValue !== "all" ? [selectedValue] : [];
      console.log("Updated property types:", advancedFilters.property_types);
    });
  }

  // Amenities modal handlers
  initializeAmenitiesModal();
}

// Initialize amenities modal functionality
function initializeAmenitiesModal() {
  const showMoreBtn = document.getElementById("showMoreAmenitiesBtn");
  const amenitiesModal = document.getElementById("amenitiesModal");
  const modalCloseBtn = amenitiesModal?.querySelector(".modal-close-btn");
  const btnCloseModal = amenitiesModal?.querySelector(".btn-close-modal");
  const amenitiesSearchInput = amenitiesModal?.querySelector(
    ".amenities-search-input"
  );

  if (showMoreBtn && amenitiesModal) {
    // Open modal
    showMoreBtn.addEventListener("click", () => {
      amenitiesModal.showModal();
      // Reset search on open
      if (amenitiesSearchInput) {
        amenitiesSearchInput.value = "";
        filterAmenitiesInModal("");
      }
    });
  }

  // Close modal handlers
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      amenitiesModal?.close();
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", () => {
      amenitiesModal?.close();
    });
  }

  // Search amenities in modal
  if (amenitiesSearchInput) {
    amenitiesSearchInput.addEventListener("input", (e) => {
      filterAmenitiesInModal(e.target.value.toLowerCase());
    });
  }

  // Close modal when clicking backdrop
  if (amenitiesModal) {
    amenitiesModal.addEventListener("close", () => {
      // Reset search input on close
      if (amenitiesSearchInput) {
        amenitiesSearchInput.value = "";
      }
    });
  }
}

// Filter amenities in modal by search term
function filterAmenitiesInModal(searchTerm) {
  const modalGrid = document.querySelector(".amenities-modal-grid");
  if (!modalGrid) return;

  const amenityBadges = modalGrid.querySelectorAll(".amenity-badge");
  amenityBadges.forEach((badge) => {
    const label = badge.querySelector("label").textContent.toLowerCase();
    badge.style.display = label.includes(searchTerm) ? "flex" : "none";
  });
}

// Load amenities for filter
// Amenity icon mapping for beautiful display
const AMENITY_ICONS = {
  wifi: "fa-wifi",
  "free wifi": "fa-wifi",
  pool: "fa-water",
  "swimming pool": "fa-water",
  parking: "fa-car",
  "free parking": "fa-car",
  kitchen: "fa-kitchen-set",
  ac: "fa-snowflake",
  "air conditioning": "fa-snowflake",
  heating: "fa-fire",
  "hot water": "fa-tint",
  washer: "fa-washer",
  dryer: "fa-spinner",
  "washing machine": "fa-washer",
  dishwasher: "fa-pump-soap",
  tv: "fa-tv",
  "cable tv": "fa-tv",
  netflix: "fa-play",
  gym: "fa-dumbbell",
  "fitness center": "fa-dumbbell",
  spa: "fa-person-swimming",
  jacuzzi: "fa-person-swimming",
  balcony: "fa-city",
  terrace: "fa-tree",
  garden: "fa-leaf",
  patio: "fa-tree",
  bbq: "fa-fire",
  grill: "fa-fire",
  pets: "fa-paw",
  "pet friendly": "fa-paw",
  smoking: "fa-smoking",
  elevator: "fa-arrow-up",
  wheelchair: "fa-wheelchair",
  accessible: "fa-wheelchair",
  crib: "fa-baby",
  toys: "fa-cubes",
  books: "fa-book",
  games: "fa-dice",
  coffee: "fa-mug-hot",
  tea: "fa-mug-saucer",
  iron: "fa-shirt",
  safe: "fa-lock",
  lockbox: "fa-lock",
  hangers: "fa-shirt",
  hair_dryer: "fa-hairdryer",
  shampoo: "fa-droplet",
  toiletries: "fa-soap",
  first_aid: "fa-plus",
  fire_extinguisher: "fa-fire-extinguisher",
  carbon_monoxide: "fa-wind",
  smoke_alarm: "fa-bell",
  security_cameras: "fa-camera",
  door_lock: "fa-key",
  buzzer: "fa-bell",
  loud_alarm: "fa-alarm",
  self_check_in: "fa-key",
  keypad: "fa-hashtag",
};

function getAmenityIcon(amenityName) {
  const normalized = amenityName.toLowerCase().replace(/\s+/g, "_");
  for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  return "fa-star"; // Default icon
}

async function loadAmenitiesForFilter() {
  const amenitiesGrid = document.getElementById("amenitiesGrid");
  const amenitiesModalGrid = document.querySelector(".amenities-modal-grid");

  if (allAmenities.length === 0) {
    try {
      const response = await fetch("api/amenities/list.php");
      const data = await response.json();

      if (data.success) {
        allAmenities = data.data.amenities || [];
      }
    } catch (error) {
      console.error("Error loading amenities:", error);
    }
  }

  if (allAmenities.length === 0) return;

  // Render amenity badges in MAIN GRID (max 5 visible + Show More button)
  if (amenitiesGrid) {
    const maxVisibleAmenities = 5;
    const visibleAmenities = allAmenities.slice(0, maxVisibleAmenities);

    amenitiesGrid.innerHTML = visibleAmenities
      .map((amenity) => {
        const iconClass = getAmenityIcon(amenity.name);
        return `
      <div class="amenity-badge ${
        advancedFilters.amenities.includes(amenity.id) ? "checked" : ""
      }">
        <input 
          type="checkbox" 
          id="amenity-${amenity.id}"
          data-amenity-id="${amenity.id}"
          ${advancedFilters.amenities.includes(amenity.id) ? "checked" : ""}
        />
        <label for="amenity-${amenity.id}">
          <div class="amenity-icon"><i class="fas ${iconClass}"></i></div>
          <span>${amenity.name}</span>
        </label>
      </div>
    `;
      })
      .join("");

    // Show "Show More" button only if there are more than 5 amenities
    const showMoreBtn = document.getElementById("showMoreAmenitiesBtn");
    if (showMoreBtn) {
      showMoreBtn.style.display =
        allAmenities.length > maxVisibleAmenities ? "flex" : "none";
    }

    // Add event listeners to main grid checkboxes
    const mainGridCheckboxes = amenitiesGrid.querySelectorAll(
      'input[type="checkbox"]'
    );
    mainGridCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const amenityId = parseInt(e.target.getAttribute("data-amenity-id"));
        updateAmenitySelection(amenityId, e.target.checked);
      });
    });
  }

  // Render ALL amenity badges in MODAL GRID
  if (amenitiesModalGrid) {
    amenitiesModalGrid.innerHTML = allAmenities
      .map((amenity) => {
        const iconClass = getAmenityIcon(amenity.name);
        return `
      <div class="amenity-badge ${
        advancedFilters.amenities.includes(amenity.id) ? "checked" : ""
      }">
        <input 
          type="checkbox" 
          id="modal-amenity-${amenity.id}"
          data-amenity-id="${amenity.id}"
          ${advancedFilters.amenities.includes(amenity.id) ? "checked" : ""}
        />
        <label for="modal-amenity-${amenity.id}">
          <div class="amenity-icon"><i class="fas ${iconClass}"></i></div>
          <span>${amenity.name}</span>
        </label>
      </div>
    `;
      })
      .join("");

    // Add event listeners to modal grid checkboxes
    const modalGridCheckboxes = amenitiesModalGrid.querySelectorAll(
      'input[type="checkbox"]'
    );
    modalGridCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const amenityId = parseInt(e.target.getAttribute("data-amenity-id"));
        updateAmenitySelection(amenityId, e.target.checked);
        // Also update main grid checkbox if visible
        const mainGridCheckbox = amenitiesGrid?.querySelector(
          `input[data-amenity-id="${amenityId}"]`
        );
        if (mainGridCheckbox) {
          mainGridCheckbox.checked = e.target.checked;
          // Update badge class
          mainGridCheckbox
            .closest(".amenity-badge")
            .classList.toggle("checked", e.target.checked);
        }
      });
    });
  }
}

// Update amenity selection in filter
function updateAmenitySelection(amenityId, isChecked) {
  if (isChecked) {
    if (!advancedFilters.amenities.includes(amenityId)) {
      advancedFilters.amenities.push(amenityId);
    }
  } else {
    advancedFilters.amenities = advancedFilters.amenities.filter(
      (id) => id !== amenityId
    );
  }

  // Update badge styling for both grids
  updateAmenityBadgeStyles();
  console.log("Updated amenities:", advancedFilters.amenities);
}

// Update amenity badge styles to show checked state
function updateAmenityBadgeStyles() {
  const allBadges = document.querySelectorAll(".amenity-badge");
  allBadges.forEach((badge) => {
    const checkbox = badge.querySelector('input[type="checkbox"]');
    if (checkbox) {
      if (checkbox.checked) {
        badge.classList.add("checked");
      } else {
        badge.classList.remove("checked");
      }
    }
  });
}

// Apply advanced filters (with modal)
async function applyAdvancedFilters() {
  const modal = document.getElementById("advancedFilterModal");

  // Close modal
  modal.close();

  // Apply filters without modal
  await applyAdvancedFiltersWithoutModal();
}

// Apply advanced filters (without modal - used for date-based searches)
async function applyAdvancedFiltersWithoutModal() {
  // Show loading state
  const resultsList = document.querySelector(".results-list");
  resultsList.innerHTML =
    '<div style="padding: 40px; text-align: center; grid-column: 1/-1;"><i class="fas fa-spinner fa-spin"></i> Applying filters...</div>';

  try {
    // Collect all filter values from the modal
    const distanceValue = parseInt(
      document.getElementById("distanceSlider")?.value || 50
    );
    const priceMinValue = parseInt(
      document.getElementById("priceMin")?.value || 0
    );
    const priceMaxValue = parseInt(
      document.getElementById("priceMax")?.value || 10000
    );
    const minStayDaysValue = parseInt(
      document.getElementById("minStayDays")?.value || 1
    );

    // Get selected property type from dropdown (single selection)
    const propertyTypeSelect = document.getElementById("propertyTypeSelect");
    const propertyTypes =
      propertyTypeSelect &&
      propertyTypeSelect.value &&
      propertyTypeSelect.value !== "all"
        ? [propertyTypeSelect.value]
        : [];

    // Get selected bedrooms
    const bedroomsMin = parseInt(
      document.querySelector('[data-filter="bedrooms"].active')?.dataset
        .value || 0
    );

    // Get selected bathrooms
    const bathroomsMin = parseInt(
      document.querySelector('[data-filter="bathrooms"].active')?.dataset
        .value || 0
    );

    // Get selected guests
    const guestsMin = parseInt(
      document.querySelector('[data-filter="guests"].active')?.dataset.value ||
        0
    );

    // Get selected rating
    const ratingMin = parseFloat(
      document.querySelector('[data-filter="rating"].active')?.dataset.value ||
        0
    );

    // Get selected cancellation policy
    const cancellationPolicy =
      document.querySelector('[data-filter="cancellation"].active')?.dataset
        .value || null;

    // Get selected house rules
    const houseRules = Array.from(
      document.querySelectorAll('[data-filter="house_rules"]:checked')
    ).map((el) => el.value);

    // Get amenities (if available in modal)
    const amenities = Array.from(
      document.querySelectorAll('#amenitiesGrid input[type="checkbox"]:checked')
    ).map((el) => el.dataset.amenityId || el.value);

    // Prepare filter data
    const filterData = {
      distance: distanceValue,
      price_min: priceMinValue,
      price_max: priceMaxValue,
      bedrooms_min: bedroomsMin,
      guests_min: guestsMin,
      bathrooms_min: bathroomsMin,
      min_stay_days: minStayDaysValue,
      amenities: amenities,
      property_types: propertyTypes,
      rating_min: ratingMin,
      cancellation_policy: cancellationPolicy,
      house_rules: houseRules,
      search_lat: selectedLocationCoords?.lat || null,
      search_lon: selectedLocationCoords?.lon || null,
      check_in_date: selectedDates.start
        ? selectedDates.start.toISOString().split("T")[0]
        : null,
      check_out_date: selectedDates.end
        ? selectedDates.end.toISOString().split("T")[0]
        : null,
      filter_availability:
        document.getElementById("filterAvailability")?.checked || false,
    };

    console.log("Sending enhanced filter request:", filterData);

    // Call the new advanced filter API endpoint (cache-first approach)
    const response = await fetch("api/property/advanced-filter-featured.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filterData),
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      // Clear old property cards (including loading message)
      document
        .querySelectorAll(".room-card[data-property-id]")
        .forEach((card) => {
          card.remove();
        });

      // Clear the loading message
      const loadingMessage = resultsList.querySelector(
        'div[style*="grid-column"]'
      );
      if (loadingMessage) {
        loadingMessage.remove();
      }

      // Render filtered properties
      renderFilteredProperties(data.data);

      // Update map with filtered properties
      updateMapWithFilteredProperties(data.data);

      // Show results count with source info
      const sourceText =
        data.source === "cache" ? "(from cache)" : "(from database)";
      console.log(
        `Found ${data.count} properties matching your filters ${sourceText}`,
        data.filters_applied
      );

      // Scroll to results
      setTimeout(() => {
        const resultsContainer = document.querySelector(".results-container");
        if (resultsContainer) {
          resultsContainer.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      resultsList.innerHTML =
        '<div style="padding: 40px; text-align: center; grid-column: 1/-1;">No properties found matching your filters. Try adjusting your criteria.</div>';
    }
  } catch (error) {
    console.error("Error applying filters:", error);
    resultsList.innerHTML =
      '<div style="padding: 40px; text-align: center; grid-column: 1/-1; color: #d9534f;">Error applying filters. Please try again.</div>';
  }
}

// Render filtered properties
function renderFilteredProperties(properties) {
  const resultsList = document.querySelector(".results-list");
  const resultsCounter = document.getElementById("resultsCounter");

  // Update results counter
  const totalResults = properties.length;
  if (resultsCounter) {
    if (totalResults === 0) {
      resultsCounter.textContent = "No properties found";
    } else if (totalResults === 1) {
      resultsCounter.textContent = "1 property found";
    } else {
      resultsCounter.textContent = `${totalResults} properties found`;
    }
  }

  // Clear the entire results list and rebuild with filtered data
  resultsList.innerHTML = "";

  if (properties.length === 0) {
    resultsList.innerHTML =
      '<div style="padding: 40px; text-align: center; grid-column: 1/-1;"><p>No properties match your filters</p></div>';
    return;
  }

  // Create card HTML for each property
  const propertiesHTML = properties
    .map((prop) => {
      const images = prop.images && prop.images.length > 0 ? prop.images : [];
      const firstImage =
        images.length > 0 ? images[0].image_url : "assets/r1.avif";

      const distance = prop.distance
        ? `<span class="room-distance"><i class="fas fa-location-dot"></i> ${(prop.distance * 0.6214).toFixed(
            1
          )} miles away</span>`
        : "";

      const unavailableClass = prop.unavailable_during_dates
        ? "unavailable"
        : "";
      const amenitiesHTML = prop.amenities
        .slice(0, 3)
        .map(
          (a) =>
            `<span style="font-size: 12px; padding: 4px 8px; background: #f0faf7; border-radius: 4px; color: var(--sea);">${a.name}</span>`
        )
        .join("");

      const priceDisplay = getPriceDisplay(prop.base_price || 0);

      return `
        <div class="room-card ${unavailableClass}" data-property-id="${
        prop.id
      }">
          <img src="${firstImage}" alt="${prop.title}" class="room-image">
          <div class="room-details">
            <h3>${prop.title}</h3>
            <div class="room-meta">
              <span class="location"><i class="fas fa-map-marker-alt"></i> ${
                prop.location_city || prop.location_address || "Location"
              }</span>
              <span class="rating"><i class="fas fa-star"></i> ${
                prop.rating
              }</span>
            </div>
            ${distance}
            <div class="room-features">
              <span><i class="fas fa-bed"></i> ${prop.bedrooms || 2} Beds</span>
              <span><i class="fas fa-bath"></i> ${
                prop.bathrooms || 1
              } Bath</span>
              <span><i class="fas fa-users"></i> ${
                prop.guests_max || 2
              } Guests</span>
            </div>
            ${
              amenitiesHTML
                ? `<div style="display: flex; gap: 6px; flex-wrap: wrap; margin: 10px 0;">${amenitiesHTML}</div>`
                : ""
            }
            <div class="room-price-section">
              <div class="room-price">
                <span class="price">${priceDisplay}</span>
                <span class="per-night">per night</span>
              </div>
              <div class="room-actions">
                <button class="share-btn-room" onclick="openShareMenuRoom(event, ${
                  prop.id
                }, '${prop.title.replace(/'/g, "\\'")}')">
                  <i class="fas fa-share-alt"></i>
                </button>
                <button class="book-now-btn" onclick="viewProperty(${
                  prop.id
                })">View</button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // Insert all filtered properties at once
  resultsList.insertAdjacentHTML("afterbegin", propertiesHTML);

  // Add event handlers to new cards
  document.querySelectorAll(".room-card[data-property-id]").forEach((card) => {
    const propId = card.getAttribute("data-property-id");

    card.addEventListener("click", () => {
      highlightCardAndMarker(propId);
    });

    card.addEventListener("mouseenter", () => {
      highlightMarker(propId);
      card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
      unhighlightMarker(propId);
      card.classList.remove("hovered");
    });
  });
}

// Update map with filtered properties
function updateMapWithFilteredProperties(properties) {
  if (!map) return;

  // Clear existing markers
  Object.values(markers).forEach((marker) => {
    map.removeLayer(marker);
  });
  markers = {};

  // Add new markers for filtered properties
  properties.forEach((prop) => {
    if (prop.location_latitude && prop.location_longitude) {
      addMarkerToMap(prop);
    }
  });

  // Fit map to new bounds
  if (Object.keys(markers).length > 0) {
    const bounds = L.latLngBounds(
      Object.values(markers).map((m) => m.getLatLng())
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }
}

// Reset filters
function resetAdvancedFilters() {
  // Reset filter object
  advancedFilters = {
    distance: 50,
    price_min: 0,
    price_max: 999999,
    bedrooms_min: 0,
    guests_min: 0,
    bathrooms_min: 0,
    amenities: [],
    property_types: [],
    rating_min: 0,
    cancellation_policy: null,
    filter_availability: false,
  };

  // Reset UI elements
  document.getElementById("distanceSlider").value = 50;
  document.getElementById("distanceValue").textContent = "50";
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";
  document.getElementById("filterAvailability").checked = false;

  // Reset active buttons
  document
    .querySelectorAll(".filter-option-btn.active")
    .forEach((btn) => btn.classList.remove("active"));

  // Reset checkboxes
  document
    .querySelectorAll('.amenity-checkbox input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false));

  console.log("Filters reset");
}

// Load and display counts for filter options

// Initialize advanced filters on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    initAdvancedFilterModal();
  }, 500);
});
