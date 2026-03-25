import { API_BASE_URL } from '../config/api';

// Admin API Service
class AdminService {
  // Helper method to handle API requests with automatic token expiration handling
  async handleRequest(url, options = {}) {
    const token = localStorage.getItem('admin_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401 || response.status === 403) {
        this.logout();
        window.location.href = '/'; // Redirect to home page
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      // Handle no content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Admin API Error:', error);
      throw error;
    }
  }

  async login(identifier, password) {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Invalid admin credentials' }));
      throw new Error(error.detail || 'Invalid admin credentials');
    }

    const data = await response.json();
    localStorage.setItem('admin_token', data.access_token);
    return data;
  }

  async getDashboardStats() {
    return await this.handleRequest(`${API_BASE_URL}/admin/dashboard/stats`);
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.handleRequest(`${API_BASE_URL}/admin/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return await this.handleRequest(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.handleRequest(`${API_BASE_URL}/admin/orders${queryString ? `?${queryString}` : ''}`);
  }

  async updateOrderStatus(orderId, status) {
    return await this.handleRequest(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderDetail(orderId) {
    return await this.handleRequest(`${API_BASE_URL}/admin/orders/${orderId}`);
  }

  // Users
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.handleRequest(`${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async toggleUserStatus(userId, isActive) {
    return await this.handleRequest(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // Categories
  async getCategories() {
    return await this.handleRequest(`${API_BASE_URL}/admin/categories`);
  }

  async toggleCategoryStatus(id) {
    return await this.handleRequest(`${API_BASE_URL}/admin/categories/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async createCategory(categoryData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return await this.handleRequest(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Image Uploads
  async uploadCategoryImage(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        this.logout();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to upload image' }));
        throw new Error(error.detail || 'Failed to upload image');
      }

      return response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  async uploadProductImage(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        this.logout();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to upload image' }));
        throw new Error(error.detail || 'Failed to upload image');
      }

      return response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  async getUploadedFiles(entityType, entityId) {
    return await this.handleRequest(`${API_BASE_URL}/admin/uploaded-files/${entityType}/${entityId}`);
  }

  // Banners
  async getBanners() {
    return await this.handleRequest(`${API_BASE_URL}/admin/banners`);
  }

  async createBanner(bannerData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/banners`, {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  }

  async updateBanner(id, bannerData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/banners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bannerData),
    });
  }

  async toggleBannerStatus(id, isActive) {
    return await this.handleRequest(`${API_BASE_URL}/admin/banners/${id}/toggle?is_active=${isActive}`, {
      method: 'PATCH',
    });
  }

  async uploadBannerImage(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/banners/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        this.logout();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to upload banner image' }));
        throw new Error(error.detail || 'Failed to upload banner image');
      }

      return response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  // Offers
  async getOffers() {
    return await this.handleRequest(`${API_BASE_URL}/offers/admin/all`);
  }

  async createOffer(offerData) {
    return await this.handleRequest(`${API_BASE_URL}/offers`, {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async updateOffer(id, offerData) {
    return await this.handleRequest(`${API_BASE_URL}/offers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(offerData),
    });
  }

  async deleteOffer(id) {
    return await this.handleRequest(`${API_BASE_URL}/offers/${id}`, {
      method: 'DELETE',
    });
  }

  async deactivateOffer(id) {
    return await this.handleRequest(`${API_BASE_URL}/offers/${id}/deactivate`, {
      method: 'PATCH',
    });
  }

  // App Settings (Order Limits)
  async getSettings() {
    return await this.handleRequest(`${API_BASE_URL}/admin/settings`);
  }

  async updateSettings(settingsData) {
    return await this.handleRequest(`${API_BASE_URL}/admin/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settingsData),
    });
  }

  async getTodayOrdersCount() {
    return await this.handleRequest(`${API_BASE_URL}/admin/settings/today-orders-count`);
  }

  logout() {
    localStorage.removeItem('admin_token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }
}

export const adminService = new AdminService();
