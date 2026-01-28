import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, Trash2, MapPin, DollarSign, Plus } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getImageUrl, api } from "@/utils/client";
import { CreateWishlistModal } from "./CreateWishlistModal";

export function SavedPropertiesModal({ isOpen, onClose }) {
  const [expandedListId, setExpandedListId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({}); // Cache for property details
  const {
    wishlists,
    fetchWishlists,
    removeProperty,
    deleteWishlist,
    createWishlist,
  } = useWishlist();
  const { currency } = useCurrency();

  // Expand first list on mount
  useEffect(() => {
    if (isOpen && wishlists.length > 0 && expandedListId === null) {
      setExpandedListId(wishlists[0].id);
    }
  }, [isOpen, wishlists, expandedListId]);

  // Fetch property details for all properties in wishlists (in parallel)
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      // Collect all unique property IDs that need details
      const propertyIdsToFetch = new Set();
      wishlists.forEach((list) => {
        if (list.properties && list.properties.length > 0) {
          list.properties.forEach((prop) => {
            const propId =
              typeof prop === "object" ? prop.id || prop.property_id : prop;
            // Normalize to number for consistent comparison
            const normalizedId = Number(propId);
            // Only fetch if we don't already have details and it's a valid ID
            if (normalizedId && !propertyDetails[normalizedId]) {
              propertyIdsToFetch.add(normalizedId);
            }
          });
        }
      });

      console.log("Property IDs to fetch:", Array.from(propertyIdsToFetch)); // Debug log

      // Fetch details for properties we don't have
      if (propertyIdsToFetch.size > 0) {
        setIsLoadingDetails(true);
        try {
          // Try batch endpoint first
          const response = await api.getPropertiesDetails(
            Array.from(propertyIdsToFetch),
          );
          console.log("Batch fetch response:", response.data); // Debug log
          if (
            response.data?.success &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            // Build details map indexed by property ID
            const newDetails = { ...propertyDetails };
            response.data.data.forEach((prop) => {
              // Normalize the ID to number
              const normalizedId = Number(prop.id);
              newDetails[normalizedId] = prop;
              console.log(
                `Stored details for property ${normalizedId}:`,
                prop.title,
              ); // Debug log
            });
            console.log("Final propertyDetails keys:", Object.keys(newDetails)); // Debug log
            setPropertyDetails(newDetails);
            setIsLoadingDetails(false);
          } else {
            throw new Error("Invalid response format from batch endpoint");
          }
        } catch (err) {
          console.error("Error fetching property details:", err);
          // Fall back to fetching individually in parallel using Promise.all
          try {
            const promises = Array.from(propertyIdsToFetch).map((propId) =>
              api
                .getPropertyDetail(propId)
                .then((response) => {
                  if (response.data?.success) {
                    // Handle both single property response and array response
                    const propData = Array.isArray(response.data.data)
                      ? response.data.data[0]
                      : response.data.property || response.data.data;
                    return { id: Number(propId), data: propData };
                  }
                })
                .catch((innerErr) => {
                  console.error(`Error fetching property ${propId}:`, innerErr);
                  return null;
                }),
            );

            const results = await Promise.all(promises);
            const newDetails = { ...propertyDetails };
            results.forEach((result) => {
              if (result) {
                newDetails[result.id] = result.data;
                console.log(
                  `Stored details for property ${result.id}:`,
                  result.data.title,
                ); // Debug log
              }
            });
            setPropertyDetails(newDetails);
            setIsLoadingDetails(false);
          } catch (fallbackErr) {
            console.error("Error in fallback fetching:", fallbackErr);
            setIsLoadingDetails(false);
          }
        }
      } else {
        setIsLoadingDetails(false);
      }
    };

    if (isOpen && wishlists.length > 0) {
      fetchPropertyDetails();
    }
  }, [isOpen, wishlists]);

  const handleToggleList = (listId) => {
    // Only one list can be open at a time
    setExpandedListId(expandedListId === listId ? null : listId);
  };

  const handleRemoveProperty = async (wishlistId, propertyId) => {
    try {
      setIsLoading(true);
      const result = await removeProperty(wishlistId, propertyId);
      if (!result?.success) {
        console.error("Failed to remove property:", result?.message);
      }
    } catch (err) {
      console.error("Error removing property:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this wishlist and all its properties?",
      )
    ) {
      setIsLoading(true);
      await deleteWishlist(wishlistId);
      setIsLoading(false);

      // If deleted list was expanded, close it
      if (expandedListId === wishlistId) {
        setExpandedListId(null);
      }
    }
  };

  const handleCreateWishlistSuccess = (newListId) => {
    setShowCreateModal(false);
    // Expand the newly created list
    setExpandedListId(newListId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-charcoal-blue rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 flex-shrink-0">
          <h2 className="text-2xl font-bold text-midnight-navy dark:text-white">
            Saved Properties
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-soft-stone-gray dark:text-dusty-sky-blue" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {(isLoading || isLoadingDetails) && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-champagne-gold border-t-transparent"></div>
            </div>
          )}

          {!(isLoading || isLoadingDetails) && wishlists.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <p className="text-soft-stone-gray dark:text-dusty-sky-blue text-lg">
                No saved properties yet
              </p>
              <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue mt-2">
                Start saving your favorite properties to your wishlists
              </p>
            </div>
          ) : (
            /* Wishlists */
            <div className="space-y-4">
              {wishlists.map((list) => (
                <div
                  key={list.id}
                  className="border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 rounded-xl overflow-hidden"
                >
                  {/* List Header */}
                  <div
                    onClick={() => handleToggleList(list.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 transition-colors cursor-pointer"
                  >
                    <div className="text-left">
                      <h3 className="font-semibold text-midnight-navy dark:text-white">
                        {list.list_name}
                      </h3>
                      <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
                        {list.properties?.length || 0} properties
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWishlist(list.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      <motion.div
                        animate={{
                          rotate: expandedListId === list.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-soft-stone-gray dark:text-dusty-sky-blue" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Properties List */}
                  <AnimatePresence>
                    {expandedListId === list.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-warm-ivory/30 dark:bg-charcoal-blue/30"
                      >
                        {list.properties && list.properties.length > 0 ? (
                          <div className="divide-y divide-soft-stone-gray/20 dark:divide-dusty-sky-blue/20 p-4 space-y-4">
                            {list.properties
                              .filter((property) => {
                                // Only render cards if we have the details for this property
                                const propId =
                                  typeof property === "object"
                                    ? property.id || property.property_id
                                    : property;
                                const normalizedId = Number(propId);
                                console.log(
                                  "Checking property:",
                                  propId,
                                  "normalized:",
                                  normalizedId,
                                  "exists:",
                                  !!propertyDetails[normalizedId],
                                ); // Debug log
                                return propertyDetails[normalizedId];
                              })
                              .map((property, idx) => {
                                const propId =
                                  typeof property === "object"
                                    ? property.id || property.property_id
                                    : property;
                                const normalizedId = Number(propId);
                                const isFirst = idx === 0;
                                // Get the full details object from cache
                                const detailsObject =
                                  propertyDetails[normalizedId];

                                return (
                                  <PropertyCard
                                    key={`${list.id}-${normalizedId}`}
                                    property={detailsObject}
                                    propertyDetails={propertyDetails}
                                    currency={currency}
                                    onRemove={() =>
                                      handleRemoveProperty(
                                        list.id,
                                        normalizedId,
                                      )
                                    }
                                    isFirst={isFirst}
                                  />
                                );
                              })}
                            {/* Show loading indicator if not all properties have details yet */}
                            {isLoadingDetails &&
                              Object.keys(propertyDetails).length <
                                list.properties.length && (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-champagne-gold border-t-transparent"></div>
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-soft-stone-gray dark:text-dusty-sky-blue text-sm">
                            No properties in this list
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 p-4 flex justify-end gap-3 flex-shrink-0 bg-warm-ivory/50 dark:bg-charcoal-blue/30">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-champagne-gold hover:bg-champagne-gold/90 text-midnight-navy rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Wishlist
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-soft-stone-gray/30 dark:border-dusty-sky-blue/30 hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 text-midnight-navy dark:text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>

        {/* Create Wishlist Modal */}
        <CreateWishlistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateWishlistSuccess}
        />
      </motion.div>
    </div>
  );
}

// Property Card Component for saved properties
function PropertyCard({
  property,
  propertyDetails,
  currency,
  onRemove,
  isFirst,
}) {
  const { convertPrice, symbol } = useCurrency();
  // The property prop should now contain the full details object
  const details = property || {};
  const propertyId = details.id;

  console.log(
    "PropertyCard rendering - ID:",
    propertyId,
    "Details:",
    details.title,
  ); // Debug log

  if (!propertyId || !details.title) {
    console.error("PropertyCard: Missing required data", {
      propertyId,
      title: details.title,
    });
    return null;
  }

  // Map API response field names to display fields
  const propertyName = details.title || "Untitled Property";
  const location = details.location_city || "Unknown Location";
  const price = details.base_price || 0;

  // Get the first image from the images array or fallback to direct image URL
  let image = null;
  if (
    details.images &&
    Array.isArray(details.images) &&
    details.images.length > 0
  ) {
    image = details.images[0].image_url;
  } else {
    image = details.image_url || details.primary_image_url || details.image;
  }

  const handleRemoveClick = () => {
    onRemove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${!isFirst ? "pt-4" : ""}`}
    >
      {/* Image */}
      {image && (
        <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={propertyName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/assets/placeholder.jpg";
            }}
          />
        </div>
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-midnight-navy dark:text-white truncate">
          {propertyName}
        </h4>
        <div className="flex items-center gap-1 text-sm text-soft-stone-gray dark:text-dusty-sky-blue mt-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-1 text-lg font-bold text-champagne-gold mt-2">
          <span>
            {symbol}
            {Math.round(convertPrice(price || 0)).toLocaleString()}
          </span>
          <span className="text-xs font-normal text-soft-stone-gray dark:text-dusty-sky-blue">
            /night
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemoveClick}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        title="Remove property"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
