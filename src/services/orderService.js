import { fetchAPI } from './api';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  // Get user's orders
  getOrders: async (skip = 0, limit = 20) => {
    return await fetchAPI(`${API_ENDPOINTS.ORDERS.LIST}?skip=${skip}&limit=${limit}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return await fetchAPI(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get order by ID
  getOrder: async (id) => {
    return await fetchAPI(API_ENDPOINTS.ORDERS.DETAIL(id));
  },

  // Get order tracking
  getOrderTracking: async (id) => {
    return await fetchAPI(API_ENDPOINTS.ORDERS.TRACKING(id));
  },
};
