import { fetchAPI, setAuthTokens, clearAuthTokens } from './api';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const data = await fetchAPI(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.access_token) {
      setAuthTokens(data.access_token, data.refresh_token);
    }
    return data;
  },

  // Login with phone and password
  login: async (phone, password) => {
    const data = await fetchAPI(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    setAuthTokens(data.access_token, data.refresh_token);
    return data;
  },

  // Send OTP to phone or email
  sendOTP: async (identifier) => {
    return await fetchAPI(API_ENDPOINTS.AUTH.SEND_OTP, {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  // Verify OTP
  verifyOTP: async (identifier, code) => {
    const data = await fetchAPI(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ identifier, code }),
    });
    setAuthTokens(data.access_token, data.refresh_token);
    return data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await fetchAPI(API_ENDPOINTS.AUTH.ME);
  },

  // Update profile
  updateProfile: async (userData) => {
    return await fetchAPI(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  // Upload avatar image
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.UPLOAD_AVATAR}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to upload avatar');
    }
    return await response.json();
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await fetchAPI(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },

  // Logout
  logout: () => {
    clearAuthTokens();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};
