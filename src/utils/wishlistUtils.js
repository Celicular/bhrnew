// localStorage key for wishlists
const WISHLIST_STORAGE_KEY = "bhr_wishlists";

/**
 * Get all wishlists from localStorage
 */
export function getLocalWishlists() {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error reading wishlists from localStorage:", err);
    return [];
  }
}

/**
 * Set wishlists in localStorage
 */
export function setLocalWishlists(wishlists) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlists));
  } catch (err) {
    console.error("Error saving wishlists to localStorage:", err);
  }
}

/**
 * Clear wishlists from localStorage
 */
export function clearLocalWishlists() {
  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing wishlists from localStorage:", err);
  }
}

/**
 * Get or create default wishlist
 * Returns the default list or creates one if it doesn't exist
 */
export function getOrCreateDefaultWishlist(wishlists, isLocalStorage = false) {
  let defaultList = wishlists.find((list) => list.list_name === "My Wishlist");

  if (!defaultList) {
    defaultList = {
      id: isLocalStorage ? `local_${Date.now()}` : undefined,
      list_name: "My Wishlist",
      properties: [],
      created_at: new Date().toISOString(),
    };
    wishlists.push(defaultList);
  }

  return defaultList;
}

/**
 * Check if property exists in a wishlist
 */
export function isPropertyInWishlist(wishlist, propertyId) {
  return wishlist.properties?.includes(propertyId);
}

/**
 * Get total property count across all wishlists
 */
export function getTotalPropertyCount(wishlists) {
  return wishlists.reduce(
    (sum, list) => sum + (list.properties?.length || 0),
    0,
  );
}

/**
 * Format wishlists for API sync
 */
export function formatWishlistsForSync(wishlists) {
  return wishlists.map((list) => ({
    list_name: list.list_name,
    properties: list.properties || [],
  }));
}
