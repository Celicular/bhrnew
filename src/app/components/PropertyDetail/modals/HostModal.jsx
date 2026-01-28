import { useState, useEffect } from "react";
import { Modal } from "@/app/components/ui/Modal";
import {
  Star,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { getImageUrl, api } from "@/utils/client";
import { useCurrency } from "@/context/CurrencyContext";

export function HostModal({ isOpen, onClose, hostData, currentPropertyId }) {
  const [otherProperties, setOtherProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const { currency, exchangeRate } = useCurrency();

  if (!hostData) return null;

  // Fetch other properties by this host
  useEffect(() => {
    if (!isOpen || !hostData?.id) return;

    const fetchOtherProperties = async () => {
      try {
        setLoadingProperties(true);
        const response = await api.getHostProperties(
          hostData.id,
          2,
          currentPropertyId || 0,
        );
        if (response.data?.success && Array.isArray(response.data.data)) {
          setOtherProperties(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching host properties:", error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchOtherProperties();
  }, [isOpen, hostData?.id, currentPropertyId]);

  // Helper to render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating)
            ? "fill-champagne-gold text-champagne-gold"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Host Profile">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center border-b border-gray-200 pb-6">
          {/* Avatar */}
          <img
            src={
              hostData.profile_image
                ? (() => {
                    const imagePath = hostData.profile_image;
                    // If it's already a full URL, use it as is
                    if (
                      imagePath.startsWith("http://") ||
                      imagePath.startsWith("https://")
                    ) {
                      return imagePath;
                    }
                    // Otherwise, construct the full URL
                    return `https://bookholidayrental.com/${imagePath}`;
                  })()
                : `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostData.full_name || "Host"}`
            }
            alt={hostData.full_name || "Host"}
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostData.full_name || "Host"}`;
            }}
          />

          {/* Name and Verification */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-serif text-midnight-navy dark:text-white">
              {hostData.full_name || "Host"}
            </h2>
            {hostData.is_verified === 1 && (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>

          {/* Rating */}
          {hostData.average_rating && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex gap-1">
                {renderStars(hostData.average_rating)}
              </div>
              <span className="text-sm text-dusty-sky-blue dark:text-slate-400 font-medium">
                {hostData.average_rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Role Badge */}
          {/* Removed package badge as per user request */}
        </div>

        {/* Bio */}
        {hostData.bio && hostData.bio !== "0" && (
          <div>
            <h3 className="text-sm font-semibold text-midnight-navy dark:text-white mb-2">
              About
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              {hostData.bio}
            </p>
          </div>
        )}

        {/* Contact Info */}
        {(hostData.email || hostData.phone) && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-midnight-navy dark:text-white">
              Contact
            </h3>
            <div className="space-y-2">
              {hostData.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-dusty-sky-blue dark:text-slate-400 flex-shrink-0" />
                  <span
                    className={`break-all ${hostData.show_email === 1 ? "text-gray-600 dark:text-slate-400" : "text-gray-400 dark:text-slate-500"}`}
                  >
                    {hostData.show_email === 1 ? hostData.email : "••••••••••"}
                  </span>
                </div>
              )}
              {hostData.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-dusty-sky-blue dark:text-slate-400 flex-shrink-0" />
                  <span
                    className={
                      hostData.show_email === 1
                        ? "text-gray-600 dark:text-slate-400"
                        : "text-gray-400 dark:text-slate-500"
                    }
                  >
                    {hostData.show_email === 1
                      ? hostData.phone
                      : hostData.phone.slice(0, 3) +
                        "****" +
                        hostData.phone.slice(-4)}
                  </span>
                </div>
              )}
            </div>
            {hostData.show_email === 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 italic mt-2">
                User has chosen to keep contact information private
              </p>
            )}
          </div>
        )}

        {/* Social Media */}
        {(hostData.facebook ||
          hostData.instagram ||
          hostData.twitter ||
          hostData.youtube) && (
          <div>
            <h3 className="text-sm font-semibold text-midnight-navy dark:text-white mb-3">
              Social Media
            </h3>
            <div className="flex gap-3">
              {hostData.facebook && (
                <a
                  href={hostData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[color:var(--blue-50)] dark:bg-blue-900/30 rounded-lg hover:bg-[color:var(--blue-100)] dark:hover:bg-blue-900/50 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </a>
              )}
              {hostData.instagram && (
                <a
                  href={hostData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </a>
              )}
              {hostData.twitter && (
                <a
                  href={hostData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-sky-50 dark:bg-sky-900/30 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </a>
              )}
              {hostData.youtube && (
                <a
                  href={hostData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5 text-red-600 dark:text-red-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="bg-warm-ivory dark:bg-slate-700 rounded-xl p-4 space-y-3 text-sm">
          {hostData.created_at && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-dusty-sky-blue dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Member Since</span>
              </div>
              <span className="font-medium text-midnight-navy dark:text-white">
                {new Date(hostData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          )}
          {hostData.is_verified === 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Verification</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Other Properties */}
        {otherProperties.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-midnight-navy dark:text-white mb-3">
              Other Properties
            </h3>
            <div className="space-y-3">
              {otherProperties.map((property) => {
                const convertedPrice = Math.round(
                  (property.base_price || 0) * (exchangeRate || 1),
                );
                return (
                  <div
                    key={property.id}
                    className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                        <img
                          src={getImageUrl(property.image)}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop";
                          }}
                        />
                      </div>

                      {/* Property Info */}
                      <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="text-sm font-medium text-midnight-navy dark:text-white truncate group-hover:text-dusty-sky-blue dark:group-hover:text-champagne-gold">
                            {property.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                            {property.location_city}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 text-xs">
                            {property.bedrooms && (
                              <span className="text-gray-600 dark:text-slate-400">
                                {property.bedrooms} bed
                                {property.bedrooms !== 1 ? "s" : ""}
                              </span>
                            )}
                            {property.bathrooms && (
                              <span className="text-gray-600 dark:text-slate-400">
                                {property.bathrooms} bath
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-dusty-sky-blue dark:text-champagne-gold">
                            ${convertedPrice}
                            {currency !== "USD" && ` ${currency}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
