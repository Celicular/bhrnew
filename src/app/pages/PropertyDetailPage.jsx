import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, getImageUrl } from "@/utils/client";
import { rafThrottle } from "@/utils/throttle";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { WishlistSelectionModal } from "@/app/components/modals/WishlistSelectionModal";

// Components
import { PropertyGallery } from "@/app/components/PropertyDetail/PropertyGallery";
import { PropertyNavigation } from "@/app/components/PropertyDetail/PropertyNavigation";
import { PropertyYourStay } from "@/app/components/PropertyDetail/PropertyYourStay";
import { PropertyDates } from "@/app/components/PropertyDetail/PropertyDates";
import { PropertyLocation } from "@/app/components/PropertyDetail/PropertyLocation";
import { PropertyAmenities } from "@/app/components/PropertyDetail/PropertyAmenities";
import { PropertyCustomAmenities } from "@/app/components/PropertyDetail/PropertyCustomAmenities";
import { PropertyHighlights } from "@/app/components/PropertyDetail/PropertyHighlights";
import { PropertyPolicies } from "@/app/components/PropertyDetail/PropertyPolicies";
import { PropertyReviews } from "@/app/components/PropertyDetail/PropertyReviews";
import { PropertyPricing } from "@/app/components/PropertyDetail/PropertyPricing";
import { PropertyRooms } from "@/app/components/PropertyDetail/PropertyRooms";
import { PropertyHouseRules } from "@/app/components/PropertyDetail/PropertyHouseRules";
import { PropertyVideos } from "@/app/components/PropertyDetail/PropertyVideos";
import { PropertySeasonalPricing } from "@/app/components/PropertyDetail/PropertySeasonalPricing";
import { PropertyFAQs } from "@/app/components/PropertyDetail/PropertyFAQs";
import { SimilarProperties } from "@/app/components/PropertyDetail/SimilarProperties";
import {
  BookingSidebar,
  BookingSidebarMobile,
} from "@/app/components/PropertyDetail/BookingSidebar";

// Modals
import { GalleryModal } from "@/app/components/PropertyDetail/modals/GalleryModal";
import { CalendarModal } from "@/app/components/PropertyDetail/modals/CalendarModal";
import { BookingModal } from "@/app/components/PropertyDetail/modals/BookingModal";
import { DescriptionModal } from "@/app/components/PropertyDetail/modals/DescriptionModal";
import { LocationModal } from "@/app/components/PropertyDetail/modals/LocationModal";
import { LocationMapModal } from "@/app/components/PropertyDetail/modals/LocationMapModal";
import { HostModal } from "@/app/components/PropertyDetail/modals/HostModal";
import { AmenitiesModal } from "@/app/components/PropertyDetail/modals/AmenitiesModal";
import { RulesModal } from "@/app/components/PropertyDetail/modals/RulesModal";

export function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency, symbol, convertPrice } = useCurrency();
  const { isPropertySaved, addProperty, wishlists } = useWishlist();
  const { isLoggedIn } = useAuth();

  // State Management
  const [propertyData, setPropertyData] = useState(null);
  const [propertyExtras, setPropertyExtras] = useState(null);
  const [hostData, setHostData] = useState(null);
  const [relevantProperties, setRelevantProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking state
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
  });
  const [guestCount, setGuestCount] = useState(2);
  const [isSaved, setIsSaved] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // UI state
  const [activeSection, setActiveSection] = useState("overview");
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Modal states
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocationMapModalOpen, setIsLocationMapModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Handle reserve button click with validation
  const handleReserveClick = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    // Check if dates are selected
    if (!selectedDates.start || !selectedDates.end) {
      alert("Please select check-in and check-out dates");
      setIsCalendarModalOpen(true);
      return;
    }

    // All checks passed, open booking modal
    setIsBookingModalOpen(true);
  };

  // Fetch property details on mount
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);

        // Execute all 4 API calls in parallel
        const [propertyResponse, extrasResponse, relevantResponse] =
          await Promise.all([
            api.getPropertyDetail(id),
            api.getPropertyExtras(id),
            api.getRelevantProperties(id, 4),
          ]);

        // Process main property data
        const mainPropertyData = propertyResponse.data.data;

        // Transform cancellation data - it comes as a nested object at root level
        if (mainPropertyData && mainPropertyData.cancellation) {
          console.log(
            "✅ Found cancellation object:",
            mainPropertyData.cancellation,
          );
          // cancellation already has { type, description } structure
          mainPropertyData.cancellation_policy = mainPropertyData.cancellation;
        } else {
          console.log("⚠️ No cancellation object found in API response");
        }

        setPropertyData(mainPropertyData);

        // Fetch host profile if available (can be done in parallel if host_id exists)
        if (mainPropertyData?.host_id) {
          try {
            const hostResponse = await api.getHostProfile(
              mainPropertyData.host_id,
            );
            setHostData(hostResponse.data.data);
          } catch (err) {
            console.error("Error fetching host profile:", err);
          }
        }

        // Process and set extras data
        const extrasData = extrasResponse.data.data;
        if (extrasData) {
          const seasonalPricingArray = [];
          if (
            extrasData.seasonal_pricing_spring &&
            extrasData.seasonal_pricing_spring !== "0"
          ) {
            seasonalPricingArray.push({
              season: "Spring",
              season_name: "Spring",
              price: parseFloat(extrasData.seasonal_pricing_spring),
              months: "March - May",
            });
          }
          if (
            extrasData.seasonal_pricing_summer &&
            extrasData.seasonal_pricing_summer !== "0"
          ) {
            seasonalPricingArray.push({
              season: "Summer",
              season_name: "Summer",
              price: parseFloat(extrasData.seasonal_pricing_summer),
              months: "June - August",
            });
          }
          if (
            extrasData.seasonal_pricing_fall &&
            extrasData.seasonal_pricing_fall !== "0"
          ) {
            seasonalPricingArray.push({
              season: "Fall",
              season_name: "Fall",
              price: parseFloat(extrasData.seasonal_pricing_fall),
              months: "September - November",
            });
          }
          if (
            extrasData.seasonal_pricing_winter &&
            extrasData.seasonal_pricing_winter !== "0"
          ) {
            seasonalPricingArray.push({
              season: "Winter",
              season_name: "Winter",
              price: parseFloat(extrasData.seasonal_pricing_winter),
              months: "December - February",
            });
          }

          extrasData.seasonal_pricing = seasonalPricingArray;
          setPropertyExtras(extrasData);
        }

        // Set relevant properties
        setRelevantProperties(relevantResponse.data.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  // Check if property is saved in wishlist
  useEffect(() => {
    if (id) {
      setIsSaved(isPropertySaved(parseInt(id)));
    }
  }, [id, isPropertySaved]);

  // Handle save to wishlist
  const handleSaveProperty = async () => {
    if (isSaved) {
      // TODO: Remove from wishlist (need to find and remove)
      setIsSaved(false);
      return;
    }

    // Add to wishlist
    if (wishlists.length === 0) {
      alert("No wishlists available. Please create one first.");
      return;
    }

    if (wishlists.length === 1) {
      // Auto-save to only wishlist
      await addProperty(wishlists[0].id, parseInt(id));
      setIsSaved(true);
    } else {
      // Show selection modal
      setShowWishlistModal(true);
    }
  };

  const handleWishlistSelect = async (wishlistId) => {
    await addProperty(wishlistId, parseInt(id));
    setIsSaved(true);
    setShowWishlistModal(false);
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "your-stay",
        "dates",
        "location",
        "amenities",
        "highlights",
        "rules",
        "videos",
        "policies",
        "pricing",
        "reviews",
        "faqs",
        "relevant-properties",
      ];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport (top of section is above middle of screen)
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    // Use RAF throttle for better scroll performance
    const throttledScroll = rafThrottle(handleScroll);
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-champagne-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-midnight-navy text-lg font-serif">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone-white">
        <div className="text-center max-w-md">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <a
            href="/"
            className="text-champagne-gold hover:text-accent transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone-white">
        <p className="text-midnight-navy">Property not found</p>
      </div>
    );
  }

  return (
    <div className="bg-bone-white min-h-screen flex flex-col">
      {/* Navbar with initial background */}
      <Navbar initialBackground={false} isFixed={false} />

      {/* Main Content */}
      <div className="flex-1 pt-12 md:pt-16 relative z-0">
        {/* Hero Gallery */}
        <PropertyGallery
          images={
            propertyData.images?.map((img) => getImageUrl(img.image_url)) || []
          }
          onImageClick={(idx) => {
            setGalleryIndex(idx);
            setIsGalleryModalOpen(true);
          }}
          title={propertyData.title}
        />

        {/* Navigation Ribbon */}
        {(() => {
          // Build navigation sections dynamically based on available data
          const navSections = [
            { id: "your-stay", label: "Your Stay" },
            { id: "dates", label: "Dates" },
            { id: "location", label: "Location" },
            { id: "amenities", label: "Amenities" },
          ];

          // Add highlights only if they exist
          if (
            propertyExtras?.highlights &&
            propertyExtras.highlights.length > 0
          ) {
            navSections.push({ id: "highlights", label: "Highlights" });
          }

          navSections.push({ id: "rules", label: "Rules" });

          // Add videos only if they exist
          if (propertyExtras?.video_url_1 || propertyExtras?.video_url_2) {
            navSections.push({ id: "videos", label: "Videos" });
          }

          navSections.push(
            { id: "policies", label: "Policies" },
            { id: "pricing", label: "Pricing" },
            { id: "reviews", label: "Reviews" },
            { id: "faqs", label: "FAQs" },
            { id: "relevant-properties", label: "Similar" },
          );

          return (
            <PropertyNavigation
              sections={navSections}
              activeSection={activeSection}
              onSectionClick={(sectionId) => {
                const element = document.getElementById(sectionId);
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          );
        })()}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Your Stay */}
              <PropertyYourStay
                title={propertyData.title}
                description={propertyData.description}
                location={`${propertyData.location_city}${propertyData.location_state ? `, ${propertyData.location_state}` : ""}`}
                bedrooms={propertyData.bedrooms}
                bathrooms={propertyData.bathrooms}
                maxGuests={propertyData.guests_max}
                propertyType={propertyData.property_type}
                rating={
                  propertyData.rating ? parseFloat(propertyData.rating) : null
                }
                reviews={propertyData.reviews?.length}
                onDescriptionClick={() => setIsDescriptionModalOpen(true)}
                onShare={() => {
                  navigator.share?.({
                    title: propertyData.title,
                    text: propertyData.description,
                    url: window.location.href,
                  });
                }}
              />

              {/* Dates */}
              <PropertyDates
                bookedDates={propertyData.booked_dates}
                selectedDates={selectedDates}
                onOpenCalendar={() => setIsCalendarModalOpen(true)}
                maxGuests={propertyData.guests_max}
              />

              {/* Location */}
              <PropertyLocation
                location={`${propertyData.location_city}${propertyData.location_state ? `, ${propertyData.location_state}` : ""}`}
                address={propertyData.location_address}
                latitude={propertyData.location_latitude}
                longitude={propertyData.location_longitude}
                description={
                  propertyData.location_description ||
                  propertyExtras?.location_description
                }
                nearbyPlaces={propertyExtras?.nearby_places}
                landmarks={propertyData.landmarks}
                onMapClick={() => setIsLocationMapModalOpen(true)}
                onDescriptionClick={() => setIsLocationModalOpen(true)}
                isMapModalOpen={isLocationMapModalOpen}
              />

              {/* Amenities */}
              <PropertyAmenities
                amenities={propertyData.amenities}
                onViewAll={() => setIsAmenitiesModalOpen(true)}
              />

              {/* Custom Amenities */}
              <PropertyCustomAmenities
                customAmenities={propertyData.custom_amenities}
                minimumStay={propertyData.minimum_stay}
              />

              {/* Rooms & Spaces */}
              <PropertyRooms rooms={propertyData.rooms} />

              {/* Highlights */}
              <PropertyHighlights
                highlights={propertyExtras?.highlights || []}
              />

              {/* Seasonal Pricing */}
              <PropertySeasonalPricing
                seasonalPricing={propertyExtras?.seasonal_pricing}
              />

              {/* House Rules */}
              <div id="rules">
                <PropertyHouseRules
                  rules={propertyData.rules}
                  onViewAdditionalRules={() => setIsRulesModalOpen(true)}
                />
              </div>

              {/* Videos */}
              <PropertyVideos
                videos={[
                  ...(propertyExtras?.video_url_1
                    ? [
                        {
                          url: propertyExtras.video_url_1,
                          fileName: propertyExtras.video_file_name_1,
                        },
                      ]
                    : []),
                  ...(propertyExtras?.video_url_2
                    ? [
                        {
                          url: propertyExtras.video_url_2,
                          fileName: propertyExtras.video_file_name_2,
                        },
                      ]
                    : []),
                ]}
              />

              {/* Policies */}
              <PropertyPolicies policies={propertyData.policies} />

              {/* Pricing */}
              <PropertyPricing
                basePrice={
                  propertyData.base_price || propertyData.pricing?.base_price
                }
                selectedDates={selectedDates}
                seasonalPricing={propertyExtras?.seasonal_pricing}
                cancellationPolicy={propertyData.cancellation_policy}
                weeklyDiscount={
                  propertyData.weekly_discount ||
                  propertyData.pricing?.weekly_discount ||
                  0
                }
                monthlyDiscount={
                  propertyData.monthly_discount ||
                  propertyData.pricing?.monthly_discount ||
                  0
                }
                customPricingOptions={
                  propertyData.custom_prices ||
                  propertyData.pricing?.custom_prices ||
                  []
                }
              />

              {/* Reviews */}
              <PropertyReviews
                reviews={propertyData.reviews}
                totalRating={parseFloat(propertyData.average_rating)}
              />

              {/* Mobile Host Details Section */}
              {hostData && (
                <div className="md:hidden bg-warm-ivory rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <img
                      src={
                        hostData.profile_image
                          ? (() => {
                              const imagePath = hostData.profile_image;
                              if (
                                imagePath.startsWith("http://") ||
                                imagePath.startsWith("https://")
                              ) {
                                return imagePath;
                              }
                              return `https://bookholidayrental.com/${imagePath}`;
                            })()
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostData.full_name || "Host"}`
                      }
                      alt={hostData.full_name || "Host"}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostData.full_name || "Host"}`;
                      }}
                    />

                    {/* Host Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-midnight-navy">
                        {hostData.full_name || "Host"}
                      </h4>
                      {hostData.average_rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-dusty-sky-blue">
                            ★ {hostData.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {hostData.bio && hostData.bio !== "0" && (
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {hostData.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    onClick={() => setIsHostModalOpen(true)}
                    className="w-full py-2 text-sm font-medium text-dusty-sky-blue hover:text-midnight-navy transition-colors border border-dusty-sky-blue rounded-lg"
                  >
                    View Host Profile
                  </button>
                </div>
              )}

              {/* FAQs */}
              <div id="faqs">
                <PropertyFAQs faqs={propertyData.faqs} />
              </div>

              {/* Similar Properties */}
              <SimilarProperties
                properties={relevantProperties}
                onPropertyClick={(propId) => {
                  navigate(`/property/${propId}`);
                  window.scrollTo(0, 0);
                }}
              />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <BookingSidebar
                property={propertyData}
                hostData={hostData}
                selectedDates={selectedDates}
                guestCount={guestCount}
                onDatesClick={() => setIsCalendarModalOpen(true)}
                onGuestChange={(action) => {
                  if (
                    action === "increase" &&
                    guestCount < propertyData.guests_max
                  ) {
                    setGuestCount(guestCount + 1);
                  } else if (action === "decrease" && guestCount > 1) {
                    setGuestCount(guestCount - 1);
                  }
                }}
                onReserveClick={handleReserveClick}
                onOpenHostModal={() => setIsHostModalOpen(true)}
                isSaved={isSaved}
                onSaveClick={handleSaveProperty}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Button */}
      <BookingSidebarMobile
        property={propertyData}
        hostData={hostData}
        selectedDates={selectedDates}
        guestCount={guestCount}
        onReserveClick={handleReserveClick}
        onOpenHostModal={() => setIsHostModalOpen(true)}
        isSaved={isSaved}
        onSaveClick={handleSaveProperty}
      />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        images={
          propertyData.images?.map((img) => getImageUrl(img.image_url)) || []
        }
        initialIndex={galleryIndex}
        title={propertyData.title}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        selectedDates={selectedDates}
        onDateSelect={(date) => {
          if (!selectedDates.start || selectedDates.end) {
            setSelectedDates({ start: date, end: null });
          } else if (date < selectedDates.start) {
            setSelectedDates({ start: date, end: selectedDates.start });
          } else {
            setSelectedDates({ ...selectedDates, end: date });
          }
        }}
        bookedDates={propertyData.booked_dates}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={propertyData}
        selectedDates={selectedDates}
        guestCount={guestCount}
      />

      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        description={propertyData.description}
        title={propertyData.title}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        description={
          propertyData.location_description ||
          propertyExtras?.location_description
        }
        location={`${propertyData.location_city}${propertyData.location_state ? `, ${propertyData.location_state}` : ""}`}
      />

      <LocationMapModal
        isOpen={isLocationMapModalOpen}
        onClose={() => setIsLocationMapModalOpen(false)}
        latitude={propertyData.location_latitude}
        longitude={propertyData.location_longitude}
        location={`${propertyData.location_city}${propertyData.location_state ? `, ${propertyData.location_state}` : ""}`}
      />

      <HostModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        hostData={hostData}
        currentPropertyId={propertyData?.id}
      />

      <AmenitiesModal
        isOpen={isAmenitiesModalOpen}
        onClose={() => setIsAmenitiesModalOpen(false)}
        amenities={propertyData.amenities}
        customAmenities={propertyData.custom_amenities}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        rules={propertyData.rules?.custom || []}
      />

      {/* Wishlist Selection Modal */}
      <WishlistSelectionModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        onSelect={handleWishlistSelect}
        propertyId={propertyData?.id}
      />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-midnight-navy dark:text-white">
                Sign In to Book
              </h2>
              <p className="text-dusty-sky-blue dark:text-slate-400">
                You need to be logged in to complete a booking.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  const currentPath = window.location.hash.slice(1) || "/";
                  navigate(`/login?role=user&redirect=${encodeURIComponent(currentPath)}`);
                }}
                className="w-full bg-midnight-navy dark:bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-charcoal-blue dark:hover:bg-slate-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  const currentPath = window.location.hash.slice(1) || "/";
                  navigate(`/login?role=user&redirect=${encodeURIComponent(currentPath)}`);
                }}
                className="w-full bg-warm-ivory dark:bg-slate-700 text-midnight-navy dark:text-white py-3 rounded-lg font-medium hover:bg-champagne-gold/20 dark:hover:bg-slate-600 transition-colors"
              >
                Create Account
              </button>
            </div>

            <button
              onClick={() => setShowLoginPrompt(false)}
              className="w-full text-dusty-sky-blue dark:text-slate-400 py-2 hover:text-midnight-navy dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
