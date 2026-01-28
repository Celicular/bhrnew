import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X } from "lucide-react";
import { ListingsSearchBar } from "@/app/components/ListingsSearchBar";
import { MobileSearchBar } from "@/app/components/MobileSearchBar";
import { PropertyGrid } from "@/app/components/PropertyGrid";
import { PropertyMap } from "@/app/components/PropertyMap";
import { api } from "@/utils/client";

export function ListingsPage() {
  const navigate = useNavigate();
  const [hasLocation, setHasLocation] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const mapSectionRef = useRef(null);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch properties based on search criteria
  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = JSON.parse(localStorage.getItem("selectedLocation"));
      const dates = JSON.parse(localStorage.getItem("selectedDates"));
      const guests = JSON.parse(localStorage.getItem("selectedGuests"));
      const filters = JSON.parse(localStorage.getItem("appliedFilters"));

      if (!location?.location_lat || !location?.location_long) {
        setHasLocation(false);
        setIsLoading(false);
        return;
      }

      setHasLocation(true);
      setSelectedLocation(location);

      // Build API request with minimal params
      const requestBody = {
        search_lat: location.location_lat,
        search_lon: location.location_long,
        distance: 321800, // 200 miles limit
      };

      // Add optional params if they exist
      if (guests?.adults) {
        requestBody.guests_min = guests.adults + (guests.children || 0);
      }

      if (dates?.start && dates?.end) {
        requestBody.filter_availability = true;
        requestBody.check_in_date = dates.start;
        requestBody.check_out_date = dates.end;
      }

      // Add filter params if they exist
      if (filters) {
        if (filters.price_min > 0) requestBody.price_min = filters.price_min;
        if (filters.price_max < 10000) requestBody.price_max = filters.price_max;
        if (filters.bedrooms_min > 0) requestBody.bedrooms_min = filters.bedrooms_min;
        if (filters.bathrooms_min > 0) requestBody.bathrooms_min = filters.bathrooms_min;
        if (filters.distance < 5000) requestBody.distance = Math.round(filters.distance * 1.609); // Convert miles to km
        if (filters.property_types.length > 0) requestBody.property_types = filters.property_types;
        if (filters.amenities.length > 0) requestBody.amenities = filters.amenities;
        if (filters.rating_min > 0) requestBody.rating_min = filters.rating_min;
      }

      console.log("Fetching properties with params:", requestBody);

      const response = await api.getFilteredProperties(requestBody);

      if (response.data.success && Array.isArray(response.data.data)) {
        setProperties(response.data.data);
      } else {
        setError("No properties found");
        setProperties([]);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again.");
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle show on map
  const handleShowOnMap = (propertyId) => {
    if (mapSectionRef.current) {
      // Scroll to map with smooth behavior
      mapSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Zoom to property after a short delay to ensure scroll is visible
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.zoomToProperty(propertyId);
      }
    }, 800);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    localStorage.removeItem("appliedFilters");
    setHasAppliedFilters(false);
    fetchProperties();
  };

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
    
    // Check if filters are applied
    const appliedFilters = JSON.parse(localStorage.getItem("appliedFilters"));
    if (appliedFilters) {
      const hasAnyFilter = 
        (appliedFilters.price_min > 0 || appliedFilters.price_max < 10000) ||
        (appliedFilters.bedrooms_min > 0) ||
        (appliedFilters.bathrooms_min > 0) ||
        (appliedFilters.distance < 5000) ||
        (appliedFilters.property_types?.length > 0) ||
        (appliedFilters.amenities?.length > 0) ||
        (appliedFilters.rating_min > 0) ||
        (appliedFilters.filter_availability);
      
      setHasAppliedFilters(hasAnyFilter);
    }
  }, []);

  if (!hasLocation) {
    return (
      <div className="min-h-screen bg-bone-white dark:bg-warm-ivory flex flex-col">
        <Navbar initialBackground={false} isFixed={true} />

        <main className="flex-1 flex items-center justify-center py-8 md:py-12">
          <div className="max-w-md text-center px-6">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-champagne-gold/20 dark:bg-champagne-gold/10 rounded-full">
                <MapPin className="w-12 h-12 text-champagne-gold" />
              </div>
            </div>

            <h1 className="text-3xl font-serif text-midnight-navy dark:text-white mb-3">
              Select a Location
            </h1>

            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Please select a location and search to see available properties in
              your desired area.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-champagne-gold hover:bg-burnished-gold text-midnight-navy px-8 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-champagne-gold/30"
            >
              Go Back & Search
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone-white dark:bg-warm-ivory flex flex-col pb-24 md:pb-0">
      <Navbar initialBackground={false} isFixed={true} />

      <main className="flex-1 py-8 pt-24 md:py-12 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Desktop Search Bar */}
          <ListingsSearchBar 
            onSearch={fetchProperties}
            onFiltersChange={() => {}} 
          />

          {/* Results Info */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-4">
              <h2 className="text-2xl md:text-3xl font-serif text-midnight-navy dark:text-white">
                Available Stays
              </h2>
              {hasAppliedFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-midnight-navy dark:text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              {properties.length} properties found
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-xl mb-8">
              {error}
            </div>
          )}

          {/* Property Grid */}
          <PropertyGrid
            properties={properties}
            isLoading={isLoading}
            onShowOnMap={handleShowOnMap}
          />

          {/* Property Map */}
          {properties.length > 0 && (
            <div className="mt-16" ref={mapSectionRef}>
              <h2 className="text-2xl md:text-3xl font-serif text-midnight-navy dark:text-white mb-6">
                Browse on Map
              </h2>
              <PropertyMap
                ref={mapRef}
                properties={properties}
                selectedLocation={selectedLocation}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Search Bar */}
      <MobileSearchBar onSearch={fetchProperties} />

      <Footer />
    </div>
  );
}
