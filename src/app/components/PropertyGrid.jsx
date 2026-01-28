import { PropertyCard } from "@/app/components/PropertyCard";
import { useState, useEffect } from "react";

export function PropertyGrid({ properties, isLoading, onShowOnMap }) {
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedGuests, setSelectedGuests] = useState(null);

  // Load selected guests from localStorage
  useEffect(() => {
    const guests = JSON.parse(localStorage.getItem("selectedGuests"));
    setSelectedGuests(guests);
  }, []);

  // Filter properties based on guest capacity
  const totalGuests = selectedGuests
    ? (selectedGuests.adults || 0) + (selectedGuests.children || 0)
    : 0;

  const filteredProperties = properties.filter((property) => {
    // If no guests selected, show all properties
    if (totalGuests === 0) return true;
    // If guests selected, only show properties that can accommodate them
    return property.guests_max >= totalGuests;
  });

  const displayedProperties = filteredProperties.slice(0, displayCount);
  const hasMore = displayCount < filteredProperties.length;

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">
          No properties found. Try adjusting your search.
        </p>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">
          No properties found that can accommodate {totalGuests}{" "}
          {totalGuests === 1 ? "guest" : "guests"}. Try searching with fewer
          guests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onShowOnMap={onShowOnMap}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleShowMore}
            className="bg-champagne-gold hover:bg-burnished-gold text-midnight-navy px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
