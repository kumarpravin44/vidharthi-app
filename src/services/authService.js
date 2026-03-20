import { fetchAPI, setAuthTokens, clearAuthTokens } from './api';
import { API_ENDPOINTS } from '../config/api';

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

  // Send OTP to phone
  sendOTP: async (phone) => {
    return await fetchAPI(API_ENDPOINTS.AUTH.SEND_OTP, {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Verify OTP
  verifyOTP: async (phone, code) => {
    const data = await fetchAPI(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
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
