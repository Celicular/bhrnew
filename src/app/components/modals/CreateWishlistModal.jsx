import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function CreateWishlistModal({ isOpen, onClose, onSuccess }) {
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { createWishlist } = useWishlist();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!listName.trim()) {
      setError("Please enter a wishlist name");
      return;
    }

    setIsLoading(true);
    const result = await createWishlist(listName.trim());

    if (result.success) {
      setListName("");
      onSuccess?.(result.listId);
      onClose();
    } else {
      setError(result.message || "Failed to create wishlist");
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-charcoal-blue rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-midnight-navy dark:text-white">
            Create Wishlist
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-soft-stone-gray dark:text-dusty-sky-blue" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wishlist Name Input */}
          <div>
            <label className="block text-sm font-medium text-midnight-navy dark:text-white mb-2">
              Wishlist Name
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="e.g., European Getaway"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-charcoal-blue/50 text-midnight-navy dark:text-white placeholder:text-soft-stone-gray dark:placeholder:text-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 focus:border-champagne-gold transition-all disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 text-midnight-navy dark:text-white hover:bg-warm-ivory dark:hover:bg-charcoal-blue/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-champagne-gold text-midnight-navy font-semibold hover:bg-champagne-gold/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
