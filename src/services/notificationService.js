import { fetchAPI } from './api';
import { API_ENDPOINTS } from '../config/api';

export const notificationService = {
  // Get user notifications
  getNotifications: async (skip = 0, limit = 30) => {
    return await fetchAPI(`${API_ENDPOINTS.NOTIFICATIONS.LIST}?skip=${skip}&limit=${limit}`);
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    return await fetchAPI(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {
      method: 'PATCH',
    });
  },

  // Mark all notifications as read
  markAllRead: async () => {
    return await fetchAPI(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
      method: 'PATCH',
    });
  },

  // Register FCM device token
  registerDevice: async (deviceToken, deviceType = 'web') => {
    return await fetchAPI(API_ENDPOINTS.NOTIFICATIONS.REGISTER_DEVICE, {
      method: 'POST',
      body: JSON.stringify({ device_token: deviceToken, device_type: deviceType }),
    });
  },

  // Get banners
  getBanners: async () => {
    return await fetchAPI(API_ENDPOINTS.BANNERS.LIST);
  },
};
