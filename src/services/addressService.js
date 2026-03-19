import { fetchAPI } from './api';
import { API_ENDPOINTS } from '../config/api';

export const addressService = {
  // Get all saved addresses
  getAddresses: async () => {
    return await fetchAPI(API_ENDPOINTS.ADDRESSES.LIST);
  },

  // Create a new address
  createAddress: async (addressData) => {
    return await fetchAPI(API_ENDPOINTS.ADDRESSES.CREATE, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  // Get address by ID
  getAddress: async (id) => {
    return await fetchAPI(API_ENDPOINTS.ADDRESSES.DETAIL(id));
  },

  // Update an address
  updateAddress: async (id, addressData) => {
    return await fetchAPI(API_ENDPOINTS.ADDRESSES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
  },

  // Delete an address
  deleteAddress: async (id) => {
    return await fetchAPI(API_ENDPOINTS.ADDRESSES.DELETE(id), {
      method: 'DELETE',
    });
  },
};
