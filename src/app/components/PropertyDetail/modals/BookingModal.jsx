import { useState } from "react";
import { motion } from "motion/react";
import { Modal } from "@/app/components/ui/Modal";
import { useCurrency } from "@/context/CurrencyContext";
import { ChevronUp, ChevronDown } from "lucide-react";
import { api } from "@/utils/client";

export function BookingModal({
  isOpen,
  onClose,
  property,
  selectedDates,
  guestCount,
}) {
  const { symbol, convertPrice, currency, exchangeRates } = useCurrency();
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
    specialRequests: "",
    paymentMethod: "card",
    agreePolicy: false,
    agreeRules: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const nights =
    selectedDates.start && selectedDates.end
      ? Math.ceil(
          (new Date(selectedDates.end) - new Date(selectedDates.start)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  // Display price in selected currency
  const convertedPrice = convertPrice(property.base_price);
  const totalPriceInSelectedCurrency = convertedPrice * nights;

  // Calculate price in USD (for API submission)
  const priceInUSD = property.base_price;
  const totalPriceInUSD = priceInUSD * nights;

  const totalGuests = formData.adults + formData.children + formData.infants;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGuestChange = (type, increment) => {
    const newValue = Math.max(0, formData[type] + (increment ? 1 : -1));

    // Check total limit
    const otherGuests = formData.adults + formData.children + formData.infants - formData[type];
    if (otherGuests + newValue <= property.guests_max) {
      setFormData((prev) => ({
        ...prev,
        [type]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.agreePolicy || !formData.agreeRules) {
      setError("Please agree to the policies and house rules");
      return;
    }

    if (!meetsMinimumStay) {
      setError(`Minimum stay of ${minimumStay} nights required`);
      return;
    }

    if (totalGuests === 0) {
      setError("Please add at least one guest");
      return;
    }

    // Prepare booking data
    const bookingPayload = {
      property_id: property.id,
      check_in_date: selectedDates.start?.toISOString().split("T")[0],
      check_out_date: selectedDates.end?.toISOString().split("T")[0],
      total_guests: totalGuests,
      total_price: Math.round(totalPriceInUSD),
      payment_method: formData.paymentMethod,
      guests_composition: {
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        pets: formData.pets,
      },
      gender_distribution: {
        male: Math.ceil(formData.adults / 2),
        female: Math.floor(formData.adults / 2),
      },
      special_requests: formData.specialRequests,
      guest_notes: `${formData.adults} adults, ${formData.children} children, ${formData.infants} infants${formData.pets > 0 ? `, ${formData.pets} pet(s)` : ""}`,
    };

    setIsLoading(true);

    try {
      const response = await api.createBooking(bookingPayload);
      const data = response.data;

      if (data.success) {
        setSuccess(true);
        console.log("Booking created successfully:", {
          booking_id: data.booking_id,
          status: data.status,
          message: data.message,
        });

        // Show success for 2 seconds then close
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            guestName: "",
            email: "",
            phone: "",
            adults: 1,
            children: 0,
            infants: 0,
            pets: 0,
            specialRequests: "",
            paymentMethod: "card",
            agreePolicy: false,
            agreeRules: false,
          });
        }, 2000);
      } else {
        // Handle specific error messages
        const errorMessage = data.message || "Booking failed. Please try again.";
        setError(errorMessage);
        console.error("Booking failed:", errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Booking error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const minimumStay = property.minimum_stay || 1;
  const meetsMinimumStay = nights >= minimumStay;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Complete Your Booking"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Summary */}
        <div className="bg-warm-ivory dark:bg-slate-700 p-4 rounded-xl">
          <h3 className="font-serif text-midnight-navy dark:text-white mb-3">
            Booking Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-slate-400">
                Property
              </span>
              <span className="font-medium text-midnight-navy dark:text-white">
                {property.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-slate-400">
                Check-in
              </span>
              <span className="font-medium text-midnight-navy dark:text-white">
                {selectedDates.start?.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-slate-400">
                Check-out
              </span>
              <span className="font-medium text-midnight-navy dark:text-white">
                {selectedDates.end?.toLocaleDateString()}
              </span>
            </div>
            {!meetsMinimumStay && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>⚠️ Minimum Stay</span>
                <span>{minimumStay} nights required</span>
              </div>
            )}
            <div className="border-t border-gray-300 dark:border-slate-600 pt-2 flex justify-between">
              <span className="font-medium text-midnight-navy dark:text-white">
                Total ({nights} nights)
              </span>
              <span className="font-serif text-lg text-champagne-gold">
                {symbol}
                {Math.round(totalPriceInSelectedCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Guests Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-midnight-navy dark:text-white text-lg">
            Guests
          </h3>
          <p className="text-sm text-dusty-sky-blue dark:text-slate-400">
            Maximum {property.guests_max} guests
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Adults", key: "adults", icon: "👨" },
              { label: "Children", key: "children", icon: "👧" },
              { label: "Infants", key: "infants", icon: "👶" },
              { label: "Pets", key: "pets", icon: "🐾" },
            ].map(({ label, key, icon }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-midnight-navy dark:text-white">
                  {icon} {label}
                </label>
                <div className="flex items-center justify-between bg-warm-ivory dark:bg-slate-700 p-2 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleGuestChange(key, false)}
                    disabled={formData[key] <= 0}
                    className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4 text-midnight-navy dark:text-white" />
                  </button>
                  <span className="font-medium text-midnight-navy dark:text-white">
                    {formData[key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGuestChange(key, true)}
                    disabled={totalGuests >= property.guests_max || (key !== "pets" && formData[key] >= property.guests_max)}
                    className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4 text-midnight-navy dark:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalGuests > 0 && (
            <div className="text-sm text-midnight-navy dark:text-white font-medium">
              Total: {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Extras Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-midnight-navy dark:text-white text-lg">
            Extras & Notes
          </h3>

          <div>
            <label className="block text-sm font-medium text-midnight-navy dark:text-white mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-midnight-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold resize-none"
              rows="3"
              placeholder="Let the host know about any special requests (early check-in, late check-out, etc.)"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-midnight-navy dark:text-white text-lg">
              Payment Method
            </h3>
            <span className="text-xs bg-champagne-gold/20 text-champagne-gold px-3 py-1 rounded-full font-medium">
              Secure
            </span>
          </div>
          <p className="text-xs text-dusty-sky-blue dark:text-slate-400">
            ℹ️ Payment is tracked but not charged immediately. You'll complete payment at checkout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "card", label: "Credit/Debit Card", icon: "💳", desc: "Visa, Mastercard, Amex" },
              { value: "paypal", label: "PayPal", icon: "🅿️", desc: "Fast & Secure" },
              { value: "google_pay", label: "Google Pay", icon: "🔷", desc: "One-tap checkout" },
            ].map(({ value, label, icon, desc }) => (
              <label
                key={value}
                className="flex flex-col gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
                style={{
                  borderColor:
                    formData.paymentMethod === value
                      ? "var(--champagne-gold)"
                      : "rgba(0, 0, 0, 0.1)",
                  backgroundColor:
                    formData.paymentMethod === value
                      ? "rgba(210, 180, 140, 0.15)"
                      : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={formData.paymentMethod === value}
                    onChange={handleInputChange}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-semibold text-midnight-navy dark:text-white">
                      {label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-dusty-sky-blue dark:text-slate-400 ml-8">
                  {desc}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-bone-white dark:bg-slate-700 p-4 rounded-lg space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreePolicy"
              checked={formData.agreePolicy}
              onChange={handleInputChange}
              className="w-4 h-4 mt-1 cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-slate-300">
              I agree to the cancellation policy
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeRules"
              checked={formData.agreeRules}
              onChange={handleInputChange}
              className="w-4 h-4 mt-1 cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-slate-300">
              I agree to the house rules
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              ✕ {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Booking created successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={!meetsMinimumStay || totalGuests === 0 || isLoading || success}
            className="w-full py-3 bg-midnight-navy dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-charcoal-blue dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Checkout"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border-2 border-gray-300 dark:border-slate-600 text-midnight-navy dark:text-white rounded-lg font-medium hover:border-champagne-gold dark:hover:border-champagne-gold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
