import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User as UserIcon, Mail, Phone, MapPin } from "lucide-react";
import { api } from "@/utils/client";
import { useAuth } from "@/context/AuthContext";

export function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pin_code: "",
    country: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch profile data when modal opens
  useEffect(() => {
    const userId = user?.id || user?.user_id;
    if (isOpen && userId) {
      fetchProfile(userId);
    }
  }, [isOpen, user?.id, user?.user_id]);

  const fetchProfile = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getUserProfile(userId);

      if (response.data.success) {
        const data = response.data.data;
        setProfileData(data);
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          pin_code: data.pin_code || "",
          country: data.country || "",
          bio: data.bio || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.full_name.trim()) {
        setError("Full name is required");
        setIsSubmitting(false);
        return;
      }

      const userId = user?.id || user?.user_id;
      const response = await api.updateGuestDetails({
        user_id: userId,
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pin_code: formData.pin_code,
        country: formData.country,
        bio: formData.bio,
      });

      if (response.data.success) {
        setSuccess(true);
        setProfileData({
          ...profileData,
          ...formData,
        });
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(
          response.data.message || "Failed to update profile"
        );
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Debug user data
  const userId = user?.id || user?.user_id;
  
  if (!userId) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4 py-4 md:py-0"
            >
              <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-midnight-navy dark:text-white">
                    Error Loading Profile
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-warm-ivory dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-soft-stone-gray dark:text-dusty-sky-blue mb-6">
                  User ID not available. Please try logging in again.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-lg bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4 py-4 md:py-6 top-20"
          >
            <div className="w-full max-w-2xl max-h-[calc(100vh-120px)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative h-24 bg-gradient-to-r from-midnight-navy dark:from-slate-700 via-deep-navy dark:via-slate-700 to-midnight-navy dark:to-slate-700 px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">
                      My Profile
                    </h2>
                    <p className="text-white/60 text-xs">
                      Manage your account details
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin">
                        <div className="w-8 h-8 border-4 border-champagne-gold/20 border-t-champagne-gold rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <UserIcon className="w-4 h-4 text-champagne-gold" />
                            Full Name
                          </div>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all"
                        />
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="w-4 h-4 text-champagne-gold" />
                            Email (Identity Anchor)
                          </div>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-warm-ivory/50 dark:bg-slate-600/50 text-midnight-navy dark:text-white/60 focus:outline-none cursor-not-allowed"
                        />
                        <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-champagne-gold" />
                            Phone Number
                          </div>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-champagne-gold" />
                            Address
                          </div>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your address"
                          rows="3"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all resize-none"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all"
                        />
                      </div>

                      {/* Pin Code */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          Pin Code
                        </label>
                        <input
                          type="text"
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={handleInputChange}
                          placeholder="Enter your pin code"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Enter your country"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-semibold text-midnight-navy dark:text-white mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          rows="3"
                          className="w-full px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 bg-white dark:bg-slate-700 text-midnight-navy dark:text-white placeholder-soft-stone-gray dark:placeholder-dusty-sky-blue focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 transition-all resize-none"
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        >
                          <p className="text-sm text-red-700 dark:text-red-400">
                            {error}
                          </p>
                        </motion.div>
                      )}

                      {/* Success Message */}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        >
                          <p className="text-sm text-green-700 dark:text-green-400">
                            Profile updated successfully!
                          </p>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 px-4 py-3 rounded-lg border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 text-midnight-navy dark:text-white hover:bg-warm-ivory dark:hover:bg-slate-700 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-3 rounded-lg bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-midnight-navy/20 border-t-midnight-navy rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
