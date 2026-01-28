import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { api } from "@/utils/client";
import { getLocalWishlists, setLocalWishlists } from "@/utils/wishlistUtils";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isLoggedIn, user, userRole } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize wishlists on mount or when auth changes
  useEffect(() => {
    // Only initialize wishlists for guests (not hosts/admins)
    if (isLoggedIn && userRole === "guest") {
      // Fetch from database
      fetchWishlists();
    } else if (!isLoggedIn) {
      // Load from localStorage (only for logged-out users)
      let localLists = getLocalWishlists();

      // Create default wishlist if none exist
      if (localLists.length === 0) {
        const defaultWishlist = {
          id: `local_${Date.now()}`,
          list_name: "My Wishlist",
          properties: [],
          created_at: new Date().toISOString(),
        };
        localLists = [defaultWishlist];
        setLocalWishlists(localLists);
      }

      setWishlists(localLists);
    } else {
      // For hosts/admins, clear wishlists
      setWishlists([]);
      setLocalWishlists([]);
    }
  }, [isLoggedIn, userRole]);

  // Fetch wishlists from database (logged-in guests)
  const fetchWishlists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getWishlists();
      if (response.data?.success) {
        setWishlists(response.data.lists || []);
      }
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      setError(err.response?.data?.message || "Failed to fetch wishlists");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add property to wishlist
  const addProperty = useCallback(
    async (wishlistId, propertyId) => {
      setError(null);
      try {
        if (isLoggedIn) {
          // Database operation
          const response = await api.addPropertyToWishlist(
            wishlistId,
            propertyId,
          );
          if (response.data?.success) {
            await fetchWishlists();
            return { success: true };
          }
        } else {
          // localStorage operation - store as ID for consistency
          const updated = wishlists.map((list) =>
            list.id === wishlistId
              ? {
                  ...list,
                  properties: list.properties
                    ? [...new Set([...list.properties, propertyId])]
                    : [propertyId], // Prevent duplicates
                }
              : list,
          );
          setWishlists(updated);
          setLocalWishlists(updated);
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to add property";
        setError(msg);
        return { success: false, message: msg };
      }
    },
    [isLoggedIn, wishlists, fetchWishlists],
  );

  // Remove property from wishlist
  const removeProperty = useCallback(
    async (wishlistId, propertyId) => {
      setError(null);
      try {
        if (isLoggedIn) {
          // Database operation
          const response = await api.removePropertyFromWishlist(
            wishlistId,
            propertyId,
          );
          if (response.data?.success) {
            await fetchWishlists();
            return { success: true };
          }
        } else {
          // localStorage operation
          const updated = wishlists.map((list) =>
            list.id === wishlistId
              ? {
                  ...list,
                  properties: list.properties.filter((prop) => {
                    // Handle both object and ID formats
                    const propId =
                      typeof prop === "object"
                        ? prop.id || prop.property_id
                        : prop;
                    return propId !== propertyId;
                  }),
                }
              : list,
          );
          setWishlists(updated);
          setLocalWishlists(updated);
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to remove property";
        setError(msg);
        return { success: false, message: msg };
      }
    },
    [isLoggedIn, wishlists, fetchWishlists],
  );

  // Create new wishlist
  const createWishlist = useCallback(
    async (listName) => {
      setError(null);
      try {
        if (isLoggedIn) {
          // Database operation
          const response = await api.createWishlist(listName);
          if (response.data?.success) {
            await fetchWishlists();
            return { success: true, listId: response.data.list_id };
          }
        } else {
          // localStorage operation
          const newList = {
            id: `local_${Date.now()}`,
            list_name: listName,
            properties: [],
            created_at: new Date().toISOString(),
          };
          const updated = [...wishlists, newList];
          setWishlists(updated);
          setLocalWishlists(updated);
          return { success: true, listId: newList.id };
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to create wishlist";
        setError(msg);
        return { success: false, message: msg };
      }
    },
    [isLoggedIn, wishlists, fetchWishlists],
  );

  // Delete wishlist
  const deleteWishlist = useCallback(
    async (wishlistId) => {
      setError(null);
      try {
        if (isLoggedIn) {
          // Database operation
          const response = await api.deleteWishlist(wishlistId);
          if (response.data?.success) {
            await fetchWishlists();
            return { success: true };
          }
        } else {
          // localStorage operation
          const updated = wishlists.filter((list) => list.id !== wishlistId);
          setWishlists(updated);
          setLocalWishlists(updated);
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to delete wishlist";
        setError(msg);
        return { success: false, message: msg };
      }
    },
    [isLoggedIn, wishlists, fetchWishlists],
  );

  // Get total property count across all wishlists
  const getTotalPropertyCount = useCallback(() => {
    return wishlists.reduce(
      (sum, list) => sum + (list.properties?.length || 0),
      0,
    );
  }, [wishlists]);

  // Check if property is in any wishlist
  const isPropertySaved = useCallback(
    (propertyId) => {
      return wishlists.some((list) =>
        list.properties?.some((prop) => {
          // Handle both object and ID formats
          const propId =
            typeof prop === "object" ? prop.id || prop.property_id : prop;
          return propId === propertyId;
        }),
      );
    },
    [wishlists],
  );

  // Sync local wishlists to database (called after login)
  const syncLocalWishlists = useCallback(async () => {
    const localLists = getLocalWishlists();
    if (localLists.length === 0) {
      console.log("No local wishlists to sync");
      return { success: true };
    }

    setError(null);
    try {
      // Transform local wishlists to API format (remove id and created_at)
      const formattedLists = localLists.map((list) => ({
        list_name: list.list_name,
        properties: list.properties || [],
      }));

      console.log("Syncing local wishlists to database:", localLists);
      console.log("JSON being sent:", JSON.stringify(formattedLists, null, 2));
      
      const response = await api.syncWishlistsFromLocal(formattedLists);
      console.log("Sync response:", response.data);

      // Clear localStorage and fetch from DB
      setLocalWishlists([]);
      await fetchWishlists();
      console.log(`Local wishlists synced`);
      return { success: true };
    } catch (err) {
      console.error("Error syncing wishlists (non-blocking):", err.message);
      // Don't fail login - just clear local and fetch what's on server
      setLocalWishlists([]);
      try {
        await fetchWishlists();
      } catch (fetchErr) {
        console.error("Error fetching wishlists as fallback:", fetchErr);
      }
      return { success: false };
    }
  }, [fetchWishlists]);

  const value = {
    wishlists,
    isLoading,
    error,
    addProperty,
    removeProperty,
    createWishlist,
    deleteWishlist,
    getTotalPropertyCount,
    isPropertySaved,
    syncLocalWishlists,
    fetchWishlists,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
