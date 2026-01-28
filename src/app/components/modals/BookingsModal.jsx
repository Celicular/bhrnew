import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Star,
  ChevronLeft,
} from "lucide-react";
import { api } from "@/utils/client";
import { useCurrency } from "@/context/CurrencyContext";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const STATUS_BADGES = {
  pending: { label: "Pending", color: "amber" },
  confirmed: { label: "Confirmed", color: "green" },
  rejected: { label: "Rejected", color: "red" },
  completed: { label: "Completed", color: "blue" },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "rejected", label: "Rejected" },
];

export function BookingsModal({ isOpen, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch bookings when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getBookings();

      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  if (!isOpen) return null;

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
            <div className="w-full max-w-4xl max-h-[calc(100vh-120px)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Show Booking Details if selected */}
              {selectedBooking ? (
                <BookingDetailsView
                  booking={selectedBooking}
                  onBack={() => setSelectedBooking(null)}
                  onClose={onClose}
                />
              ) : (
                <>
                  {/* Header */}
                  <div className="relative h-24 bg-gradient-to-r from-midnight-navy dark:from-slate-700 via-deep-navy dark:via-slate-700 to-midnight-navy dark:to-slate-700 px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-champagne-gold" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-lg">
                          My Bookings
                        </h2>
                        <p className="text-white/60 text-xs">
                          View and manage your reservations
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

                  {/* Filter Tabs */}
                  <div className="px-6 py-4 border-b border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 flex gap-2 overflow-x-auto">
                    {FILTER_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeFilter === tab.id
                            ? "bg-champagne-gold text-midnight-navy"
                            : "bg-warm-ivory dark:bg-slate-700 text-midnight-navy dark:text-white hover:bg-champagne-gold/20"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin">
                          <div className="w-8 h-8 border-4 border-champagne-gold/20 border-t-champagne-gold rounded-full" />
                        </div>
                      </div>
                    ) : error ? (
                      <div className="p-6">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        >
                          <p className="text-sm text-red-700 dark:text-red-400">
                            {error}
                          </p>
                        </motion.div>
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-6">
                        <Calendar className="w-12 h-12 text-soft-stone-gray/40 dark:text-dusty-sky-blue/40 mb-4" />
                        <p className="text-soft-stone-gray dark:text-dusty-sky-blue text-center">
                          No {activeFilter !== "all" ? activeFilter : ""} bookings
                          yet
                        </p>
                      </div>
                    ) : (
                      <div className="p-6 space-y-4">
                        {filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            onViewDetails={() => setSelectedBooking(booking)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BookingCard({ booking, onViewDetails }) {
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const checkInDate = parseDate(booking.check_in_date);
  const checkOutDate = parseDate(booking.check_out_date);
  const nights = Math.floor(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20 hover:shadow-lg dark:hover:shadow-lg/20 transition-all dark:bg-slate-700/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-midnight-navy dark:text-white mb-1">
            {booking.property_name}
          </h3>
          <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue">
            Booking ID: {booking.id}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            STATUS_COLORS[booking.status] || STATUS_COLORS.pending
          }`}
        >
          {STATUS_BADGES[booking.status]?.label || "Pending"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-champagne-gold" />
          <div>
            <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
              Check-in
            </p>
            <p className="text-sm font-medium text-midnight-navy dark:text-white">
              {checkInDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-champagne-gold" />
          <div>
            <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
              Check-out
            </p>
            <p className="text-sm font-medium text-midnight-navy dark:text-white">
              {checkOutDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-champagne-gold" />
          <div>
            <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
              Duration
            </p>
            <p className="text-sm font-medium text-midnight-navy dark:text-white">
              {nights} night{nights !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-2 rounded-lg bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/90 transition-all text-sm font-medium"
        >
          View Details
        </button>
        {booking.status === "completed" && (
          <button className="flex-1 px-3 py-2 rounded-lg border border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 transition-all text-sm font-medium flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            Leave Review
          </button>
        )}
      </div>
    </motion.div>
  );
}

function BookingDetailsView({ booking, onBack, onClose }) {
  const { convertPrice, symbol } = useCurrency();
  const [detailedBooking, setDetailedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [booking.id]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getBookingDetail(booking.id);

      if (response.data.success) {
        setDetailedBooking(response.data.data);
      } else {
        setError(response.data.message || "Failed to load booking details");
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.response?.data?.message || "Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const data = detailedBooking || booking;
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  
  const checkInDate = parseDate(data.check_in_date);
  const checkOutDate = parseDate(data.check_out_date);
  const nights = Math.floor(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-r from-midnight-navy dark:from-slate-700 via-deep-navy dark:via-slate-700 to-midnight-navy dark:to-slate-700 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-white font-bold text-lg">Booking Details</h2>
            <p className="text-white/60 text-xs">Booking ID: {data.id}</p>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-champagne-gold/20 border-t-champagne-gold rounded-full" />
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </motion.div>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-midnight-navy dark:text-white">
                Status:
              </h3>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  STATUS_COLORS[data.status] || STATUS_COLORS.pending
                }`}
              >
                {STATUS_BADGES[data.status]?.label || "Pending"}
              </span>
            </div>

            {/* Property Details */}
            <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
              <h3 className="font-semibold text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-champagne-gold" />
                Property
              </h3>
              <p className="text-lg font-medium text-midnight-navy dark:text-white mb-1">
                {data.property_name}
              </p>
              {data.property_address && (
                <p className="text-sm text-soft-stone-gray dark:text-dusty-sky-blue">
                  {data.property_address}
                </p>
              )}
            </div>

            {/* Stay Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-champagne-gold" />
                  Check-in
                </h4>
                <p className="text-lg font-medium text-midnight-navy dark:text-white">
                  {checkInDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-champagne-gold" />
                  Check-out
                </h4>
                <p className="text-lg font-medium text-midnight-navy dark:text-white">
                  {checkOutDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="p-4 rounded-xl bg-champagne-gold/10 dark:bg-slate-700/50 border border-champagne-gold/20">
              <h4 className="font-semibold text-midnight-navy dark:text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne-gold" />
                Stay Duration
              </h4>
              <p className="text-lg font-medium text-midnight-navy dark:text-white">
                {nights} night{nights !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Guest Breakdown */}
            {(data.adults ||
              data.children ||
              data.infants ||
              data.pets) && (
              <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-champagne-gold" />
                  Guest Breakdown
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {data.adults !== undefined && (
                    <div>
                      <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
                        Adults
                      </p>
                      <p className="text-lg font-medium text-midnight-navy dark:text-white">
                        {data.adults}
                      </p>
                    </div>
                  )}
                  {data.children !== undefined && (
                    <div>
                      <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
                        Children
                      </p>
                      <p className="text-lg font-medium text-midnight-navy dark:text-white">
                        {data.children}
                      </p>
                    </div>
                  )}
                  {data.infants !== undefined && (
                    <div>
                      <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
                        Infants
                      </p>
                      <p className="text-lg font-medium text-midnight-navy dark:text-white">
                        {data.infants}
                      </p>
                    </div>
                  )}
                  {data.pets !== undefined && (
                    <div>
                      <p className="text-xs text-soft-stone-gray dark:text-dusty-sky-blue">
                        Pets
                      </p>
                      <p className="text-lg font-medium text-midnight-navy dark:text-white">
                        {data.pets}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment & Total Amount */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-2 text-xs">
                  Payment Status
                </h4>
                <p className="text-sm font-medium text-midnight-navy dark:text-white">
                  {data.payment_status || "Not specified"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-champagne-gold/10 dark:bg-slate-700/50 border border-champagne-gold/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-champagne-gold" />
                  Total Amount
                </h4>
                <p className="text-2xl font-bold text-champagne-gold">
                  {symbol}
                  {Math.round(convertPrice(data.total_price || 0)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Special Requests */}
            {data.special_requests && (
              <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-champagne-gold" />
                  Special Requests
                </h4>
                <p className="text-sm text-midnight-navy dark:text-white">
                  {data.special_requests}
                </p>
              </div>
            )}

            {/* Host Contact Info */}
            {(data.host_name ||
              data.host_email ||
              data.host_phone) && (
              <div className="p-4 rounded-xl bg-warm-ivory dark:bg-slate-700/50 border border-soft-stone-gray/20 dark:border-dusty-sky-blue/20">
                <h4 className="font-semibold text-midnight-navy dark:text-white mb-3">
                  Host Contact
                </h4>
                <div className="space-y-2">
                  {data.host_name && (
                    <p className="text-sm text-midnight-navy dark:text-white">
                      <span className="font-medium">Name:</span> {data.host_name}
                    </p>
                  )}
                  {data.host_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-champagne-gold" />
                      <a
                        href={`mailto:${data.host_email}`}
                        className="text-sm text-champagne-gold hover:underline"
                      >
                        {data.host_email}
                      </a>
                    </div>
                  )}
                  {data.host_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-champagne-gold" />
                      <a
                        href={`tel:${data.host_phone}`}
                        className="text-sm text-champagne-gold hover:underline"
                      >
                        {data.host_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
