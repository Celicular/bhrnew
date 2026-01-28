import axios from "axios";

// API Base URL
const API_BASE_URL = "https://bookholidayrental.com";
const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads/properties`;

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Utility function to construct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already an absolute URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it already contains uploads/properties, just prepend domain
  if (imagePath.includes("uploads/properties")) {
    return `${API_BASE_URL}/${imagePath}`;
  }

  // If it's a relative path starting with /, append to API base URL
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise, treat as uploads/properties path
  return `${UPLOADS_BASE_URL}/${imagePath}`;
};

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response Error:", error.message);
    return Promise.reject(error);
  },
);

// API methods
export const api = {
  // Fetch properties
  getProperties: (params = {}) => {
    const defaultParams = {
      list: 1,
      limit: 8,
      ...params,
    };
    return apiClient.get("/api/property/view.php", { params: defaultParams });
  },

  // Fetch events
  getEvents: () => {
    return apiClient.get("/api/events/list.php");
  },

  // Fetch property details
  getPropertyDetail: (propertyId) => {
    return apiClient.get(`/api/property/view.php?id=${propertyId}`);
  },

  // Fetch multiple property details
  getPropertiesDetails: (propertyIds = []) => {
    return apiClient.post("/api/property/get-by-ids.php", {
      property_ids: propertyIds,
    });
  },

  // Fetch property extras (videos, seasonal pricing, etc)
  getPropertyExtras: (propertyId) => {
    return apiClient.get(
      `/api/property/get-extras.php?property_id=${propertyId}`,
    );
  },

  // Fetch host profile
  getHostProfile: (hostId) => {
    return apiClient.get(`/api/auth/get-profile.php?id=${hostId}`);
  },

  // Fetch similar/relevant properties
  getRelevantProperties: (propertyId, limit = 4) => {
    return apiClient.get(
      `/api/property/relevant.php?property_id=${propertyId}&limit=${limit}`,
    );
  },

  // Fetch properties by host
  getHostProperties: (hostId, limit = 2, excludePropertyId = 0) => {
    return apiClient.get(
      `/api/property/by-host.php?host_id=${hostId}&limit=${limit}&exclude_property_id=${excludePropertyId}`,
    );
  },

  // Fetch exchange rates
  getExchangeRates: () => {
    return axios.get("https://api.exchangerate-api.com/v4/latest/USD");
  },

  // Fetch properties with advanced filtering
  getFilteredProperties: (filterParams = {}) => {
    return apiClient.post("/api/property/advanced-filter.php", filterParams);
  },

  // Login user
  login: (email, password, login_type = "guest") => {
    return apiClient.post("/api/login.php", {
      email,
      password,
      login_type,
    });
  },

  // Register user (Step 1)
  register: (email, password, confirmPassword, full_name, signup_type) => {
    return apiClient.post("/api/register.php", {
      email,
      password,
      confirmPassword,
      full_name,
      signup_type,
    });
  },

  // Verify OTP (Step 2)
  verifyOtp: (user_id, otp, isVerified = true) => {
    return apiClient.post("/api/verify-otp.php", {
      user_id,
      otp,
      isVerified,
    });
  },

  // Resend OTP
  resendOtp: (user_id) => {
    return apiClient.post("/api/resend-otp.php", {
      user_id,
    });
  },

  // Complete registration (Step 3)
  completeRegistration: (data) => {
    return apiClient.post("/api/auth/complete-registration.php", data);
  },

  // Logout user
  logout: () => {
    return apiClient.post("/api/logout.php", {});
  },

  // Wishlist APIs
  getWishlists: () => {
    return apiClient.get("/api/wishlist/fetch_lists.php");
  },

  createWishlist: (list_name) => {
    return apiClient.post("/api/wishlist/create_list.php", { list_name });
  },

  addPropertyToWishlist: (wishlist_id, property_id) => {
    return apiClient.post("/api/wishlist/add_property.php", {
      wishlist_id,
      property_id,
    });
  },

  removePropertyFromWishlist: (wishlist_id, property_id) => {
    return apiClient.post("/api/wishlist/remove_property.php", {
      wishlist_id,
      property_id,
    });
  },

  deleteWishlist: (wishlist_id) => {
    return apiClient.post("/api/wishlist/delete_list.php", { wishlist_id });
  },

  syncWishlistsFromLocal: (wishlists) => {
    return apiClient.post("/api/wishlist/sync_from_local.php", wishlists);
  },

  // User Profile APIs
  getUserProfile: (userId) => {
    return apiClient.get(`/api/auth/get-profile.php?id=${userId}&guest=true`);
  },

  updateGuestDetails: (guestData) => {
    return apiClient.post("api/auth/update-guest-details.php", guestData);
  },

  // Booking APIs
  getBookings: () => {
    return apiClient.get("/api/bookings/list.php");
  },

  getBookingDetail: (bookingId) => {
    return apiClient.get(`/api/bookings/detail.php?id=${bookingId}`);
  },

  createBooking: (bookingData) => {
    return apiClient.post("/api/bookings/create.php", bookingData);
  },

  // Generic GET request
  get: (url, config = {}) => apiClient.get(url, config),

  // Generic POST request
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),

  // Generic PUT request
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),

  // Generic DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
