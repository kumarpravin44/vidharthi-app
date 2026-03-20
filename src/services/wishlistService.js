import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const authHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
};

export const wishlistService = {
  async getWishlist() {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WISHLIST.LIST}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async addToWishlist(productId) {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WISHLIST.ADD(productId)}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async removeFromWishlist(productId) {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WISHLIST.REMOVE(productId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async toggleWishlist(productId) {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WISHLIST.TOGGLE(productId)}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async getStatus(productId) {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WISHLIST.STATUS(productId)}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
