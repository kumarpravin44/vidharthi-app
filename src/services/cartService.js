import { fetchAPI } from './api';
import { API_ENDPOINTS } from '../config/api';

export const cartService = {
  // Get user's cart
  getCart: async () => {
    return await fetchAPI(API_ENDPOINTS.CART.GET);
  },

  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    return await fetchAPI(API_ENDPOINTS.CART.ADD_ITEM, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  // Update item quantity
  updateItem: async (productId, quantity) => {
    return await fetchAPI(API_ENDPOINTS.CART.UPDATE_ITEM(productId), {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item from cart
  removeItem: async (productId) => {
    return await fetchAPI(API_ENDPOINTS.CART.REMOVE_ITEM(productId), {
      method: 'DELETE',
    });
  },

  // Clear entire cart
  clearCart: async () => {
    return await fetchAPI(API_ENDPOINTS.CART.CLEAR, {
      method: 'DELETE',
    });
  },
};
