import { useState } from "react";
import { motion } from "motion/react";
import { X, Plus } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { CreateWishlistModal } from "./CreateWishlistModal";

export function WishlistSelectionModal({
  isOpen,
  onClose,
  onSelect,
  propertyId,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { wishlists, isLoading } = useWishlist();

  const handleSelectWishlist = (wishlistId) => {
    onSelect(wishlistId);
    onClose();
  };

  const handleCreateSuccess = (newListId) => {
    setShowCreateModal(false);
    // Auto-select the newly created wishlist
    if (newListId) {
      onSelect(newListId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-charcoal-blue rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[85vh] z-[60] pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-3 border-b border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 flex-shrink-0">
            <h2 className="text-2xl font-bold text-midnight-navy dark:text-white">
              Save to Wishlist
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-soft-stone-gray dark:text-dusty-sky-blue" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-champagne-gold border-t-transparent"></div>
              </div>
            ) : wishlists.length === 0 ? (
              /* Empty State */
              <div className="text-center py-8">
                <p className="text-soft-stone-gray dark:text-dusty-sky-blue mb-4">
                  No wishlists yet
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-champagne-gold text-midnight-navy font-semibold hover:bg-champagne-gold/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create First List
                </button>
              </div>
            ) : (
              /* Wishlist List */
              <div className="space-y-2">
                {wishlists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => handleSelectWishlist(list.id)}
                    className="w-full p-4 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 hover:border-champagne-gold dark:hover:border-champagne-gold hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-midnight-navy dark:text-white">
                          {list.list_name}
                        </h3>
                        <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
                          {list.properties?.length || 0} properties
                        </p>
                      </div>
                      <div className="text-champagne-gold">→</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Create Button (Always Visible) */}
          <div className="border-t border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 p-6 pt-4 flex-shrink-0">
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg border-2 border-dashed border-champagne-gold text-champagne-gold font-semibold hover:bg-champagne-gold/10 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New List
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Create Wishlist Modal */}
      <CreateWishlistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
