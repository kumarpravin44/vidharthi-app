// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/me',
    CHANGE_PASSWORD: '/auth/me/change-password',
    SEND_OTP: '/auth/otp/send',
    VERIFY_OTP: '/auth/otp/verify',
  },
  // Products & Categories
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    FULL_DETAIL: (id) => `/products/${id}/detail`,
  },
  CATEGORIES: {
    LIST: '/categories',
    NAV: '/categories/nav',
    TREE: '/categories/tree',
    DETAIL: (id) => `/categories/${id}`,
  },
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (productId) => `/cart/items/${productId}`,
    REMOVE_ITEM: (productId) => `/cart/items/${productId}`,
    CLEAR: '/cart',
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    TRACKING: (id) => `/orders/${id}/tracking`,
  },
  // Offers
  OFFERS: {
    LIST: '/offers',
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    REGISTER_DEVICE: '/notifications/register-device',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  // Banners
  BANNERS: {
    LIST: '/banners',
  },
  // Wishlist
  WISHLIST: {
    LIST: '/wishlist',
    ADD: (productId) => `/wishlist/${productId}`,
    REMOVE: (productId) => `/wishlist/${productId}`,
    TOGGLE: (productId) => `/wishlist/${productId}/toggle`,
    STATUS: (productId) => `/wishlist/${productId}/status`,
  },
  // Admin
  ADMIN: {
    BANNERS: {
      LIST: '/admin/banners',
      CREATE: '/admin/banners',
      UPDATE: (id) => `/admin/banners/${id}`,
      TOGGLE: (id) => `/admin/banners/${id}/toggle`,
    },
  },
};
